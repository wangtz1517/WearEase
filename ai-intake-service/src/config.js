import path from "node:path";

const rootDir = process.cwd();
const workspaceDir = path.resolve(rootDir, "..");
const storageDir = process.env.STORAGE_DIR
  ? path.resolve(rootDir, process.env.STORAGE_DIR)
  : path.resolve(rootDir, "storage");

export const config = {
  port: Number(process.env.PORT || 8123),
  provider: process.env.AI_PROVIDER || "mock",
  storageDir,
  uploadsDir: path.join(storageDir, "uploads"),
  jobsDir: path.join(storageDir, "jobs"),
  workspaceDir,
  testSourceDir: path.join(workspaceDir, "assets", "ai-test", "source"),
  volcengineApiKey: process.env.VOLCENGINE_API_KEY || "",
  volcengineBaseUrl: process.env.VOLCENGINE_BASE_URL || "https://ark.cn-beijing.volces.com/api/v3",
  volcengineImageModel: process.env.VOLCENGINE_IMAGE_MODEL || "doubao-seedream-5-0-260128"
};
