const fileInput = document.querySelector("#file-input");
const dropzone = document.querySelector("#dropzone");
const triggerUploadButton = document.querySelector("[data-trigger-upload]");
const loadDemoButton = document.querySelector("[data-load-demo]");
const processButton = document.querySelector("#process-button");
const downloadButton = document.querySelector("#download-button");

const sourceCanvas = document.querySelector("#source-canvas");
const maskCanvas = document.querySelector("#mask-canvas");
const standardCanvas = document.querySelector("#standard-canvas");
const emptyHints = document.querySelectorAll(".empty-hint");

const thresholdRange = document.querySelector("#threshold-range");
const thresholdOutput = document.querySelector("#threshold-output");
const softnessRange = document.querySelector("#softness-range");
const softnessOutput = document.querySelector("#softness-output");
const scaleRange = document.querySelector("#scale-range");
const scaleOutput = document.querySelector("#scale-output");
const widthRange = document.querySelector("#width-range");
const widthOutput = document.querySelector("#width-output");
const offsetRange = document.querySelector("#offset-range");
const offsetOutput = document.querySelector("#offset-output");

const categoryButtons = document.querySelectorAll("[data-category]");
const pipelineItems = document.querySelectorAll(".pipeline-item");
const previewStatus = document.querySelector("#preview-status");
const prototypeNote = document.querySelector("#prototype-note");
const archiveSummary = document.querySelector("#archive-summary");

const garmentNameInput = document.querySelector("#garment-name");
const garmentLocationInput = document.querySelector("#garment-location");
const garmentColorInput = document.querySelector("#garment-color");
const garmentSeasonInput = document.querySelector("#garment-season");

const templateConfig = {
  top: { width: 0.78, height: 0.76, top: 0.06, expectedAspect: [0.52, 1.1] },
  bottom: { width: 0.58, height: 0.82, top: 0.08, expectedAspect: [0.24, 0.62] },
  outer: { width: 0.84, height: 0.84, top: 0.04, expectedAspect: [0.48, 1.08] },
  dress: { width: 0.74, height: 0.88, top: 0.04, expectedAspect: [0.28, 0.84] },
  accessory: { width: 0.64, height: 0.48, top: 0.24, expectedAspect: [0.55, 2.2] }
};

const templateShapePoints = {
  top: [
    [0.42, 0.05],
    [0.34, 0.08],
    [0.18, 0.18],
    [0.08, 0.34],
    [0.15, 0.52],
    [0.27, 0.5],
    [0.31, 0.66],
    [0.33, 0.98],
    [0.67, 0.98],
    [0.69, 0.66],
    [0.73, 0.5],
    [0.85, 0.52],
    [0.92, 0.34],
    [0.82, 0.18],
    [0.66, 0.08],
    [0.58, 0.05],
    [0.54, 0.11],
    [0.5, 0.13],
    [0.46, 0.11]
  ],
  bottom: [
    [0.34, 0.02],
    [0.22, 0.04],
    [0.16, 0.2],
    [0.18, 0.42],
    [0.22, 0.68],
    [0.28, 0.98],
    [0.4, 0.98],
    [0.43, 0.58],
    [0.5, 0.44],
    [0.57, 0.58],
    [0.6, 0.98],
    [0.72, 0.98],
    [0.78, 0.68],
    [0.82, 0.42],
    [0.84, 0.2],
    [0.78, 0.04],
    [0.66, 0.02],
    [0.58, 0.08],
    [0.5, 0.1],
    [0.42, 0.08]
  ],
  outer: [
    [0.42, 0.03],
    [0.33, 0.06],
    [0.16, 0.17],
    [0.05, 0.32],
    [0.12, 0.58],
    [0.26, 0.56],
    [0.28, 0.99],
    [0.72, 0.99],
    [0.74, 0.56],
    [0.88, 0.58],
    [0.95, 0.32],
    [0.84, 0.17],
    [0.67, 0.06],
    [0.58, 0.03],
    [0.54, 0.08],
    [0.5, 0.1],
    [0.46, 0.08]
  ],
  dress: [
    [0.42, 0.04],
    [0.34, 0.07],
    [0.22, 0.18],
    [0.18, 0.34],
    [0.24, 0.48],
    [0.3, 0.58],
    [0.2, 0.98],
    [0.8, 0.98],
    [0.7, 0.58],
    [0.76, 0.48],
    [0.82, 0.34],
    [0.78, 0.18],
    [0.66, 0.07],
    [0.58, 0.04],
    [0.54, 0.1],
    [0.5, 0.12],
    [0.46, 0.1]
  ],
  accessory: [
    [0.24, 0.28],
    [0.24, 0.46],
    [0.18, 0.52],
    [0.18, 0.9],
    [0.82, 0.9],
    [0.82, 0.52],
    [0.76, 0.46],
    [0.76, 0.28],
    [0.64, 0.2],
    [0.36, 0.2]
  ]
};

const seasonDefaults = {
  top: "春秋",
  bottom: "四季",
  outer: "春秋",
  dress: "春夏",
  accessory: "四季"
};

const pipelineCopy = {
  source: "等待上传衣物照片",
  mask: "会根据边缘背景估计生成透明主体",
  layout: "根据品类将衣物映射到统一画布",
  expand: "检测是否需要后续 AI 展开补全",
  archive: "导出透明 PNG，供衣柜页入库"
};

const state = {
  category: "top",
  sourceImage: null,
  sourceName: "",
  processed: null
};

function syncRangeOutputs() {
  thresholdOutput.textContent = thresholdRange.value;
  softnessOutput.textContent = softnessRange.value;
  scaleOutput.textContent = `${scaleRange.value}%`;
  widthOutput.textContent = `${widthRange.value}%`;
  offsetOutput.textContent = offsetRange.value;
}

function setPipelineState(step, status, message) {
  const item = document.querySelector(`.pipeline-item[data-step="${step}"]`);

  if (!item) {
    return;
  }

  item.classList.remove("is-ready", "is-active", "is-warning");

  if (status) {
    item.classList.add(status);
  }

  const copyNode = item.querySelector("span");
  if (copyNode) {
    copyNode.textContent = message;
  }
}

function resetPipeline() {
  Object.entries(pipelineCopy).forEach(([step, copy]) => {
    setPipelineState(step, "", copy);
  });
}

function toggleEmptyHint(key, hidden) {
  const hint = document.querySelector(`[data-empty-for="${key}"]`);

  if (hint) {
    hint.hidden = hidden;
  }
}

function clearCanvas(canvas) {
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function clearAllPreviews() {
  [sourceCanvas, maskCanvas, standardCanvas].forEach(clearCanvas);
  toggleEmptyHint("source", false);
  toggleEmptyHint("mask", false);
  toggleEmptyHint("standard", false);
}

function setCategory(category) {
  state.category = category;

  categoryButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.category === category);
  });

  if (!garmentSeasonInput.value || garmentSeasonInput.value === "待识别") {
    garmentSeasonInput.value = seasonDefaults[category] || "待识别";
  }
}

function createCanvas(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function loadImageFromUrl(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

async function loadImageFile(file) {
  const url = URL.createObjectURL(file);

  try {
    return await loadImageFromUrl(url);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function normalizeSourceImage(image, maxSide = 1600) {
  const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  context.drawImage(image, 0, 0, width, height);
  return canvas;
}

function sampleEdgeBackground(imageData, width, height) {
  const step = Math.max(2, Math.floor(Math.min(width, height) / 80));
  let red = 0;
  let green = 0;
  let blue = 0;
  let count = 0;

  function samplePixel(x, y) {
    const index = (y * width + x) * 4;
    red += imageData.data[index];
    green += imageData.data[index + 1];
    blue += imageData.data[index + 2];
    count += 1;
  }

  for (let x = 0; x < width; x += step) {
    samplePixel(x, 0);
    samplePixel(x, height - 1);
  }

  for (let y = step; y < height - step; y += step) {
    samplePixel(0, y);
    samplePixel(width - 1, y);
  }

  return {
    r: Math.round(red / count),
    g: Math.round(green / count),
    b: Math.round(blue / count)
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function colorDistance(r, g, b, background) {
  const redDiff = r - background.r;
  const greenDiff = g - background.g;
  const blueDiff = b - background.b;
  return Math.sqrt(redDiff * redDiff + greenDiff * greenDiff + blueDiff * blueDiff);
}

function findOpaqueBounds(imageData, width, height) {
  let left = width;
  let top = height;
  let right = -1;
  let bottom = -1;
  let opaqueCount = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = imageData.data[(y * width + x) * 4 + 3];

      if (alpha > 20) {
        opaqueCount += 1;
        left = Math.min(left, x);
        top = Math.min(top, y);
        right = Math.max(right, x);
        bottom = Math.max(bottom, y);
      }
    }
  }

  if (right < left || bottom < top) {
    return null;
  }

  return {
    x: left,
    y: top,
    width: right - left + 1,
    height: bottom - top + 1,
    coverage: opaqueCount / (width * height)
  };
}

function estimateDominantColor(imageData) {
  let red = 0;
  let green = 0;
  let blue = 0;
  let count = 0;

  for (let index = 0; index < imageData.data.length; index += 4) {
    const alpha = imageData.data[index + 3];

    if (alpha <= 20) {
      continue;
    }

    red += imageData.data[index];
    green += imageData.data[index + 1];
    blue += imageData.data[index + 2];
    count += 1;
  }

  if (count === 0) {
    return { r: 128, g: 128, b: 128 };
  }

  return {
    r: Math.round(red / count),
    g: Math.round(green / count),
    b: Math.round(blue / count)
  };
}

function nameColor(rgb) {
  const { r, g, b } = rgb;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const lightness = (max + min) / 2;
  let hue = 0;

  if (delta !== 0) {
    if (max === r) {
      hue = ((g - b) / delta) % 6;
    } else if (max === g) {
      hue = (b - r) / delta + 2;
    } else {
      hue = (r - g) / delta + 4;
    }
  }

  hue = Math.round(hue * 60);
  if (hue < 0) {
    hue += 360;
  }

  if (delta < 14 && lightness > 210) {
    return "米白";
  }

  if (delta < 14 && lightness < 90) {
    return "深灰";
  }

  if (delta < 18) {
    return "灰色";
  }

  if (hue >= 180 && hue < 250) {
    return "蓝色";
  }

  if (hue >= 70 && hue < 165) {
    return "绿色";
  }

  if (hue >= 15 && hue < 52) {
    return lightness < 140 ? "棕色" : "卡其";
  }

  if (hue >= 330 || hue < 15) {
    return "红棕";
  }

  return "待确认";
}

function generateCutout(sourceCanvas, threshold, softness) {
  const context = sourceCanvas.getContext("2d");
  const imageData = context.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
  const background = sampleEdgeBackground(imageData, sourceCanvas.width, sourceCanvas.height);
  const outputCanvas = createCanvas(sourceCanvas.width, sourceCanvas.height);
  const outputContext = outputCanvas.getContext("2d");
  const output = outputContext.createImageData(sourceCanvas.width, sourceCanvas.height);

  for (let index = 0; index < imageData.data.length; index += 4) {
    const r = imageData.data[index];
    const g = imageData.data[index + 1];
    const b = imageData.data[index + 2];
    const distance = colorDistance(r, g, b, background);
    const alphaStrength = clamp((distance - threshold) / Math.max(softness, 1), 0, 1);
    const alpha = Math.round(Math.pow(alphaStrength, 0.88) * 255);

    output.data[index] = r;
    output.data[index + 1] = g;
    output.data[index + 2] = b;
    output.data[index + 3] = alpha;
  }

  outputContext.putImageData(output, 0, 0);

  const bounds = findOpaqueBounds(output, sourceCanvas.width, sourceCanvas.height);
  const dominantColor = estimateDominantColor(output);

  return {
    canvas: outputCanvas,
    bounds,
    dominantColor
  };
}

function buildTemplateFrame(outputCanvas, category, scaleValue, widthValue, offsetValue) {
  const template = templateConfig[category];
  const containerWidth = outputCanvas.width * template.width;
  const containerHeight = outputCanvas.height * template.height;
  const userScale = scaleValue / 100;
  const widthRatio = widthValue / 100;
  const rawWidth = containerWidth * userScale * widthRatio;
  const rawHeight = containerHeight * userScale;
  const fit = Math.min(1, outputCanvas.width * 0.9 / rawWidth, outputCanvas.height * 0.92 / rawHeight);
  const width = Math.round(rawWidth * fit);
  const height = Math.round(rawHeight * fit);
  const x = Math.round((outputCanvas.width - width) / 2);
  const y = Math.round(outputCanvas.height * template.top + (containerHeight - height) / 2 + offsetValue);

  return {
    x,
    y,
    width: Math.max(1, width),
    height: Math.max(1, height)
  };
}

function drawTemplateSilhouette(context, frame, category) {
  const points = templateShapePoints[category] || templateShapePoints.top;

  context.beginPath();
  points.forEach(([px, py], index) => {
    const x = frame.x + frame.width * px;
    const y = frame.y + frame.height * py;

    if (index === 0) {
      context.moveTo(x, y);
      return;
    }

    context.lineTo(x, y);
  });
  context.closePath();
}

function createTemplateMask(outputCanvas, category, scaleValue, widthValue, offsetValue) {
  const mask = createCanvas(outputCanvas.width, outputCanvas.height);
  const context = mask.getContext("2d");
  const frame = buildTemplateFrame(outputCanvas, category, scaleValue, widthValue, offsetValue);

  context.clearRect(0, 0, mask.width, mask.height);
  context.fillStyle = "#ffffff";
  drawTemplateSilhouette(context, frame, category);
  context.fill();

  return {
    canvas: mask,
    frame
  };
}

function summarizeSegments(segments) {
  if (!segments.length) {
    return null;
  }

  const left = segments[0].left;
  const right = segments[segments.length - 1].right;

  return {
    segments,
    left,
    right,
    width: right - left + 1,
    center: (left + right) / 2
  };
}

function analyzeAlphaRows(canvas, alphaThreshold = 20) {
  const context = canvas.getContext("2d");
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const rows = new Array(canvas.height);
  let first = -1;
  let last = -1;

  for (let y = 0; y < canvas.height; y += 1) {
    const segments = [];
    let segmentStart = -1;

    for (let x = 0; x < canvas.width; x += 1) {
      const alpha = imageData.data[(y * canvas.width + x) * 4 + 3];
      const isOpaque = alpha > alphaThreshold;

      if (isOpaque && segmentStart === -1) {
        segmentStart = x;
      }

      if (!isOpaque && segmentStart !== -1) {
        segments.push({
          left: segmentStart,
          right: x - 1,
          width: x - segmentStart
        });
        segmentStart = -1;
      }
    }

    if (segmentStart !== -1) {
      segments.push({
        left: segmentStart,
        right: canvas.width - 1,
        width: canvas.width - segmentStart
      });
    }

    rows[y] = summarizeSegments(segments);

    if (rows[y]) {
      if (first === -1) {
        first = y;
      }
      last = y;
    }
  }

  return {
    imageData,
    rows,
    first,
    last
  };
}

function extractGarmentCrop(maskCanvas, bounds) {
  const padding = Math.max(18, Math.round(Math.max(bounds.width, bounds.height) * 0.08));
  const crop = createCanvas(bounds.width + padding * 2, bounds.height + padding * 2);
  const context = crop.getContext("2d");

  context.clearRect(0, 0, crop.width, crop.height);
  context.drawImage(
    maskCanvas,
    bounds.x,
    bounds.y,
    bounds.width,
    bounds.height,
    padding,
    padding,
    bounds.width,
    bounds.height
  );

  return crop;
}

function findNearestOpaqueRow(analysis, index) {
  if (analysis.rows[index]) {
    return {
      index,
      row: analysis.rows[index]
    };
  }

  for (let offset = 1; offset < analysis.rows.length; offset += 1) {
    const before = index - offset;
    const after = index + offset;

    if (before >= 0 && analysis.rows[before]) {
      return {
        index: before,
        row: analysis.rows[before]
      };
    }

    if (after < analysis.rows.length && analysis.rows[after]) {
      return {
        index: after,
        row: analysis.rows[after]
      };
    }
  }

  return null;
}

function createSymmetricStripFactory(sourceCanvas, sourceAnalysis) {
  const sourceData = sourceAnalysis.imageData.data;
  const sourceWidth = sourceCanvas.width;
  const cache = new Map();

  return function getStrip(rowIndex) {
    if (cache.has(rowIndex)) {
      return cache.get(rowIndex);
    }

    const row = sourceAnalysis.rows[rowIndex];

    if (!row) {
      cache.set(rowIndex, null);
      return null;
    }

    const strip = createCanvas(row.width, 1);
    const context = strip.getContext("2d");
    const image = context.createImageData(row.width, 1);

    for (let x = 0; x < row.width; x += 1) {
      const leftSourceX = row.left + x;
      const rightSourceX = row.right - x;
      const leftIndex = (rowIndex * sourceWidth + leftSourceX) * 4;
      const rightIndex = (rowIndex * sourceWidth + rightSourceX) * 4;
      const leftAlpha = sourceData[leftIndex + 3] / 255;
      const rightAlpha = sourceData[rightIndex + 3] / 255;
      const total = leftAlpha + rightAlpha;
      const targetIndex = x * 4;

      if (total <= 0.001) {
        image.data[targetIndex + 3] = 0;
        continue;
      }

      image.data[targetIndex] = Math.round(
        (sourceData[leftIndex] * leftAlpha + sourceData[rightIndex] * rightAlpha) / total
      );
      image.data[targetIndex + 1] = Math.round(
        (sourceData[leftIndex + 1] * leftAlpha + sourceData[rightIndex + 1] * rightAlpha) / total
      );
      image.data[targetIndex + 2] = Math.round(
        (sourceData[leftIndex + 2] * leftAlpha + sourceData[rightIndex + 2] * rightAlpha) / total
      );
      image.data[targetIndex + 3] = Math.round(Math.max(leftAlpha, rightAlpha) * 255);
    }

    context.putImageData(image, 0, 0);

    const result = {
      canvas: strip,
      width: row.width
    };

    cache.set(rowIndex, result);
    return result;
  };
}

function paintTemplateFoundation(outputCanvas, outputContext, templateMask, dominantColor, cropCanvas, frame) {
  const foundation = createCanvas(outputCanvas.width, outputCanvas.height);
  const foundationContext = foundation.getContext("2d");
  const tone = dominantColor || { r: 160, g: 150, b: 140 };

  foundationContext.fillStyle = `rgba(${tone.r}, ${tone.g}, ${tone.b}, 0.9)`;
  foundationContext.fillRect(0, 0, foundation.width, foundation.height);
  foundationContext.globalCompositeOperation = "destination-in";
  foundationContext.drawImage(templateMask.canvas, 0, 0);

  outputContext.save();
  outputContext.globalAlpha = 0.22;
  outputContext.drawImage(foundation, 0, 0);
  outputContext.restore();

  const underlay = createCanvas(outputCanvas.width, outputCanvas.height);
  const underlayContext = underlay.getContext("2d");

  underlayContext.drawImage(
    cropCanvas,
    0,
    0,
    cropCanvas.width,
    cropCanvas.height,
    frame.x,
    frame.y,
    frame.width,
    frame.height
  );
  underlayContext.globalCompositeOperation = "destination-in";
  underlayContext.drawImage(templateMask.canvas, 0, 0);

  outputContext.save();
  outputContext.globalAlpha = 0.18;
  outputContext.drawImage(underlay, 0, 0);
  outputContext.restore();
}

function renderTemplateSlices(outputContext, templateAnalysis, sourceAnalysis, getStrip) {
  if (templateAnalysis.first === -1 || sourceAnalysis.first === -1) {
    return;
  }

  const targetSpan = Math.max(1, templateAnalysis.last - templateAnalysis.first);
  const sourceSpan = Math.max(1, sourceAnalysis.last - sourceAnalysis.first);

  for (let y = templateAnalysis.first; y <= templateAnalysis.last; y += 1) {
    const targetRow = templateAnalysis.rows[y];

    if (!targetRow) {
      continue;
    }

    const normalizedY = (y - templateAnalysis.first) / targetSpan;
    const sourceIndex = Math.round(sourceAnalysis.first + normalizedY * sourceSpan);
    const nearest = findNearestOpaqueRow(sourceAnalysis, sourceIndex);

    if (!nearest) {
      continue;
    }

    const strip = getStrip(nearest.index);

    if (!strip) {
      continue;
    }

    const segmentCount = targetRow.segments.length;

    targetRow.segments.forEach((segment, segmentIndex) => {
      const nominalWidth = Math.max(1, Math.floor(strip.width / segmentCount));
      const sourceX = segmentIndex === segmentCount - 1
        ? Math.max(0, strip.width - nominalWidth)
        : Math.min(strip.width - 1, segmentIndex * nominalWidth);
      const sourceSegmentWidth = Math.max(1, Math.min(nominalWidth, strip.width - sourceX));

      outputContext.drawImage(
        strip.canvas,
        sourceX,
        0,
        sourceSegmentWidth,
        1,
        segment.left,
        y,
        segment.width,
        1.4
      );
    });
  }
}

function evaluateNeedForExpansion(category, bounds) {
  if (!bounds) {
    return true;
  }

  const aspect = bounds.width / bounds.height;
  const coverage = bounds.coverage;
  const expected = templateConfig[category].expectedAspect;

  if (coverage < 0.18) {
    return true;
  }

  if (aspect < expected[0] || aspect > expected[1]) {
    return true;
  }

  return false;
}

function buildStandardCanvas(maskCanvas, bounds, category, scaleValue, widthValue, offsetValue, dominantColor) {
  const outputCanvas = createCanvas(900, 1200);
  const context = outputCanvas.getContext("2d");

  context.clearRect(0, 0, outputCanvas.width, outputCanvas.height);

  if (!bounds) {
    return {
      canvas: outputCanvas,
      needsAiExpansion: true
    };
  }

  const cropCanvas = extractGarmentCrop(maskCanvas, bounds);
  const sourceAnalysis = analyzeAlphaRows(cropCanvas);
  const templateMask = createTemplateMask(outputCanvas, category, scaleValue, widthValue, offsetValue);
  const templateAnalysis = analyzeAlphaRows(templateMask.canvas);
  const getStrip = createSymmetricStripFactory(cropCanvas, sourceAnalysis);

  paintTemplateFoundation(outputCanvas, context, templateMask, dominantColor, cropCanvas, templateMask.frame);
  renderTemplateSlices(context, templateAnalysis, sourceAnalysis, getStrip);

  context.globalCompositeOperation = "destination-in";
  context.drawImage(templateMask.canvas, 0, 0);
  context.globalCompositeOperation = "source-over";

  return {
    canvas: outputCanvas,
    needsAiExpansion: evaluateNeedForExpansion(category, bounds)
  };
}

function copyCanvas(source, target) {
  target.width = source.width;
  target.height = source.height;
  const context = target.getContext("2d");
  context.clearRect(0, 0, target.width, target.height);
  context.drawImage(source, 0, 0);
}

function deriveNameFromSource(sourceName) {
  return sourceName
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .trim();
}

function updateArchiveSummary(needsAiExpansion) {
  const name = garmentNameInput.value.trim() || "未命名衣物";
  const color = garmentColorInput.value.trim() || "待确认颜色";
  const season = garmentSeasonInput.value.trim() || "待确认季节";
  const location = garmentLocationInput.value.trim() || "待确认位置";
  const categoryLabel = document.querySelector("[data-category].is-active")?.textContent || "未分类";
  const aiText = needsAiExpansion
    ? "当前轮廓较紧凑，仍建议后续接入 AI 做袖子/裤腿展开补全。"
    : "当前轮廓可以直接作为基础归档图入库。";

  archiveSummary.textContent = `${name} | ${categoryLabel} | ${color} | ${season} | 暂放 ${location}。${aiText}`;
}

function updatePrototypeNote(needsAiExpansion) {
  prototypeNote.textContent = needsAiExpansion
    ? "检测到当前照片可能存在折叠、遮挡或版型压缩。当前原型已能生成透明归档图，但真实展开仍需后端 AI 服务。"
    : "当前照片轮廓较完整，可以直接输出透明背景标准图。后续接入 AI 服务后，可进一步补全前后结构与袖腿展开。";
}

function updatePreviewStatus(text) {
  previewStatus.textContent = text;
}

function processCurrentImage() {
  if (!state.sourceImage) {
    clearAllPreviews();
    resetPipeline();
    updatePreviewStatus("等待上传");
    downloadButton.disabled = true;
    state.processed = null;
    return;
  }

  setPipelineState("source", "is-ready", "原图已载入，准备开始标准化处理");
  updatePreviewStatus("处理中");

  const normalizedCanvas = normalizeSourceImage(state.sourceImage);
  copyCanvas(normalizedCanvas, sourceCanvas);
  toggleEmptyHint("source", true);

  const cutout = generateCutout(
    normalizedCanvas,
    Number(thresholdRange.value),
    Number(softnessRange.value)
  );

  copyCanvas(cutout.canvas, maskCanvas);
  toggleEmptyHint("mask", true);
  setPipelineState("mask", cutout.bounds ? "is-ready" : "is-warning", cutout.bounds
    ? "主体轮廓已提取，可继续生成标准图"
    : "没有稳定识别出衣物主体，请更换背景更干净的图片");

  const standard = buildStandardCanvas(
    cutout.canvas,
    cutout.bounds,
    state.category,
    Number(scaleRange.value),
    Number(widthRange.value),
    Number(offsetRange.value),
    cutout.dominantColor
  );

  copyCanvas(standard.canvas, standardCanvas);
  toggleEmptyHint("standard", true);
  setPipelineState("layout", cutout.bounds ? "is-ready" : "is-warning", cutout.bounds
    ? "已按品类排入标准画布"
    : "由于轮廓不稳定，标准画布未生成有效结果");

  setPipelineState(
    "expand",
    standard.needsAiExpansion ? "is-warning" : "is-ready",
    standard.needsAiExpansion
      ? "检测到需要后续 AI 展开补全的风险"
      : "当前轮廓完整度较高，可直接归档"
  );

  if (cutout.bounds) {
    setPipelineState("archive", "is-ready", "透明 PNG 已可导出，准备进入衣柜系统");
    updatePreviewStatus(standard.needsAiExpansion ? "已生成，建议补全" : "可直接归档");
    downloadButton.disabled = false;
  } else {
    setPipelineState("archive", "is-warning", "请先获得稳定的抠图结果，再导出归档图");
    updatePreviewStatus("需要调整参数");
    downloadButton.disabled = true;
  }

  if (!garmentColorInput.value || garmentColorInput.value === "待识别") {
    garmentColorInput.value = nameColor(cutout.dominantColor);
  }

  if (!garmentSeasonInput.value || garmentSeasonInput.value === "待识别") {
    garmentSeasonInput.value = seasonDefaults[state.category] || "待识别";
  }

  updatePrototypeNote(standard.needsAiExpansion);
  updateArchiveSummary(standard.needsAiExpansion);

  state.processed = {
    standardCanvas: standard.canvas,
    needsAiExpansion: standard.needsAiExpansion
  };
}

async function loadSourceImage(imagePromise, sourceName) {
  try {
    const image = await imagePromise;
    state.sourceImage = image;
    state.sourceName = sourceName;

    if (!garmentNameInput.value.trim()) {
      garmentNameInput.value = deriveNameFromSource(sourceName);
    }

    processCurrentImage();
  } catch (error) {
    console.error(error);
    updatePreviewStatus("图片加载失败");
  }
}

function createDemoImageUrl() {
  const canvas = createCanvas(920, 1200);
  const context = canvas.getContext("2d");

  context.fillStyle = "#f4ede3";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "rgba(73, 56, 46, 0.08)";
  context.fillRect(120, 150, 680, 860);

  context.fillStyle = "#d8c6ad";
  context.beginPath();
  context.moveTo(370, 180);
  context.lineTo(550, 180);
  context.lineTo(630, 250);
  context.lineTo(700, 460);
  context.lineTo(615, 520);
  context.lineTo(590, 930);
  context.lineTo(330, 930);
  context.lineTo(305, 520);
  context.lineTo(220, 460);
  context.lineTo(290, 250);
  context.closePath();
  context.fill();

  context.fillStyle = "#c4b090";
  context.beginPath();
  context.moveTo(420, 180);
  context.lineTo(500, 180);
  context.lineTo(460, 250);
  context.closePath();
  context.fill();

  return canvas.toDataURL("image/png");
}

function downloadStandardPng() {
  if (!state.processed?.standardCanvas) {
    return;
  }

  const link = document.createElement("a");
  link.download = `${(garmentNameInput.value.trim() || "standard-garment").replace(/\s+/g, "-")}.png`;
  link.href = state.processed.standardCanvas.toDataURL("image/png");
  link.click();
}

triggerUploadButton?.addEventListener("click", () => {
  fileInput?.click();
});

loadDemoButton?.addEventListener("click", () => {
  loadSourceImage(loadImageFromUrl(createDemoImageUrl()), "demo-knitwear.png");
});

fileInput?.addEventListener("change", async (event) => {
  const input = event.currentTarget;
  const file = input.files?.[0];

  if (!file) {
    return;
  }

  await loadSourceImage(loadImageFile(file), file.name);
  input.value = "";
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
  const file = event.dataTransfer?.files?.[0];

  if (!file || !file.type.startsWith("image/")) {
    return;
  }

  await loadSourceImage(loadImageFile(file), file.name);
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
    if (state.sourceImage) {
      processCurrentImage();
    }
  });
});

[thresholdRange, softnessRange, scaleRange, widthRange, offsetRange].forEach((input) => {
  input?.addEventListener("input", () => {
    syncRangeOutputs();

    if (state.sourceImage) {
      processCurrentImage();
    }
  });
});

[garmentNameInput, garmentLocationInput, garmentColorInput, garmentSeasonInput].forEach((input) => {
  input?.addEventListener("input", () => {
    if (state.processed) {
      updateArchiveSummary(state.processed.needsAiExpansion);
    }
  });
});

processButton?.addEventListener("click", () => {
  processCurrentImage();
});

downloadButton?.addEventListener("click", () => {
  downloadStandardPng();
});

syncRangeOutputs();
setCategory("top");
resetPipeline();
clearAllPreviews();
