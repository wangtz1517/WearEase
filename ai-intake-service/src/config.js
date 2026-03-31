import path from "node:path";

const rootDir = process.cwd();
const storageDir = process.env.STORAGE_DIR
  ? path.resolve(rootDir, process.env.STORAGE_DIR)
  : path.resolve(rootDir, "storage");

export const config = {
  port: Number(process.env.PORT || 8123),
  provider: process.env.AI_PROVIDER || "mock",
  storageDir,
  uploadsDir: path.join(storageDir, "uploads"),
  jobsDir: path.join(storageDir, "jobs")
};
