import fs from "node:fs/promises";
import path from "node:path";
import { config } from "./config.js";

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function ensureStorage() {
  await ensureDir(config.storageDir);
  await ensureDir(config.uploadsDir);
  await ensureDir(config.jobsDir);
}

function getJobFilePath(jobId) {
  return path.join(config.jobsDir, `${jobId}.json`);
}

export async function saveJob(job) {
  await ensureStorage();
  await fs.writeFile(getJobFilePath(job.id), JSON.stringify(job, null, 2), "utf8");
}

export async function loadJob(jobId) {
  try {
    const raw = await fs.readFile(getJobFilePath(jobId), "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

export async function writeDataUrlToFile(dataUrl, targetPath) {
  const match = /^data:(.+?);base64,(.+)$/.exec(dataUrl || "");

  if (!match) {
    throw new Error("Invalid sourceImageDataUrl.");
  }

  const [, mimeType, base64Payload] = match;
  const buffer = Buffer.from(base64Payload, "base64");

  await ensureDir(path.dirname(targetPath));
  await fs.writeFile(targetPath, buffer);

  return {
    mimeType,
    size: buffer.length
  };
}
