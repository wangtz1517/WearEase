import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const AI_PROVIDER = (Deno.env.get("AI_PROVIDER") || "seedream").trim().toLowerCase();
const VOLCENGINE_API_KEY = Deno.env.get("VOLCENGINE_API_KEY") || "";
const VOLCENGINE_BASE_URL = (Deno.env.get("VOLCENGINE_BASE_URL") || "https://ark.cn-beijing.volces.com/api/v3").replace(/\/$/, "");
const DEFAULT_VOLCENGINE_IMAGE_MODEL = "doubao-seedream-5-0-260128";
const VOLCENGINE_INTAKE_IMAGE_MODEL =
  (Deno.env.get("VOLCENGINE_INTAKE_IMAGE_MODEL") || Deno.env.get("VOLCENGINE_IMAGE_MODEL") || DEFAULT_VOLCENGINE_IMAGE_MODEL).trim();
const GARMENT_IMAGES_BUCKET = Deno.env.get("GARMENT_IMAGES_BUCKET") || "garment-images";
const MAX_SOURCE_DATA_URL_LENGTH = 5_500_000;
const VOLCENGINE_REQUEST_TIMEOUT_MS = 90_000;
const VOLCENGINE_DOWNLOAD_TIMEOUT_MS = 30_000;

const categoryLabels: Record<string, string> = {
  top: "top",
  bottom: "bottom",
  outer: "outerwear",
  dress: "dress",
  accessory: "accessory"
};

const categoryPromptHints: Record<string, string> = {
  top: "Preserve neckline, sleeves, hem shape, buttons, prints, logos, and fabric details.",
  bottom: "Preserve waistline, rise, leg shape, pleats, pockets, and length details.",
  outer: "Preserve collar, lapel, placket, zipper, quilting, pockets, and silhouette.",
  dress: "Preserve neckline, waist shape, skirt silhouette, straps, sleeves, and drape.",
  accessory: "Preserve the exact shape, hardware, closure, straps, and decorative details."
};

type IntakePayload = {
  sourceImageDataUrl?: string;
  sourceFilename?: string;
  categoryHint?: string;
  garmentName?: string;
  notes?: string;
};

type AuthenticatedUser = {
  id: string;
  email?: string | null;
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8"
    }
  });
}

function getSupabaseUserClient(authHeader: string) {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: authHeader
      }
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
}

function getSupabaseAdminClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
}

function requireConfiguredEnv() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase function environment is incomplete.");
  }
}

async function requireAuthenticatedUser(request: Request): Promise<AuthenticatedUser> {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader) {
    throw new Error("Please sign in before using AI intake.");
  }

  const supabase = getSupabaseUserClient(authHeader);
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Your session is invalid. Please sign in again.");
  }

  return {
    id: user.id,
    email: user.email
  };
}

function parseDataUrl(dataUrl: string) {
  const match = /^data:(.+?);base64,(.+)$/.exec(dataUrl || "");

  if (!match) {
    throw new Error("sourceImageDataUrl must be a valid base64 image.");
  }

  const [, mimeType, payload] = match;
  const bytes = Uint8Array.from(atob(payload), (char) => char.charCodeAt(0));

  return {
    mimeType,
    bytes
  };
}

function getExtensionFromMimeType(mimeType = "image/png") {
  if (mimeType === "image/jpeg") {
    return "jpg";
  }

  if (mimeType === "image/webp") {
    return "webp";
  }

  return "png";
}

function sanitizeFilename(name = "upload.png") {
  const trimmed = name.trim() || "upload.png";
  return trimmed.replace(/[^\w.\-]+/g, "-").replace(/-+/g, "-");
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
  timeoutMessage: string
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(timeoutMessage);
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

function buildPrompt(payload: IntakePayload) {
  const category = payload.categoryHint || "top";
  const categoryLabel = categoryLabels[category] || "garment";
  const categoryHint = categoryPromptHints[category] || categoryPromptHints.top;

  // Keep the prompt grounded in the uploaded pixels. Text-heavy metadata can cause label hallucinations.
  return [
    "Transform the uploaded garment photo into a single clean wardrobe catalog image.",
    `Garment category: ${categoryLabel}.`,
    categoryHint,
    "Use the uploaded photo as the only garment reference.",
    "Keep the original garment design, color, silhouette, texture, trims, prints, logos, and proportions accurate.",
    "Preserve real garment lettering or branding only when it already exists on the clothing in the uploaded photo.",
    "Do not add any extra text, captions, labels, price tags, typography, packaging graphics, stickers, badges, watermarks, or decorative letters anywhere in the image.",
    "Remove body parts, hands, hangers, mannequins, background clutter, mirrors, furniture, and extra objects.",
    "Output one centered isolated garment, front-facing where possible, on a simple clean background.",
    "Do not create a poster, product card, collage, mood board, or layout with design elements around the garment.",
    "The result should look like a polished wardrobe inventory image suitable for a digital closet."
  ]
    .filter(Boolean)
    .join(" ");
}

function getGeneratedImageUrl(payload: Record<string, unknown> | null) {
  if (Array.isArray(payload?.data) && payload.data[0] && typeof payload.data[0] === "object") {
    const url = (payload.data[0] as { url?: string }).url;
    if (url) {
      return url;
    }
  }

  if (Array.isArray(payload?.images) && payload.images[0] && typeof payload.images[0] === "object") {
    const url = (payload.images[0] as { url?: string }).url;
    if (url) {
      return url;
    }
  }

  return "";
}

async function uploadOutputImage(options: {
  userId: string;
  sourceFilename?: string;
  blob: Blob;
  contentType: string;
}) {
  const admin = getSupabaseAdminClient();
  const extension = getExtensionFromMimeType(options.contentType);
  const filename = sanitizeFilename(options.sourceFilename || `ai-output.${extension}`).replace(/\.[^.]+$/, "");
  const objectPath = `${options.userId}/ai-intake/${Date.now()}-${crypto.randomUUID()}-${filename}.${extension}`;

  const { error: uploadError } = await admin.storage
    .from(GARMENT_IMAGES_BUCKET)
    .upload(objectPath, options.blob, {
      contentType: options.contentType,
      cacheControl: "3600",
      upsert: false
    });

  if (uploadError) {
    throw new Error(uploadError.message || "Failed to upload AI output image.");
  }

  const {
    data: { publicUrl }
  } = admin.storage.from(GARMENT_IMAGES_BUCKET).getPublicUrl(objectPath);

  return {
    path: objectPath,
    publicUrl
  };
}

async function runMockProvider(user: AuthenticatedUser, payload: IntakePayload) {
  const { bytes, mimeType } = parseDataUrl(payload.sourceImageDataUrl || "");
  const blob = new Blob([bytes], { type: mimeType });
  const uploaded = await uploadOutputImage({
    userId: user.id,
    sourceFilename: payload.sourceFilename,
    blob,
    contentType: mimeType
  });

  return {
    status: "completed",
    provider: "mock",
    output: {
      imageUrl: uploaded.publicUrl,
      path: uploaded.path,
      mimeType,
      size: blob.size
    },
    review: {
      requiresHumanReview: false,
      reasons: ["Mock provider returned the uploaded source image."]
    }
  };
}

async function runSeedreamProvider(user: AuthenticatedUser, payload: IntakePayload) {
  if (!VOLCENGINE_API_KEY) {
    throw new Error("VOLCENGINE_API_KEY is not configured.");
  }

  const prompt = buildPrompt(payload);
  const response = await fetchWithTimeout(
    `${VOLCENGINE_BASE_URL}/images/generations`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${VOLCENGINE_API_KEY}`
      },
      body: JSON.stringify({
        model: VOLCENGINE_INTAKE_IMAGE_MODEL,
        prompt,
        image: payload.sourceImageDataUrl,
        response_format: "url",
        size: "2K",
        stream: false,
        watermark: false
      })
    },
    VOLCENGINE_REQUEST_TIMEOUT_MS,
    "Volcengine image generation timed out. Please try again later."
  );

  const providerPayload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (providerPayload && typeof providerPayload === "object" && "error" in providerPayload
        ? (providerPayload.error as { message?: string })?.message
        : "") ||
      (providerPayload && typeof providerPayload === "object" && "message" in providerPayload
        ? String(providerPayload.message || "")
        : "") ||
      `Volcengine request failed with status ${response.status}.`;

    throw new Error(message);
  }

  const generatedImageUrl = getGeneratedImageUrl(providerPayload as Record<string, unknown> | null);

  if (!generatedImageUrl) {
    throw new Error("Volcengine response did not include a generated image URL.");
  }

  const generatedResponse = await fetchWithTimeout(
    generatedImageUrl,
    {
      headers: {
        Authorization: `Bearer ${VOLCENGINE_API_KEY}`
      }
    },
    VOLCENGINE_DOWNLOAD_TIMEOUT_MS,
    "Downloading the generated image timed out. Please try again later."
  );

  if (!generatedResponse.ok) {
    throw new Error(`Failed to download generated image: ${generatedResponse.status}.`);
  }

  const outputBlob = await generatedResponse.blob();
  const outputContentType = outputBlob.type || generatedResponse.headers.get("content-type") || "image/png";
  const uploaded = await uploadOutputImage({
    userId: user.id,
    sourceFilename: payload.sourceFilename,
    blob: outputBlob,
    contentType: outputContentType
  });

  return {
    status: "completed",
    provider: "seedream",
    output: {
      imageUrl: uploaded.publicUrl,
      path: uploaded.path,
      mimeType: outputContentType,
      size: outputBlob.size
    },
    review: {
      requiresHumanReview: true,
      reasons: ["AI generation completed. Review garment details before saving."]
    }
  };
}

async function handleIntake(request: Request) {
  requireConfiguredEnv();

  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }

  try {
    const user = await requireAuthenticatedUser(request);
    const payload = (await request.json()) as IntakePayload;

    if (!payload?.sourceImageDataUrl) {
      throw new Error("sourceImageDataUrl is required.");
    }

    if (payload.sourceImageDataUrl.length > MAX_SOURCE_DATA_URL_LENGTH) {
      throw new Error("The uploaded image is too large. Please try a smaller image.");
    }

    const result =
      AI_PROVIDER === "mock"
        ? await runMockProvider(user, payload)
        : await runSeedreamProvider(user, payload);

    return json({
      ...result,
      userId: user.id
    });
  } catch (error) {
    console.error(error);
    return json(
      {
        error: error instanceof Error ? error.message : "AI intake failed."
      },
      400
    );
  }
}

Deno.serve(handleIntake);
