import { BaseProvider } from "./base-provider.js";

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export class MockProvider extends BaseProvider {
  constructor() {
    super("mock");
  }

  async process(jobContext) {
    await delay(250);

    return {
      predictions: {
        category: jobContext.categoryHint || "unknown",
        subCategory: null
      },
      artifacts: {
        maskImagePath: null,
        standardImagePath: null
      },
      review: {
        requiresHumanReview: true,
        reasons: [
          "当前接入的是 Mock Provider，只提供任务编排，不输出真实标准图。",
          "接入真实 AI Provider 后，这里将返回抠图与标准图。"
        ]
      },
      quality: {
        score: null,
        summary: "Provider placeholder"
      }
    };
  }
}
