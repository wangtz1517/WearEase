import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const VOLCENGINE_API_KEY = Deno.env.get("VOLCENGINE_API_KEY") || "";
const VOLCENGINE_BASE_URL = (Deno.env.get("VOLCENGINE_BASE_URL") || "https://ark.cn-beijing.volces.com/api/v3").replace(/\/$/, "");
const VOLCENGINE_IMAGE_MODEL = Deno.env.get("VOLCENGINE_IMAGE_MODEL") || "doubao-seedream-5-0-260128";
const GARMENT_IMAGES_BUCKET = Deno.env.get("GARMENT_IMAGES_BUCKET") || "garment-images";
const MAX_REFERENCE_BOARD_LENGTH = 7_000_000;
const MAX_OUTFIT_ITEMS = 4;
const VOLCENGINE_REQUEST_TIMEOUT_MS = 120_000;
const VOLCENGINE_DOWNLOAD_TIMEOUT_MS = 30_000;

type OutfitGarmentPayload = {
  id?: string;
  name?: string;
  type?: string;
  categoryText?: string;
  color?: string;
  seasons?: string;
  imageUrl?: string;
  imageDataUrl?: string;
};

type OutfitPreviewPayload = {
  referenceBoardDataUrl?: string;
  garments?: OutfitGarmentPayload[];
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

  if (!VOLCENGINE_API_KEY) {
    throw new Error("VOLCENGINE_API_KEY is not configured.");
  }
}

async function requireAuthenticatedUser(request: Request): Promise<AuthenticatedUser> {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader) {
    throw new Error("Please sign in before generating an AI outfit preview.");
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
    throw new Error("referenceBoardDataUrl must be a valid base64 image.");
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

function sanitizeFilename(name = "outfit-preview.png") {
  return name.trim().replace(/[^\w.\-]+/g, "-").replace(/-+/g, "-") || "outfit-preview.png";
}

function inferGarmentType(item: OutfitGarmentPayload) {
  const explicitType = String(item.type || "").trim().toLowerCase();

  if (["top", "bottom", "outer", "dress", "accessory"].includes(explicitType)) {
    return explicitType;
  }

  const combinedText = `${item.name || ""} ${item.categoryText || ""}`.toLowerCase();

  if (/(短裤|裤|裙|半裙|长裤|西裤|牛仔)/.test(combinedText)) {
    return "bottom";
  }

  if (/(外套|开衫|夹克|大衣|风衣|西装|羽绒)/.test(combinedText)) {
    return "outer";
  }

  if (/(鞋|包|围巾|帽|配饰|腰带)/.test(combinedText)) {
    return "accessory";
  }

  if (/(连衣裙|裙装)/.test(combinedText)) {
    return "dress";
  }

  return "top";
}

function getTypePromptLabel(type: string) {
  if (type === "bottom") {
    return "bottom garment";
  }

  if (type === "outer") {
    return "outerwear";
  }

  if (type === "dress") {
    return "dress";
  }

  if (type === "accessory") {
    return "accessory or shoes";
  }

  return "top or inner layer";
}

function normalizeGarments(garments: OutfitGarmentPayload[] = []) {
  return garments
    .slice(0, MAX_OUTFIT_ITEMS)
    .map((item) => ({
      id: String(item.id || "").trim(),
      name: String(item.name || "").trim() || "Unnamed garment",
      type: inferGarmentType(item),
      categoryText: String(item.categoryText || "").trim(),
      color: String(item.color || "").trim(),
      seasons: String(item.seasons || "").trim(),
      imageUrl: String(item.imageUrl || "").trim(),
      imageDataUrl: String(item.imageDataUrl || "").trim()
    }))
    .filter((item) => item.imageUrl || item.imageDataUrl);
}

function buildOutfitPrompt(garments: ReturnType<typeof normalizeGarments>) {
  const garmentLines = garments.map((item, index) => {
    const details = [item.color, item.seasons, item.categoryText].filter(Boolean).join(", ");
    return `Reference garment ${index + 1}: ${getTypePromptLabel(item.type)}. Name: ${item.name}.${details ? ` Details: ${details}.` : ""}`;
  });

  const hasTop = garments.some((item) => item.type === "top");
  const hasBottom = garments.some((item) => item.type === "bottom");
  const hasOuter = garments.some((item) => item.type === "outer");
  const hasAccessory = garments.some((item) => item.type === "accessory");

  return [
    "Create a single realistic full-body outfit preview image.",
    "The input image is a wardrobe reference board containing separated product photos of the selected garments.",
    "Dress one front-facing neutral fashion model in all of the selected garments at the same time.",
    garmentLines.join(" "),
    hasTop && hasBottom ? "The outfit must clearly wear the selected top with the selected bottom." : "",
    hasOuter ? "If outerwear is provided, layer it naturally over the inner top." : "",
    hasAccessory ? "If shoes or accessories are provided, place them naturally on the model." : "",
    "Use the actual garments from the reference board and preserve their category, color, silhouette, length, proportions, logos, and fabric details.",
    "Infer the correct garment category from the reference board if any metadata is ambiguous.",
    "Do not place garment cutouts beside the person. Do not show duplicate garments. Do not invent extra clothing items.",
    "The final image should look like a clean try-on preview: one standing model, front view, centered composition, plain studio background."
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
  blob: Blob;
  contentType: string;
}) {
  const admin = getSupabaseAdminClient();
  const extension = getExtensionFromMimeType(options.contentType);
  const filename = sanitizeFilename(`outfit-preview.${extension}`).replace(/\.[^.]+$/, "");
  const objectPath = `${options.userId}/outfit-preview/${Date.now()}-${crypto.randomUUID()}-${filename}.${extension}`;

  const { error: uploadError } = await admin.storage
    .from(GARMENT_IMAGES_BUCKET)
    .upload(objectPath, options.blob, {
      contentType: options.contentType,
      cacheControl: "3600",
      upsert: false
    });

  if (uploadError) {
    throw new Error(uploadError.message || "Failed to upload AI outfit preview.");
  }

  const {
    data: { publicUrl }
  } = admin.storage.from(GARMENT_IMAGES_BUCKET).getPublicUrl(objectPath);

  return {
    path: objectPath,
    publicUrl
  };
}

async function runOutfitPreview(user: AuthenticatedUser, payload: OutfitPreviewPayload) {
  const garments = normalizeGarments(payload.garments || []);

  if (!garments.length) {
    throw new Error("Please select at least one garment before generating the outfit preview.");
  }

  if (!payload.referenceBoardDataUrl) {
    throw new Error("referenceBoardDataUrl is required.");
  }

  const prompt = buildOutfitPrompt(garments);
  const response = await fetchWithTimeout(
    `${VOLCENGINE_BASE_URL}/images/generations`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${VOLCENGINE_API_KEY}`
      },
      body: JSON.stringify({
        model: VOLCENGINE_IMAGE_MODEL,
        prompt,
        image: payload.referenceBoardDataUrl,
        response_format: "url",
        size: "2K",
        stream: false,
        watermark: false
      })
    },
    VOLCENGINE_REQUEST_TIMEOUT_MS,
    "Volcengine outfit generation timed out. Please try again later."
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
    throw new Error("Volcengine response did not include a generated outfit image URL.");
  }

  const generatedResponse = await fetchWithTimeout(
    generatedImageUrl,
    {
      headers: {
        Authorization: `Bearer ${VOLCENGINE_API_KEY}`
      }
    },
    VOLCENGINE_DOWNLOAD_TIMEOUT_MS,
    "Downloading the generated outfit preview timed out. Please try again later."
  );

  if (!generatedResponse.ok) {
    throw new Error(`Failed to download generated outfit preview: ${generatedResponse.status}.`);
  }

  const outputBlob = await generatedResponse.blob();
  const outputContentType = outputBlob.type || generatedResponse.headers.get("content-type") || "image/png";
  const uploaded = await uploadOutputImage({
    userId: user.id,
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
      reasons: ["AI outfit preview completed. Review clothing details and fit before trusting the result."]
    }
  };
}

async function handleOutfitPreview(request: Request) {
  requireConfiguredEnv();

  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }

  try {
    const user = await requireAuthenticatedUser(request);
    const payload = (await request.json()) as OutfitPreviewPayload;

    if (!payload?.referenceBoardDataUrl) {
      throw new Error("referenceBoardDataUrl is required.");
    }

    if (payload.referenceBoardDataUrl.length > MAX_REFERENCE_BOARD_LENGTH) {
      throw new Error("The outfit reference board is too large. Please try fewer garments or smaller source images.");
    }

    const { mimeType } = parseDataUrl(payload.referenceBoardDataUrl);

    if (!mimeType.startsWith("image/")) {
      throw new Error("referenceBoardDataUrl must be an image.");
    }

    const result = await runOutfitPreview(user, payload);

    return json({
      ...result,
      userId: user.id
    });
  } catch (error) {
    console.error(error);
    return json(
      {
        error: error instanceof Error ? error.message : "AI outfit preview failed."
      },
      400
    );
  }
}

Deno.serve(handleOutfitPreview);
