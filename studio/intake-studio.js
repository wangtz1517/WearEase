const APP_CONFIG = window.APP_CONFIG || {};
const SUPABASE_URL = String(APP_CONFIG.supabaseUrl || "").trim();
const SUPABASE_ANON_KEY = String(APP_CONFIG.supabaseAnonKey || "").trim();
const AI_INTAKE_FUNCTION_NAME = String(APP_CONFIG.aiIntakeFunctionName || "ai-intake").trim();
const SUPABASE_CDN_URLS = [
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2",
  "https://unpkg.com/@supabase/supabase-js@2"
];
const MAX_SOURCE_DIMENSION = 1280;
const MAX_SOURCE_DATA_URL_LENGTH = 2_200_000;
const FUNCTION_INVOKE_TIMEOUT_MS = 90_000;
const AI_INTAKE_CHANNEL_NAME = "atelier-archive-ai-intake";
const AI_INTAKE_PENDING_GARMENT_KEY = "atelier-archive-ai-intake-pending-garment";
const IS_EMBED_MODE = new URLSearchParams(window.location.search).get("embed") === "1";

const fileInput = document.querySelector("#file-input");
const dropzone = document.querySelector("#dropzone");
const triggerUploadButton = document.querySelector("[data-trigger-upload]");
const processButton = document.querySelector("#process-button");
const downloadButton = document.querySelector("#download-button");
const importButton = document.querySelector("#import-button");

const uploadEmpty = document.querySelector("#upload-empty");
const processingOverlay = document.querySelector("#processing-overlay");
const sourceCanvas = document.querySelector("#source-canvas");
const standardCanvas = document.querySelector("#standard-canvas");
const previewStatus = document.querySelector("#preview-status");

const archivePreviewImage = document.querySelector("#archive-preview-image");
const archivePreviewEmpty = document.querySelector("#archive-preview-empty");
const archivePreviewName = document.querySelector("#archive-preview-name");
const archivePreviewCategory = document.querySelector("#archive-preview-category");
const archivePreviewLocation = document.querySelector("#archive-preview-location");
const archivePreviewColor = document.querySelector("#archive-preview-color");
const archivePreviewSeason = document.querySelector("#archive-preview-season");
const archivePreviewPurchaseDate = document.querySelector("#archive-preview-purchase-date");
const archivePreviewPrice = document.querySelector("#archive-preview-price");
const archivePreviewBrand = document.querySelector("#archive-preview-brand");

const categoryButtons = document.querySelectorAll("[data-category]");
const garmentNameInput = document.querySelector("#garment-name");
const garmentLocationInput = document.querySelector("#garment-location");
const garmentColorInput = document.querySelector("#garment-color");
const garmentSeasonInput = document.querySelector("#garment-season");
const garmentPurchaseDateInput = document.querySelector("#garment-purchase-date");
const garmentPriceInput = document.querySelector("#garment-price");
const garmentBrandInput = document.querySelector("#garment-brand");

const categoryLabels = {
  top: "上装",
  bottom: "下装",
  outer: "外套",
  dress: "连衣裙",
  accessory: "配饰"
};

const seasonDefaults = {
  top: "春秋",
  bottom: "四季",
  outer: "秋冬",
  dress: "春夏",
  accessory: "四季"
};

const state = {
  category: "top",
  sourceName: "",
  sourceDataUrl: "",
  localPreviewUrl: "",
  previewObjectUrl: "",
  isSubmitting: false,
  latestStandardUrl: ""
};

let currentSession = null;
let currentUser = null;
let supabaseClient = null;
let supabaseScriptLoadPromise = null;
let supabaseLoadErrorMessage = "";
let hasBoundAuthStateListener = false;

const aiIntakeChannel = "BroadcastChannel" in window ? new BroadcastChannel(AI_INTAKE_CHANNEL_NAME) : null;

if (IS_EMBED_MODE) {
  document.body.classList.add("embed-mode");
}

function hasSupabaseConfig() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && AI_INTAKE_FUNCTION_NAME);
}

function updatePreviewStatus(text) {
  if (previewStatus) {
    previewStatus.textContent = text;
  }
}

function getIdleStatusText() {
  if (!hasSupabaseConfig()) {
    return "Supabase 未配置";
  }

  if (!currentUser) {
    return "请先在主页面登录账号，再使用 AI 处理";
  }

  if (!state.sourceDataUrl) {
    return "上传衣服图片后即可开始处理";
  }

  if (!state.latestStandardUrl) {
    return "图片已就绪，点击开始处理";
  }

  return "处理完成，可导入衣柜";
}

function syncIdleStatus() {
  if (!state.isSubmitting) {
    updatePreviewStatus(getIdleStatusText());
  }
}

function withTimeout(promise, timeoutMs, timeoutMessage) {
  let timeoutId = 0;

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = window.setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    window.clearTimeout(timeoutId);
  });
}

async function getReadableInvokeErrorMessage(error, fallbackMessage) {
  if (error?.context instanceof Response) {
    try {
      const payload = await error.context.clone().json();

      if (payload?.error) {
        return String(payload.error);
      }

      if (payload?.message) {
        return String(payload.message);
      }
    } catch {
      try {
        const text = await error.context.clone().text();

        if (text) {
          return text;
        }
      } catch {
        // Ignore response parsing failures and fall back to the generic message.
      }
    }
  }

  return error?.message || fallbackMessage;
}

function initializeSupabaseClient() {
  if (supabaseClient || !hasSupabaseConfig() || !window.supabase?.createClient) {
    return supabaseClient;
  }

  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  });

  return supabaseClient;
}

function loadExternalScript(url) {
  return new Promise((resolve, reject) => {
    if (window.supabase?.createClient) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${url}`));
    document.head.appendChild(script);
  });
}

async function ensureSupabaseClient() {
  if (!hasSupabaseConfig()) {
    return null;
  }

  if (initializeSupabaseClient()) {
    supabaseLoadErrorMessage = "";
    return supabaseClient;
  }

  if (supabaseScriptLoadPromise) {
    return supabaseScriptLoadPromise;
  }

  supabaseScriptLoadPromise = (async () => {
    for (const url of SUPABASE_CDN_URLS) {
      try {
        await loadExternalScript(url);

        if (initializeSupabaseClient()) {
          supabaseLoadErrorMessage = "";
          return supabaseClient;
        }
      } catch (error) {
        console.warn(error);
      }
    }

    supabaseLoadErrorMessage = "Supabase SDK 加载失败，请检查当前网络。";
    return null;
  })();

  try {
    return await supabaseScriptLoadPromise;
  } finally {
    supabaseScriptLoadPromise = null;
  }
}

async function initializeSupabaseSession() {
  const client = await ensureSupabaseClient();

  if (!client) {
    currentSession = null;
    currentUser = null;
    syncIdleStatus();
    setSubmitState(false);
    return null;
  }

  const { data, error } = await client.auth.getSession();

  if (error) {
    throw error;
  }

  currentSession = data.session || null;
  currentUser = currentSession?.user || null;

  if (!hasBoundAuthStateListener) {
    client.auth.onAuthStateChange((_event, session) => {
      currentSession = session || null;
      currentUser = currentSession?.user || null;
      setSubmitState(state.isSubmitting);
      syncIdleStatus();
    });

    hasBoundAuthStateListener = true;
  }

  setSubmitState(state.isSubmitting);
  syncIdleStatus();
  return client;
}

function clearCanvas(canvas) {
  const context = canvas?.getContext("2d");

  if (!context || !canvas) {
    return;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawImageToCanvas(image, canvas) {
  const context = canvas?.getContext("2d");
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;

  if (!context || !canvas || !width || !height) {
    return;
  }

  canvas.width = width;
  canvas.height = height;
  context.clearRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    if (/^https?:\/\//i.test(url)) {
      image.crossOrigin = "anonymous";
    }

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    image.src = url;
  });
}

async function renderCanvasFromUrl(url, canvas) {
  if (!url || !canvas) {
    clearCanvas(canvas);
    return;
  }

  const image = await loadImage(url);
  drawImageToCanvas(image, canvas);
}

function fitWithin(width, height, maxDimension) {
  const longestSide = Math.max(width, height) || 1;
  const scale = Math.min(1, maxDimension / longestSide);

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale))
  };
}

function mimeTypeFromDataUrl(dataUrl) {
  const match = /^data:(.+?);base64,/.exec(dataUrl || "");
  return match?.[1] || "image/png";
}

function extensionFromMimeType(mimeType = "image/png") {
  if (mimeType === "image/jpeg") {
    return "jpg";
  }

  if (mimeType === "image/webp") {
    return "webp";
  }

  return "png";
}

function buildUploadFilename(name, mimeType) {
  const baseName = (name || "upload")
    .replace(/\.[^.]+$/, "")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "upload";

  return `${baseName}.${extensionFromMimeType(mimeType)}`;
}

function drawImageToSizedCanvas(image, width, height) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;

  if (!context) {
    throw new Error("Canvas is not available in this browser.");
  }

  context.clearRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  return canvas;
}

function exportCanvasDataUrl(canvas, mimeType, quality) {
  return canvas.toDataURL(mimeType, quality);
}

async function optimizeImageFile(file) {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(objectUrl);

    if ((image.naturalWidth || image.width) < 24 || (image.naturalHeight || image.height) < 24) {
      throw new Error("图片尺寸太小，至少需要 24x24 像素。");
    }

    let { width, height } = fitWithin(image.naturalWidth || image.width, image.naturalHeight || image.height, MAX_SOURCE_DIMENSION);
    let canvas = drawImageToSizedCanvas(image, width, height);
    let dataUrl = exportCanvasDataUrl(canvas, "image/jpeg", 0.84);

    if (dataUrl.length > MAX_SOURCE_DATA_URL_LENGTH) {
      dataUrl = exportCanvasDataUrl(canvas, "image/jpeg", 0.76);
    }

    if (dataUrl.length > MAX_SOURCE_DATA_URL_LENGTH) {
      ({ width, height } = fitWithin(image.naturalWidth || image.width, image.naturalHeight || image.height, 1024));
      canvas = drawImageToSizedCanvas(image, width, height);
      dataUrl = exportCanvasDataUrl(canvas, "image/jpeg", 0.72);
    }

    if (dataUrl.length > MAX_SOURCE_DATA_URL_LENGTH) {
      ({ width, height } = fitWithin(image.naturalWidth || image.width, image.naturalHeight || image.height, 896));
      canvas = drawImageToSizedCanvas(image, width, height);
      dataUrl = exportCanvasDataUrl(canvas, "image/jpeg", 0.66);
    }

    if (dataUrl.length > MAX_SOURCE_DATA_URL_LENGTH) {
      throw new Error("图片过大，请裁剪主体后再试。");
    }

    return {
      dataUrl,
      previewUrl: objectUrl,
      sourceName: buildUploadFilename(file.name, mimeTypeFromDataUrl(dataUrl))
    };
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    throw error;
  }
}

function deriveNameFromSource(sourceName) {
  return (sourceName || "")
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .trim();
}

function getDisplayName() {
  return garmentNameInput?.value.trim() || deriveNameFromSource(state.sourceName) || "未命名衣物";
}

function getFieldValue(input, fallback) {
  return input?.value.trim() || fallback;
}

function formatPurchaseDate(value) {
  return value || "未填写";
}

function formatPrice(value) {
  return value?.trim() || "未填写";
}

function getArchivePreviewImageUrl() {
  return state.latestStandardUrl || "";
}

function updateWorkbenchState() {
  const hasSource = Boolean(state.sourceDataUrl);
  const hasStandard = Boolean(state.latestStandardUrl);
  const isProcessing = Boolean(state.isSubmitting);

  if (uploadEmpty) {
    uploadEmpty.hidden = hasSource;
  }

  if (processingOverlay) {
    processingOverlay.hidden = !isProcessing;
  }

  dropzone?.classList.toggle("has-source", hasSource);
  dropzone?.classList.toggle("has-standard", hasStandard);
  dropzone?.classList.toggle("is-processing", isProcessing);

  if (sourceCanvas) {
    sourceCanvas.hidden = !hasSource || hasStandard;
  }

  if (standardCanvas) {
    standardCanvas.hidden = !hasStandard;
  }
}

function syncArchivePreview() {
  const previewImageUrl = getArchivePreviewImageUrl();

  if (archivePreviewImage) {
    if (previewImageUrl) {
      archivePreviewImage.hidden = false;

      if (archivePreviewImage.src !== previewImageUrl) {
        archivePreviewImage.src = previewImageUrl;
      }
    } else {
      archivePreviewImage.hidden = true;
      archivePreviewImage.removeAttribute("src");
    }
  }

  if (archivePreviewEmpty) {
    archivePreviewEmpty.hidden = Boolean(previewImageUrl);
  }

  if (archivePreviewName) {
    archivePreviewName.textContent = getDisplayName();
  }

  if (archivePreviewCategory) {
    archivePreviewCategory.textContent = categoryLabels[state.category] || "上装";
  }

  if (archivePreviewLocation) {
    archivePreviewLocation.textContent = getFieldValue(garmentLocationInput, "未填写");
  }

  if (archivePreviewColor) {
    archivePreviewColor.textContent = getFieldValue(garmentColorInput, "未填写");
  }

  if (archivePreviewSeason) {
    archivePreviewSeason.textContent = getFieldValue(garmentSeasonInput, "未填写");
  }

  if (archivePreviewPurchaseDate) {
    archivePreviewPurchaseDate.textContent = formatPurchaseDate(garmentPurchaseDateInput?.value);
  }

  if (archivePreviewPrice) {
    archivePreviewPrice.textContent = formatPrice(garmentPriceInput?.value);
  }

  if (archivePreviewBrand) {
    archivePreviewBrand.textContent = getFieldValue(garmentBrandInput, "未填写");
  }
}

function setCategory(category) {
  state.category = category;

  categoryButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.category === category);
  });

  if (!garmentSeasonInput?.value.trim()) {
    garmentSeasonInput.value = seasonDefaults[category] || "四季";
  }

  syncArchivePreview();
}

function setSubmitState(isSubmitting) {
  state.isSubmitting = isSubmitting;

  const canProcess = Boolean(state.sourceDataUrl && currentUser && hasSupabaseConfig() && !isSubmitting);

  if (processButton) {
    processButton.disabled = !canProcess;

    if (isSubmitting) {
      processButton.textContent = "AI 处理中...";
    } else if (!hasSupabaseConfig()) {
      processButton.textContent = "云端未配置";
    } else if (!currentUser) {
      processButton.textContent = "登录后可用";
    } else {
      processButton.textContent = "开始 AI 处理";
    }
  }

  if (downloadButton) {
    downloadButton.disabled = isSubmitting || !state.latestStandardUrl;
  }

  if (importButton) {
    importButton.disabled = isSubmitting || !state.latestStandardUrl;
  }

  updateWorkbenchState();
}

function buildJobNotes() {
  return [
    `category=${state.category}`,
    `location=${getFieldValue(garmentLocationInput, "未填写")}`,
    `color=${getFieldValue(garmentColorInput, "未填写")}`,
    `season=${getFieldValue(garmentSeasonInput, "未填写")}`,
    `purchaseDate=${garmentPurchaseDateInput?.value || ""}`,
    `price=${getFieldValue(garmentPriceInput, "")}`,
    `brand=${getFieldValue(garmentBrandInput, "")}`
  ].join("; ");
}

function revokePreviewObjectUrl() {
  if (state.previewObjectUrl) {
    URL.revokeObjectURL(state.previewObjectUrl);
    state.previewObjectUrl = "";
  }
}

async function setSelectedImage({ dataUrl, sourceName, previewUrl }) {
  revokePreviewObjectUrl();

  state.sourceDataUrl = dataUrl;
  state.sourceName = sourceName;
  state.localPreviewUrl = previewUrl || dataUrl;
  state.previewObjectUrl = previewUrl?.startsWith("blob:") ? previewUrl : "";
  state.latestStandardUrl = "";

  if (garmentNameInput) {
    garmentNameInput.value = deriveNameFromSource(sourceName);
  }

  if (!garmentSeasonInput?.value.trim()) {
    garmentSeasonInput.value = seasonDefaults[state.category] || "四季";
  }

  await renderCanvasFromUrl(state.localPreviewUrl, sourceCanvas);
  clearCanvas(standardCanvas);
  setSubmitState(false);
  syncArchivePreview();
  syncIdleStatus();
}

async function handleSelectedFile(file) {
  if (!file || !file.type.startsWith("image/")) {
    updatePreviewStatus("请选择图片文件。");
    return;
  }

  const prepared = await optimizeImageFile(file);
  await setSelectedImage(prepared);
}

async function submitCurrentJob() {
  if (!state.sourceDataUrl || state.isSubmitting) {
    return;
  }

  if (!hasSupabaseConfig()) {
    updatePreviewStatus("Supabase 未配置，无法调用 AI。");
    return;
  }

  setSubmitState(true);
  updatePreviewStatus("AI 正在处理图片，请稍候...");
  state.latestStandardUrl = "";
  clearCanvas(standardCanvas);
  syncArchivePreview();

  try {
    const client = await initializeSupabaseSession();

    if (!client) {
      throw new Error(supabaseLoadErrorMessage || "Supabase SDK 加载失败。");
    }

    if (!currentUser || !currentSession?.access_token) {
      throw new Error("请先登录账号后再使用 AI 处理。");
    }

    const { data, error } = await withTimeout(
      client.functions.invoke(AI_INTAKE_FUNCTION_NAME, {
        body: {
          sourceImageDataUrl: state.sourceDataUrl,
          sourceFilename: state.sourceName || "upload.png",
          categoryHint: state.category,
          garmentName: getDisplayName(),
          notes: buildJobNotes()
        }
      }),
      FUNCTION_INVOKE_TIMEOUT_MS,
      "AI 处理超时。请换更小的图片，或稍后重试。"
    );

    if (error) {
      throw error;
    }

    const outputUrl = String(data?.output?.imageUrl || "").trim();

    if (!outputUrl) {
      throw new Error("AI 结果中没有返回可用图片。");
    }

    state.latestStandardUrl = outputUrl;
    await renderCanvasFromUrl(outputUrl, standardCanvas);
    syncArchivePreview();

    const requiresReview = Boolean(data?.review?.requiresHumanReview);
    updatePreviewStatus(requiresReview ? "处理完成，请确认细节后再导入" : "处理完成，可直接导入衣柜");
  } catch (error) {
    console.error(error);
    state.latestStandardUrl = "";
    clearCanvas(standardCanvas);
    syncArchivePreview();
    updatePreviewStatus(await getReadableInvokeErrorMessage(error, "AI 处理失败，请稍后重试。"));
  } finally {
    setSubmitState(false);
  }
}

function downloadStandardPng() {
  if (!state.latestStandardUrl) {
    return;
  }

  const link = document.createElement("a");
  const safeName = getDisplayName().replace(/\s+/g, "-");

  link.href = state.latestStandardUrl;
  link.download = `${safeName || "standard-garment"}.png`;
  link.click();
}

function buildArchiveNote() {
  const parts = [
    categoryLabels[state.category] || "上装",
    getFieldValue(garmentLocationInput, "未填写"),
    getFieldValue(garmentColorInput, "未填写"),
    getFieldValue(garmentSeasonInput, "未填写")
  ];

  if (garmentPurchaseDateInput?.value) {
    parts.push(`购入日期 ${garmentPurchaseDateInput.value}`);
  }

  if (garmentPriceInput?.value.trim()) {
    parts.push(`价格 ${garmentPriceInput.value.trim()}`);
  }

  if (garmentBrandInput?.value.trim()) {
    parts.push(`品牌 ${garmentBrandInput.value.trim()}`);
  }

  return `${parts.join(" / ")} / 通过 AI Intake 生成`;
}

function dispatchGarmentImport(payload) {
  const targetOrigin = window.location.origin;

  if (window.parent && window.parent !== window) {
    window.parent.postMessage(payload, targetOrigin);
  }

  if (window.opener && !window.opener.closed) {
    try {
      window.opener.postMessage(payload, targetOrigin);
    } catch (error) {
      console.warn(error);
    }
  }

  if (aiIntakeChannel) {
    aiIntakeChannel.postMessage(payload);
  }

  try {
    window.localStorage.setItem(AI_INTAKE_PENDING_GARMENT_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn(error);
  }
}

function importIntoParentWardrobe() {
  if (!state.latestStandardUrl) {
    return;
  }

  const payload = {
    type: "ai-intake:add-garment",
    transferId: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    garmentName: getDisplayName(),
    category: state.category,
    location: getFieldValue(garmentLocationInput, "未填写"),
    color: getFieldValue(garmentColorInput, "未填写"),
    season: getFieldValue(garmentSeasonInput, "未填写"),
    purchaseDate: garmentPurchaseDateInput?.value || "",
    price: getFieldValue(garmentPriceInput, ""),
    brand: getFieldValue(garmentBrandInput, ""),
    note: buildArchiveNote(),
    imageUrl: state.latestStandardUrl
  };

  dispatchGarmentImport(payload);
  updatePreviewStatus("已发送到衣柜，请回主页面查看。");
}

triggerUploadButton?.addEventListener("click", () => {
  fileInput?.click();
});

fileInput?.addEventListener("change", async (event) => {
  try {
    const file = event.currentTarget.files?.[0];
    await handleSelectedFile(file);
  } catch (error) {
    console.error(error);
    updatePreviewStatus(error.message || "处理图片时发生错误。");
  } finally {
    event.currentTarget.value = "";
  }
});

dropzone?.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropzone.classList.add("is-dragover");
});

dropzone?.addEventListener("dragleave", () => {
  dropzone.classList.remove("is-dragover");
});

dropzone?.addEventListener("drop", async (event) => {
  event.preventDefault();
  dropzone.classList.remove("is-dragover");

  try {
    await handleSelectedFile(event.dataTransfer?.files?.[0]);
  } catch (error) {
    console.error(error);
    updatePreviewStatus(error.message || "处理图片时发生错误。");
  }
});

dropzone?.addEventListener("click", (event) => {
  if (event.target instanceof Element && event.target.closest("button")) {
    return;
  }

  fileInput?.click();
});

dropzone?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    fileInput?.click();
  }
});

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setCategory(button.dataset.category || "top");
  });
});

[
  garmentNameInput,
  garmentLocationInput,
  garmentColorInput,
  garmentSeasonInput,
  garmentPurchaseDateInput,
  garmentPriceInput,
  garmentBrandInput
].forEach((input) => {
  input?.addEventListener("input", () => {
    syncArchivePreview();
  });
});

processButton?.addEventListener("click", () => {
  void submitCurrentJob();
});

downloadButton?.addEventListener("click", () => {
  downloadStandardPng();
});

importButton?.addEventListener("click", () => {
  importIntoParentWardrobe();
});

window.addEventListener("beforeunload", () => {
  revokePreviewObjectUrl();
  aiIntakeChannel?.close();
});

setCategory("top");
clearCanvas(sourceCanvas);
clearCanvas(standardCanvas);
setSubmitState(false);
syncArchivePreview();
syncIdleStatus();

initializeSupabaseSession().catch((error) => {
  console.error(error);
  updatePreviewStatus(error.message || "Supabase 会话初始化失败。");
});
