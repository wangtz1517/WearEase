import crypto from "node:crypto";
import path from "node:path";
import { config } from "../config.js";
import { loadJob, saveJob, writeDataUrlToFile } from "../job-store.js";

function now() {
  return new Date().toISOString();
}

function createJobId() {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  const suffix = crypto.randomBytes(3).toString("hex");
  return `job_${stamp}_${suffix}`;
}

function extFromMime(mimeType) {
  if (mimeType === "image/jpeg") {
    return "jpg";
  }

  if (mimeType === "image/webp") {
    return "webp";
  }

  return "png";
}

function publicArtifactUrl(jobId, kind) {
  return `/api/intake/jobs/${jobId}/artifacts/${kind}`;
}

async function patchJob(jobId, updater) {
  const job = await loadJob(jobId);

  if (!job) {
    throw new Error(`Job not found: ${jobId}`);
  }

  const next = updater(job);
  next.updatedAt = now();
  await saveJob(next);
  return next;
}

export async function createJob(payload, provider) {
  if (!payload || !payload.sourceImageDataUrl) {
    throw new Error("sourceImageDataUrl is required.");
  }

  const jobId = createJobId();
  const mimeMatch = /^data:(.+?);base64,/.exec(payload.sourceImageDataUrl);
  const mimeType = mimeMatch?.[1] || "image/png";
  const sourceFilename = payload.sourceFilename || `upload.${extFromMime(mimeType)}`;
  const uploadFilename = `${jobId}-source.${extFromMime(mimeType)}`;
  const sourcePath = path.join(config.uploadsDir, uploadFilename);
  const sourceInfo = await writeDataUrlToFile(payload.sourceImageDataUrl, sourcePath);

  const job = {
    id: jobId,
    status: "queued",
    provider: provider.name,
    categoryHint: payload.categoryHint || null,
    garmentName: payload.garmentName || null,
    notes: payload.notes || null,
    source: {
      filename: sourceFilename,
      mimeType: sourceInfo.mimeType,
      size: sourceInfo.size,
      path: sourcePath
    },
    steps: {
      ingest: "completed",
      segmentation: "pending",
      understanding: "pending",
      canonicalization: "pending",
      generation: "pending",
      review: "pending"
    },
    predictions: {
      category: null,
      subCategory: null
    },
    artifacts: {
      sourceImagePath: sourcePath,
      sourceImageUrl: publicArtifactUrl(jobId, "source"),
      maskImagePath: null,
      maskImageUrl: null,
      standardImagePath: null,
      standardImageUrl: null
    },
    review: {
      requiresHumanReview: true,
      reasons: []
    },
    quality: {
      score: null,
      summary: null
    },
    createdAt: now(),
    updatedAt: now()
  };

  await saveJob(job);
  runJob(jobId, provider).catch(async (error) => {
    await patchJob(jobId, (current) => ({
      ...current,
      status: "failed",
      review: {
        requiresHumanReview: true,
        reasons: [...current.review.reasons, error.message]
      },
      steps: {
        ...current.steps,
        review: "failed"
      }
    }));
  });

  return job;
}

export async function runJob(jobId, provider) {
  await patchJob(jobId, (job) => ({
    ...job,
    status: "processing",
    steps: {
      ...job.steps,
      segmentation: "processing"
    }
  }));

  await patchJob(jobId, (job) => ({
    ...job,
    steps: {
      ...job.steps,
      segmentation: "completed",
      understanding: "processing"
    }
  }));

  const currentJob = await loadJob(jobId);
  const providerResult = await provider.process(currentJob);

  await patchJob(jobId, (job) => ({
    ...job,
    status: "needs_review",
    predictions: providerResult.predictions || job.predictions,
    artifacts: {
      ...job.artifacts,
      ...(providerResult.artifacts?.maskImagePath
        ? {
            maskImagePath: providerResult.artifacts.maskImagePath,
            maskImageUrl: publicArtifactUrl(job.id, "mask")
          }
        : {}),
      ...(providerResult.artifacts?.standardImagePath
        ? {
            standardImagePath: providerResult.artifacts.standardImagePath,
            standardImageUrl: publicArtifactUrl(job.id, "standard")
          }
        : {})
    },
    review: providerResult.review || job.review,
    quality: providerResult.quality || job.quality,
    steps: {
      ...job.steps,
      understanding: "completed",
      canonicalization: "completed",
      generation: providerResult.artifacts?.standardImagePath ? "completed" : "placeholder",
      review: "completed"
    }
  }));
}
