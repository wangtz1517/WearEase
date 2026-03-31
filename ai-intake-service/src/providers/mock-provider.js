import fs from "node:fs/promises";
import path from "node:path";
import { BaseProvider } from "./base-provider.js";

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function buildArtifactPath(sourcePath, suffix) {
  if (!sourcePath) {
    return null;
  }

  const ext = path.extname(sourcePath) || ".png";
  return sourcePath.replace(/-source\.[^.]+$/i, `-${suffix}${ext}`);
}

export class MockProvider extends BaseProvider {
  constructor() {
    super("mock");
  }

  async process(jobContext) {
    await delay(250);

    const sourcePath = jobContext?.artifacts?.sourceImagePath || jobContext?.source?.path || null;
    const maskImagePath = buildArtifactPath(sourcePath, "mask");
    const standardImagePath = buildArtifactPath(sourcePath, "standard");

    if (sourcePath && maskImagePath) {
      await fs.copyFile(sourcePath, maskImagePath);
    }

    if (sourcePath && standardImagePath) {
      await fs.copyFile(sourcePath, standardImagePath);
    }

    return {
      predictions: {
        category: jobContext.categoryHint || "unknown",
        subCategory: null
      },
      artifacts: {
        maskImagePath,
        standardImagePath
      },
      review: {
        requiresHumanReview: true,
        reasons: [
          "当前接入的是 Mock Provider，只验证任务编排和网页联调。",
          "mask 和 standard 产物目前复用原图占位，接入真实 AI Provider 后再替换为真实结果。"
        ]
      },
      quality: {
        score: 0.2,
        summary: "Mock provider placeholder artifacts"
      }
    };
  }
}
