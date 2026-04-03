import fs from "node:fs/promises";
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
    return "bottom garment";
  }

  if (category === "outer") {
    return "outerwear";
  }

  if (category === "dress") {
    return "dress";
  }

  if (category === "accessory") {
    return "accessory";
  }

  return "top garment";
}

function getCategoryRequirement(category) {
  if (category === "bottom") {
    return "Preserve waistline, rise, leg shape, pleats, pockets, and hem length details.";
  }

  if (category === "outer") {
    return "Preserve collar, lapel, placket, zipper, quilting, pockets, and overall silhouette.";
  }

  if (category === "dress") {
    return "Preserve neckline, waist shape, skirt volume, straps, sleeves, and drape.";
  }

  if (category === "accessory") {
    return "Preserve the exact shape, hardware, closure, straps, sole, and decorative details.";
  }

  return "Preserve neckline, sleeves, hem shape, buttons, prints, logos, and fabric details.";
}

function buildPrompt(jobContext) {
  const category = jobContext?.categoryHint || "top";
  const categoryLabel = getCategoryLabel(category);
  const categoryRequirement = getCategoryRequirement(category);

  return [
    "Transform the uploaded garment photo into a single clean wardrobe catalog image.",
    `Garment category: ${categoryLabel}.`,
    categoryRequirement,
    "Use the uploaded photo as the only garment reference.",
    "Keep the original garment design, color, silhouette, texture, trims, prints, logos, and proportions accurate.",
    "Preserve real garment lettering or branding only when it already exists on the clothing in the uploaded photo.",
    "Do not add any extra text, captions, labels, price tags, typography, packaging graphics, stickers, badges, watermarks, or decorative letters anywhere in the image.",
    "Remove body parts, hands, hangers, mannequins, background clutter, mirrors, furniture, and extra objects.",
    "Output one centered isolated garment, front-facing where possible, on a simple clean background.",
    "Do not create a poster, product card, collage, mood board, or layout with design elements around the garment.",
    "The result should look like a polished wardrobe inventory image suitable for a digital closet."
  ].join(" ");
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
          "Seedream generation completed. Review garment details before saving.",
          "Check silhouette, color, and small design details because this local provider does not apply an explicit segmentation mask."
        ]
      },
      quality: {
        score: null,
        summary: "Seedream generation completed"
      }
    };
  }
}
