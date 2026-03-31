import fs from "node:fs/promises";
import path from "node:path";
import { BaseProvider } from "./base-provider.js";

function extFromMime(mimeType) {
  if (mimeType === "image/jpeg") {
    return "jpg";
  }

  if (mimeType === "image/webp") {
    return "webp";
  }

  return "png";
}

function buildStandardImagePath(jobContext) {
  const sourcePath = jobContext?.artifacts?.sourceImagePath || jobContext?.source?.path || "";
  const extension = extFromMime(jobContext?.source?.mimeType || "image/png");

  if (!sourcePath) {
    return null;
  }

  return sourcePath.replace(/-source\.[^.]+$/i, `-standard.${extension}`);
}

function getCategoryLabel(category) {
  if (category === "bottom") {
    return "裤子";
  }

  if (category === "outer") {
    return "外套";
  }

  if (category === "dress") {
    return "裙装";
  }

  if (category === "accessory") {
    return "鞋包配饰";
  }

  return "上衣";
}

function getCategoryRequirement(category) {
  if (category === "bottom") {
    return "如果输入是裤子，输出必须仍然是同一条裤子，绝对不能变成上衣、外套、裙子或其他品类。裤腰、裤腿、裤脚必须完整可见，裤腿自然展开，左右结构清楚。";
  }

  if (category === "outer") {
    return "如果输入是外套，输出必须仍然是同一件外套，门襟、衣身、袖子要完整，不能变成普通上衣。";
  }

  if (category === "dress") {
    return "如果输入是裙装，输出必须仍然是同一件裙装，裙摆完整展开，不能改成上衣加下装。";
  }

  if (category === "accessory") {
    return "如果输入是配饰，输出必须仍然是同一件配饰，不要生成额外物品。";
  }

  return "如果输入是上衣，输出必须仍然是同一件上衣，领口、肩线、袖子、下摆完整，不要变成裤子、外套或裙装。";
}

function buildPrompt(jobContext) {
  const garmentName = jobContext?.garmentName?.trim() || "一件衣物";
  const category = jobContext?.categoryHint || "top";
  const categoryLabel = getCategoryLabel(category);
  const categoryRequirement = getCategoryRequirement(category);

  return [
    "请严格基于输入图片中的同一件衣物进行再呈现。",
    "不要更换品类，不要更换款式，不要更换颜色，不要更换图案，不要更换材质，不要更换结构。",
    `衣物类型：${categoryLabel}。`,
    `衣物名称：${garmentName}。`,
    categoryRequirement,
    "最终只能输出一件衣物，画面中禁止出现第二件、第三件或重复衣物。",
    "禁止生成模特、人体、手、衣架、货架、背景场景、装饰物、文字、水印或品牌海报元素。",
    "请生成正式、标准、可归档的服装展示图：正面视角，单件主体，居中构图，背景干净。",
    "衣物边界必须完整，不要裁掉左右两侧、袖口、裤脚、下摆或领口。",
    "尽量整理和平顺衣物，减少褶皱，避免严重折叠感和扭曲感。",
    "如果原图有轻微折叠或局部遮挡，请在保持同一件衣物一致性的前提下做合理展开，但不要凭空改变设计。",
    "输出图应该像电商或归档用的标准单品图，而不是场景图或穿搭图。"
  ].join("");
}

function getGeneratedImageUrl(payload) {
  if (Array.isArray(payload?.data) && payload.data[0]?.url) {
    return payload.data[0].url;
  }

  if (Array.isArray(payload?.images) && payload.images[0]?.url) {
    return payload.images[0].url;
  }

  return null;
}

async function readSourceDataUrl(jobContext) {
  const sourcePath = jobContext?.artifacts?.sourceImagePath || jobContext?.source?.path;

  if (!sourcePath) {
    throw new Error("Source image path is missing.");
  }

  const buffer = await fs.readFile(sourcePath);
  const mimeType = jobContext?.source?.mimeType || "image/png";

  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

async function downloadFile(url, targetPath, apiKey) {
  const response = await fetch(url, {
    headers: apiKey
      ? {
          Authorization: `Bearer ${apiKey}`
        }
      : undefined
  });

  if (!response.ok) {
    throw new Error(`Failed to download generated image: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  await fs.writeFile(targetPath, Buffer.from(arrayBuffer));
}

export class SeedreamProvider extends BaseProvider {
  constructor(options) {
    super("seedream");
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl.replace(/\/$/, "");
    this.model = options.model;
  }

  async process(jobContext) {
    if (!this.apiKey) {
      throw new Error("VOLCENGINE_API_KEY is required for Seedream provider.");
    }

    const inputImage = await readSourceDataUrl(jobContext);
    const prompt = buildPrompt(jobContext);
    const response = await fetch(`${this.baseUrl}/images/generations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        prompt,
        image: inputImage,
        response_format: "url",
        size: "2K",
        stream: false,
        watermark: false
      })
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(payload?.error?.message || payload?.message || `Seedream request failed: ${response.status}`);
    }

    const generatedImageUrl = getGeneratedImageUrl(payload);

    if (!generatedImageUrl) {
      throw new Error("Seedream response did not include a generated image URL.");
    }

    const standardImagePath = buildStandardImagePath(jobContext);

    if (!standardImagePath) {
      throw new Error("Failed to allocate output image path.");
    }

    await downloadFile(generatedImageUrl, standardImagePath, this.apiKey);

    return {
      predictions: {
        category: jobContext.categoryHint || "unknown",
        subCategory: null
      },
      artifacts: {
        maskImagePath: null,
        standardImagePath
      },
      review: {
        requiresHumanReview: true,
        reasons: [
          "已调用 Seedream 真实接口生成标准图，当前仍建议人工检查版型、颜色和细节一致性。",
          "当前版本尚未接入独立抠图或结构理解模型，因此 mask 产物为空。"
        ]
      },
      quality: {
        score: null,
        summary: "Seedream generation completed"
      }
    };
  }
}
