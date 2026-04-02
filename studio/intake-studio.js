const APP_CONFIG = window.APP_CONFIG || {};
const SERVICE_BASE_URL = APP_CONFIG.aiServiceBaseUrl || "http://127.0.0.1:8123";
const POLL_INTERVAL_MS = 1200;
const MAX_POLL_COUNT = 90;
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
  bottom: "裤装",
  outer: "外套",
  dress: "裙装",
  accessory: "配饰"
};

const seasonDefaults = {
  top: "春秋",
  bottom: "四季",
  outer: "春秋",
  dress: "春夏",
  accessory: "四季"
};

const state = {
  category: "top",
  sourceName: "",
  sourceDataUrl: "",
  localPreviewUrl: "",
  previewObjectUrl: "",
  currentJobId: null,
  currentJob: null,
  isSubmitting: false,
  latestStandardUrl: ""
};

if (IS_EMBED_MODE) {
  document.body.classList.add("embed-mode");
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

function absoluteUrl(pathname) {
  if (!pathname) {
    return "";
  }

  if (/^https?:\/\//i.test(pathname)) {
    return pathname;
  }

  return `${SERVICE_BASE_URL}${pathname}`;
}

function deriveNameFromSource(sourceName) {
  return sourceName
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .trim();
}

function getDisplayName() {
  return garmentNameInput?.value.trim() || deriveNameFromSource(state.sourceName || "") || "未命名衣物";
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

function updatePreviewStatus(text) {
  if (previewStatus) {
    previewStatus.textContent = text;
  }
}

function mapJobStatusToBadge(job) {
  if (!job) {
    return state.sourceDataUrl ? "待生成" : "等待上传";
  }

  if (job.status === "queued") {
    return "任务已创建";
  }

  if (job.status === "processing") {
    return "处理中";
  }

  if (job.status === "needs_review") {
    return "已生成";
  }

  if (job.status === "failed") {
    return "生成失败";
  }

  return job.status || "处理中";
}

function syncArchivePreview() {
  const previewImageUrl = getArchivePreviewImageUrl();
  const categoryLabel = categoryLabels[state.category] || "上装";
  const locationValue = getFieldValue(garmentLocationInput, "待整理");
  const colorValue = getFieldValue(garmentColorInput, "待确认");
  const seasonValue = getFieldValue(garmentSeasonInput, "待确认");
  const purchaseDateValue = formatPurchaseDate(garmentPurchaseDateInput?.value);
  const priceValue = formatPrice(garmentPriceInput?.value);
  const brandValue = getFieldValue(garmentBrandInput, "未填写");

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
    archivePreviewCategory.textContent = categoryLabel;
  }

  if (archivePreviewLocation) {
    archivePreviewLocation.textContent = locationValue;
  }

  if (archivePreviewColor) {
    archivePreviewColor.textContent = colorValue;
  }

  if (archivePreviewSeason) {
    archivePreviewSeason.textContent = seasonValue;
  }

  if (archivePreviewPurchaseDate) {
    archivePreviewPurchaseDate.textContent = purchaseDateValue;
  }

  if (archivePreviewPrice) {
    archivePreviewPrice.textContent = priceValue;
  }

  if (archivePreviewBrand) {
    archivePreviewBrand.textContent = brandValue;
  }
}

function setCategory(category) {
  state.category = category;

  categoryButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.category === category);
  });

  if (!garmentSeasonInput?.value.trim() || garmentSeasonInput.value === "待确认") {
    garmentSeasonInput.value = seasonDefaults[category] || "待确认";
  }

  syncArchivePreview();
}

function setSubmitState(isSubmitting) {
  state.isSubmitting = isSubmitting;

  if (processButton) {
    processButton.disabled = isSubmitting || !state.sourceDataUrl;
    processButton.textContent = isSubmitting ? "生成中..." : "生成标准图";
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
    `location=${getFieldValue(garmentLocationInput, "待整理")}`,
    `color=${getFieldValue(garmentColorInput, "待确认")}`,
    `season=${getFieldValue(garmentSeasonInput, "待确认")}`,
    `purchaseDate=${garmentPurchaseDateInput?.value || ""}`,
    `price=${getFieldValue(garmentPriceInput, "")}`,
    `brand=${getFieldValue(garmentBrandInput, "")}`
  ].join("; ");
}

async function refreshArtifactPreviews(job) {
  const sourceUrl = state.localPreviewUrl || absoluteUrl(job?.artifacts?.sourceImageUrl);
  const standardUrl = absoluteUrl(job?.artifacts?.standardImageUrl);

  if (sourceUrl) {
    await renderCanvasFromUrl(sourceUrl, sourceCanvas);
  } else {
    clearCanvas(sourceCanvas);
  }

  if (standardUrl) {
    await renderCanvasFromUrl(standardUrl, standardCanvas);
  } else {
    clearCanvas(standardCanvas);
  }

  state.latestStandardUrl = standardUrl;
  updateWorkbenchState();
  syncArchivePreview();
}

async function fetchJson(pathname, options) {
  const response = await fetch(`${SERVICE_BASE_URL}${pathname}`, options);

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;

    try {
      const body = await response.json();
      message = body.error || message;
    } catch {}

    throw new Error(message);
  }

  return response.json();
}

async function pollJob(jobId) {
  for (let attempt = 0; attempt < MAX_POLL_COUNT; attempt += 1) {
    const job = await fetchJson(`/api/intake/jobs/${jobId}`);
    state.currentJob = job;

    updatePreviewStatus(mapJobStatusToBadge(job));
    await refreshArtifactPreviews(job);

    if (job.status === "needs_review" || job.status === "failed") {
      return job;
    }

    await new Promise((resolve) => {
      window.setTimeout(resolve, POLL_INTERVAL_MS);
    });
  }

  throw new Error("轮询超时，请检查本地 AI 服务是否正常运行。");
}

async function submitCurrentJob() {
  if (!state.sourceDataUrl || state.isSubmitting) {
    return;
  }

  state.currentJob = null;
  state.currentJobId = null;
  state.latestStandardUrl = "";
  clearCanvas(standardCanvas);
  updateWorkbenchState();
  syncArchivePreview();

  setSubmitState(true);
  updatePreviewStatus("创建任务中");

  try {
    const payload = {
      sourceImageDataUrl: state.sourceDataUrl,
      sourceFilename: state.sourceName || "upload.png",
      categoryHint: state.category,
      garmentName: getDisplayName(),
      notes: buildJobNotes()
    };

    const created = await fetchJson("/api/intake/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    state.currentJobId = created.jobId;
    updatePreviewStatus("开始生成");

    const finalJob = await pollJob(created.jobId);
    updatePreviewStatus(mapJobStatusToBadge(finalJob));
  } catch (error) {
    console.error(error);
    state.currentJob = {
      status: "failed",
      review: {
        reasons: [error.message]
      }
    };
    state.latestStandardUrl = "";
    clearCanvas(standardCanvas);
    updatePreviewStatus("生成失败");
    syncArchivePreview();
  } finally {
    setSubmitState(false);
  }
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("读取图片失败"));
    reader.readAsDataURL(file);
  });
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
  state.currentJobId = null;
  state.currentJob = null;
  state.latestStandardUrl = "";

  if (garmentNameInput) {
    garmentNameInput.value = deriveNameFromSource(sourceName);
  }

  if (!garmentSeasonInput?.value.trim() || garmentSeasonInput.value === "待确认") {
    garmentSeasonInput.value = seasonDefaults[state.category] || "待确认";
  }

  await renderCanvasFromUrl(state.localPreviewUrl, sourceCanvas);
  clearCanvas(standardCanvas);
  updatePreviewStatus("待生成");
  syncArchivePreview();
  setSubmitState(false);
  updateWorkbenchState();
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
    getFieldValue(garmentLocationInput, "待整理"),
    getFieldValue(garmentColorInput, "待确认"),
    getFieldValue(garmentSeasonInput, "待确认")
  ];

  if (garmentPurchaseDateInput?.value) {
    parts.push(`购入 ${garmentPurchaseDateInput.value}`);
  }

  if (garmentPriceInput?.value.trim()) {
    parts.push(`价格 ${garmentPriceInput.value.trim()}`);
  }

  if (garmentBrandInput?.value.trim()) {
    parts.push(`品牌 ${garmentBrandInput.value.trim()}`);
  }

  if (state.currentJob?.review?.reasons?.length) {
    return `${parts.join(" / ")}；复核提示：${state.currentJob.review.reasons.join("；")}`;
  }

  return `${parts.join(" / ")}；AI 标准图已生成`;
}

function importIntoParentWardrobe() {
  if (!state.latestStandardUrl) {
    return;
  }

  const payload = {
    type: "ai-intake:add-garment",
    garmentName: getDisplayName(),
    category: state.category,
    location: getFieldValue(garmentLocationInput, "待整理"),
    color: getFieldValue(garmentColorInput, "待确认"),
    season: getFieldValue(garmentSeasonInput, "待确认"),
    purchaseDate: garmentPurchaseDateInput?.value || "",
    price: getFieldValue(garmentPriceInput, ""),
    brand: getFieldValue(garmentBrandInput, ""),
    note: buildArchiveNote(),
    imageUrl: state.latestStandardUrl
  };

  window.parent.postMessage(payload, "*");
  updatePreviewStatus("已加入主衣柜");
}

async function handleSelectedFile(file) {
  if (!file || !file.type.startsWith("image/")) {
    return;
  }

  const dataUrl = await fileToDataUrl(file);
  const objectUrl = URL.createObjectURL(file);

  await setSelectedImage({
    dataUrl,
    sourceName: file.name,
    previewUrl: objectUrl
  });
}

triggerUploadButton?.addEventListener("click", () => {
  fileInput?.click();
});

fileInput?.addEventListener("change", async (event) => {
  const file = event.currentTarget.files?.[0];
  await handleSelectedFile(file);
  event.currentTarget.value = "";
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
  await handleSelectedFile(event.dataTransfer?.files?.[0]);
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
  submitCurrentJob();
});

downloadButton?.addEventListener("click", () => {
  downloadStandardPng();
});

importButton?.addEventListener("click", () => {
  importIntoParentWardrobe();
});

window.addEventListener("beforeunload", () => {
  revokePreviewObjectUrl();
});

setCategory("top");
clearCanvas(sourceCanvas);
clearCanvas(standardCanvas);
updatePreviewStatus("等待上传");
syncArchivePreview();
downloadButton.disabled = true;
importButton.disabled = true;
setSubmitState(false);
updateWorkbenchState();
