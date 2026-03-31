import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { config } from "./config.js";
import { ensureStorage, loadJob } from "./job-store.js";
import { MockProvider } from "./providers/mock-provider.js";
import { SeedreamProvider } from "./providers/seedream-provider.js";
import { createJob } from "./services/intake-pipeline.js";

function createProvider() {
  if (config.provider === "seedream") {
    return new SeedreamProvider({
      apiKey: config.volcengineApiKey,
      baseUrl: config.volcengineBaseUrl,
      model: config.volcengineImageModel
    });
  }

  return new MockProvider();
}

const provider = createProvider();

const allowedImageExtensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".bmp", ".gif", ".tiff"]);

function setCorsHeaders(response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function sendJson(response, statusCode, body) {
  setCorsHeaders(response);
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body, null, 2));
}

async function readJsonBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  if (!chunks.length) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

async function serveArtifact(response, filePath) {
  try {
    const buffer = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = ext === ".jpg" || ext === ".jpeg"
      ? "image/jpeg"
      : ext === ".webp"
        ? "image/webp"
        : "image/png";

    setCorsHeaders(response);
    response.writeHead(200, { "Content-Type": contentType });
    response.end(buffer);
  } catch (error) {
    sendJson(response, 404, { error: "Artifact not found." });
  }
}

async function listTestSourceAssets() {
  const entries = await fs.readdir(config.testSourceDir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && allowedImageExtensions.has(path.extname(entry.name).toLowerCase()))
    .sort((left, right) => left.name.localeCompare(right.name, "zh-CN"))
    .map((entry, index) => ({
      id: `source_${index + 1}`,
      name: entry.name,
      url: `/api/test-assets/source/${encodeURIComponent(entry.name)}`
    }));
}

function resolveSafeTestSourcePath(filename) {
  const decoded = decodeURIComponent(filename);
  const fullPath = path.resolve(config.testSourceDir, decoded);
  const relative = path.relative(config.testSourceDir, fullPath);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    return null;
  }

  return fullPath;
}

async function handleRequest(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const pathname = url.pathname;

  if (request.method === "OPTIONS") {
    setCorsHeaders(response);
    response.writeHead(204);
    response.end();
    return;
  }

  if (request.method === "GET" && pathname === "/health") {
    sendJson(response, 200, {
      ok: true,
      provider: provider.name,
      port: config.port
    });
    return;
  }

  if (request.method === "GET" && pathname === "/api/test-assets/source") {
    try {
      const items = await listTestSourceAssets();
      sendJson(response, 200, { items });
    } catch (error) {
      sendJson(response, 500, { error: "Failed to list test assets." });
    }
    return;
  }

  const testAssetMatch = pathname.match(/^\/api\/test-assets\/source\/(.+)$/);
  if (request.method === "GET" && testAssetMatch) {
    const safePath = resolveSafeTestSourcePath(testAssetMatch[1]);

    if (!safePath) {
      sendJson(response, 400, { error: "Invalid asset path." });
      return;
    }

    await serveArtifact(response, safePath);
    return;
  }

  if (request.method === "POST" && pathname === "/api/intake/jobs") {
    try {
      const payload = await readJsonBody(request);
      const job = await createJob(payload, provider);

      sendJson(response, 201, {
        jobId: job.id,
        status: job.status
      });
    } catch (error) {
      sendJson(response, 400, {
        error: error.message || "Failed to create job."
      });
    }
    return;
  }

  const jobMatch = pathname.match(/^\/api\/intake\/jobs\/([^/]+)$/);
  if (request.method === "GET" && jobMatch) {
    const job = await loadJob(jobMatch[1]);

    if (!job) {
      sendJson(response, 404, { error: "Job not found." });
      return;
    }

    sendJson(response, 200, job);
    return;
  }

  const artifactMatch = pathname.match(/^\/api\/intake\/jobs\/([^/]+)\/artifacts\/([^/]+)$/);
  if (request.method === "GET" && artifactMatch) {
    const [, jobId, kind] = artifactMatch;
    const job = await loadJob(jobId);

    if (!job) {
      sendJson(response, 404, { error: "Job not found." });
      return;
    }

    if (kind === "source" && job.artifacts.sourceImagePath) {
      await serveArtifact(response, job.artifacts.sourceImagePath);
      return;
    }

    if (kind === "mask" && job.artifacts.maskImagePath) {
      await serveArtifact(response, job.artifacts.maskImagePath);
      return;
    }

    if (kind === "standard" && job.artifacts.standardImagePath) {
      await serveArtifact(response, job.artifacts.standardImagePath);
      return;
    }

    sendJson(response, 404, { error: "Artifact not found." });
    return;
  }

  sendJson(response, 404, { error: "Not found." });
}

await ensureStorage();

const server = http.createServer((request, response) => {
  handleRequest(request, response).catch((error) => {
    sendJson(response, 500, {
      error: error.message || "Internal server error."
    });
  });
});

server.listen(config.port, () => {
  console.log(`AI Intake Service running on http://127.0.0.1:${config.port}`);
});
