const viewConfig = {
  home: {
    title: "衣橱志 Atelier Archive | 首页",
    intro: "首页不再只是看总数，而是直接告诉你现在该做什么、最近加了什么、最近穿过什么。",
    viewName: "首页",
    focus: "从首页直接继续穿搭、管理衣柜或添加新衣服。",
    mode: "控制台模式"
  },
  wardrobe: {
    title: "衣橱志 Atelier Archive | 衣柜",
    intro: "衣柜视图是整个系统的核心库存区。所有衣物都要在这里可查、可改、可重新归类。",
    viewName: "衣柜",
    focus: "查看衣物列表并录入新单品。",
    mode: "衣柜模式"
  },
  outfit: {
    title: "衣橱志 Atelier Archive | 穿搭",
    intro: "穿搭视图不负责管理库存，它只解决一个问题：今天在现有衣服里，怎么穿得自然、顺手、好看。",
    viewName: "穿搭",
    focus: "按场景生成今天可穿的搭配。",
    mode: "搭配模式"
  }
};

viewConfig.add = {
  title: "Atelier Archive | 新增你的衣物",
  intro: "在独立页面中上传原图、调用 AI 生成标准图，并把结果回填进主衣柜。",
  viewName: "新增",
  focus: "上传原图、生成标准图并加入衣柜。",
  mode: "新增模式"
};

const seasonConfig = {
  spring: {
    label: "春季",
    count: 42,
    note: "保留 42 件当季衣物，建议本周收纳 18 件厚外套与针织单品。",
    outfitNote: "适合春季晨晚温差，通勤时不显厚重。",
    status: "当前推荐：春季温和区间",
    keepCount: "42 件",
    storeCount: "18 件",
    focus: "厚针织与围巾",
    keep: ["轻薄衬衫 8 件", "常规针织 6 件", "春季外套 4 件", "通勤裤装 7 件"],
    store: ["厚羽绒 3 件", "重磅毛衣 5 件", "冬季围巾手套 6 件", "厚绒外套 4 件"]
  },
  summer: {
    label: "夏季",
    count: 36,
    note: "重点保留轻薄上装、短袖和透气鞋履，建议收起绝大部分针织单品。",
    outfitNote: "以透气、轻薄和颜色清爽为主，减少叠穿层数。",
    status: "当前推荐：夏季轻薄区间",
    keepCount: "36 件",
    storeCount: "24 件",
    focus: "厚针织与长外套",
    keep: ["短袖上装 10 件", "轻薄裙装 5 件", "薄款裤装 4 件", "凉鞋和轻便鞋 6 双"],
    store: ["厚针织 6 件", "过渡季外套 4 件", "重磅长裤 5 件", "冬季围巾手套 6 件"]
  },
  autumn: {
    label: "秋季",
    count: 47,
    note: "建议调出外套、长裤和叠穿单品，进入高频穿搭季。",
    outfitNote: "适合做层次穿搭，衬衫、针织和轻外套会成为核心。",
    status: "当前推荐：秋季叠穿区间",
    keepCount: "47 件",
    storeCount: "15 件",
    focus: "轻外套与针织开衫",
    keep: ["长袖衬衫 8 件", "针织开衫 7 件", "轻外套 5 件", "长裤 8 条"],
    store: ["高温专用短袖 6 件", "凉感裙装 4 件", "凉鞋 3 双", "极厚冬装 5 件"]
  },
  winter: {
    label: "冬季",
    count: 39,
    note: "优先保留保暖层、厚外套和冬鞋，非保暖型单品可移入次级收纳区。",
    outfitNote: "以内层保暖和外层防风为主，搭配逻辑更强调层次与保温。",
    status: "当前推荐：冬季保暖区间",
    keepCount: "39 件",
    storeCount: "28 件",
    focus: "保暖层与厚外套",
    keep: ["高领内搭 6 件", "厚针织 6 件", "冬季外套 5 件", "保暖裤装 6 件"],
    store: ["轻薄短袖 8 件", "夏季裙装 5 件", "凉鞋 3 双", "薄防晒衫 4 件"]
  }
};

const sidebarSlogan = "一个 J 人的赛博衣橱";

const viewLinks = document.querySelectorAll("[data-view-link]");
const navLinks = document.querySelectorAll(".sidebar-nav [data-view-link]");
let toggleGroups = document.querySelectorAll("[data-toggle-group]");
const globalSearchInput = document.querySelector("#global-search-input");
const globalSearchResults = document.querySelector("#global-search-results");

const sidebarIntro = document.querySelector("#sidebar-intro");
const utilityViewName = document.querySelector("#utility-view-name");
const utilityViewFocus = document.querySelector("#utility-view-focus");
const utilityMode = document.querySelector("#utility-mode");
const wardrobeSearchInput = document.querySelector("#wardrobe-search-input");
const wardrobeFilterButtons = document.querySelectorAll("[data-wardrobe-filter]");
const wardrobeStateButtons = document.querySelectorAll("[data-wardrobe-state]");
const authModal = document.querySelector("#auth-modal");
const authModalPanel = authModal ? authModal.querySelector(".modal-panel") : null;
const authEmailInput = document.querySelector("#auth-email-input");
const authPasswordInput = document.querySelector("#auth-password-input");
const authForm = document.querySelector("#auth-form");
const authFeedback = document.querySelector("#auth-feedback");
const authStatusTitle = document.querySelector("#auth-status-title");
const authStatusCopy = document.querySelector("#auth-status-copy");
const authTriggerLabel = document.querySelector("#auth-trigger-label");
const authSessionCopy = document.querySelector("#auth-session-copy");
const authSignOutButtons = document.querySelectorAll("[data-auth-signout]");
const authSignOutModalButtons = document.querySelectorAll("[data-auth-signout-modal]");
const addGarmentModal = document.querySelector("#add-garment-modal");
const addGarmentModalPanel = addGarmentModal ? addGarmentModal.querySelector(".modal-panel") : null;
const addGarmentCloseButton = addGarmentModal
  ? addGarmentModal.querySelector("[data-close-add-modal]")
  : null;
const embeddedIntakePanel = document.querySelector("#embedded-intake-panel");
const embeddedIntakeFrame = document.querySelector("#embedded-intake-frame");
const homeSeasonNote = document.querySelector("#home-season-note");
const homeRibbonMeta = document.querySelector("#home-ribbon-meta");
const homeNextStep = document.querySelector("#home-next-step");
const homePulseTitle = document.querySelector("#home-pulse-title");
const homePulseCopy = document.querySelector("#home-pulse-copy");
const homeFocusTitle = document.querySelector("#home-focus-title");
const homeFocusCopy = document.querySelector("#home-focus-copy");
const homeTotalCount = document.querySelector("#home-total-count");
const homeTotalCopy = document.querySelector("#home-total-copy");
const homeSeasonCount = document.querySelector("#home-season-count");
const homeSeasonCopy = document.querySelector("#home-season-copy");
const homePendingCount = document.querySelector("#home-pending-count");
const homePendingCopy = document.querySelector("#home-pending-copy");
const homeRecentCount = document.querySelector("#home-recent-count");
const homeRecentCopy = document.querySelector("#home-recent-copy");
const homeRecentGarments = document.querySelector("#home-recent-garments");
const homeOutfitHistory = document.querySelector("#home-outfit-history");
const homeOpenOutfitHistoryButton = document.querySelector("#home-open-outfit-history");

const seasonButtons = document.querySelectorAll(".season-button");
const seasonCountNodes = document.querySelectorAll("[data-season-count]");
const currentSeasonNodes = document.querySelectorAll("[data-current-season]");
const outfitNoteNodes = document.querySelectorAll("[data-outfit-note]");
const seasonalStatusNodes = document.querySelectorAll("[data-seasonal-status]");
const seasonKeepCountNodes = document.querySelectorAll("[data-season-keep-count]");
const seasonStoreCountNodes = document.querySelectorAll("[data-season-store-count]");
const seasonFocusNodes = document.querySelectorAll("[data-season-focus-text]");
const seasonKeepLists = document.querySelectorAll("[data-season-keep-list]");
const seasonStoreLists = document.querySelectorAll("[data-season-store-list]");
const outfitSelectorRows = document.querySelector("#outfit-selector-rows");
const outfitHistoryButton = document.querySelector("#outfit-history-button");
const outfitModelButton = document.querySelector("#outfit-model-button");
const outfitLoadButton = document.querySelector("#outfit-load-button");
const outfitResetButton = document.querySelector("#outfit-reset-button");
const outfitSelectedSummary = document.querySelector("#outfit-selected-summary");
const outfitPreviewPanel = document.querySelector(".outfit-preview-panel");
const outfitPreviewRender = document.querySelector("#outfit-preview-render");
const outfitPreviewEmpty = document.querySelector("#outfit-preview-empty");
const outfitPreviewEmptyTitle = document.querySelector("#outfit-preview-empty-title");
const outfitPreviewEmptyCopy = document.querySelector("#outfit-preview-empty-copy");
const outfitPreviewProcessing = document.querySelector("#outfit-preview-processing");
const outfitPreviewProcessingTitle = document.querySelector("#outfit-preview-processing-title");
const outfitPreviewProcessingCopy = document.querySelector("#outfit-preview-processing-copy");
const outfitModelGenderInput = document.querySelector("#outfit-model-gender");
const outfitModelHeightInput = document.querySelector("#outfit-model-height");
const outfitModelWeightInput = document.querySelector("#outfit-model-weight");
const outfitModelEthnicityInput = document.querySelector("#outfit-model-ethnicity");
const outfitModelModal = document.querySelector("#outfit-model-modal");
const outfitModelPanel = document.querySelector(".outfit-model-panel");
const outfitModelFeedback = document.querySelector("#outfit-model-feedback");
const outfitModelSaveButton = document.querySelector("#outfit-model-save-button");
const outfitHistoryModal = document.querySelector("#outfit-history-modal");
const outfitHistoryModalPanel = outfitHistoryModal ? outfitHistoryModal.querySelector(".modal-panel") : null;
const outfitHistoryTrack = document.querySelector("#outfit-history-track");
const wardrobeGrid = document.querySelector("#wardrobe-grid");
const wardrobeSummaryCounts = document.querySelectorAll(".wardrobe-summary-strip strong");
const detailName = document.querySelector("#detail-name");
const detailLocation = document.querySelector("#detail-location");
const detailSeasons = document.querySelector("#detail-seasons");
const detailFrequency = document.querySelector("#detail-frequency");
const detailLastWorn = document.querySelector("#detail-last-worn");
const detailStatus = document.querySelector("#detail-status");
const detailCategory = document.querySelector("#detail-category");
const detailNote = document.querySelector("#detail-note");
const favoriteButtons = document.querySelectorAll("[data-favorite-outfit]");
const storageTaskNodes = document.querySelectorAll("[data-storage-task]");
const storageProgressText = document.querySelector("#storage-progress-text");
const storageProgressBar = document.querySelector("#storage-progress-bar");
const APP_CONFIG = window.APP_CONFIG || {};
const SUPABASE_URL = String(APP_CONFIG.supabaseUrl || "").trim();
const SUPABASE_ANON_KEY = String(APP_CONFIG.supabaseAnonKey || "").trim();
const SUPABASE_BUCKET = String(APP_CONFIG.supabaseBucket || "garment-images").trim();
const SITE_URL = String(APP_CONFIG.siteUrl || "").trim();
const AI_OUTFIT_FUNCTION_NAME = String(APP_CONFIG.aiOutfitFunctionName || "ai-outfit-preview").trim();
const SUPABASE_CDN_URLS = [
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2",
  "https://unpkg.com/@supabase/supabase-js@2"
];

let currentView = "home";
let currentSeason = "spring";
let currentWardrobeFilter = "all";
let currentWardrobeState = "all";
let currentWardrobeView = "board";
let lastAddGarmentTrigger = null;
let lastAuthTrigger = null;
let isEmbeddedIntakeOpen = false;
let currentSession = null;
let currentUser = null;
let isCloudSyncLoading = false;
let isAuthSubmitting = false;
let isSupabaseScriptLoading = false;
let supabaseScriptLoadPromise = null;
let supabaseLoadErrorMessage = "";
let supabaseClient = null;
const AI_INTAKE_CHANNEL_NAME = "atelier-archive-ai-intake";
const AI_INTAKE_PENDING_GARMENT_KEY = "atelier-archive-ai-intake-pending-garment";
const CUSTOM_GARMENTS_KEY = "atelier-archive-custom-garments";
const OUTFIT_HISTORY_KEY = "atelier-archive-outfit-history";
const OUTFIT_MODEL_PROFILE_KEY = "atelier-archive-outfit-model-profile";
const WARDROBE_VIEW_KEY = "atelier-archive-wardrobe-view";
const WARDROBE_VISIBLE_COLUMNS_KEY = "atelier-archive-wardrobe-visible-columns";
const WARDROBE_VISIBLE_COLUMNS_METADATA_KEY = "wardrobe_visible_columns";
const OUTFIT_MODEL_PROFILE_METADATA_KEY = "outfit_model_profile";
const WARDROBE_TYPE_OPTIONS = [
  { value: "top", label: "上装" },
  { value: "bottom", label: "下装" },
  { value: "outer", label: "外套" },
  { value: "accessory", label: "鞋包配饰" }
];
const WARDROBE_STATE_OPTIONS = [
  { value: "pending", label: "待整理" },
  { value: "active", label: "当季外放" },
  { value: "frequent", label: "常穿" }
];
const WARDROBE_LIST_COLUMNS = [
  { field: "name", label: "名称", minWidth: 170, cellClass: "cell-name", required: true },
  { field: "type", label: "类型", minWidth: 132, control: { type: "select", options: WARDROBE_TYPE_OPTIONS } },
  { field: "state", label: "衣柜状态", minWidth: 136, control: { type: "select", options: WARDROBE_STATE_OPTIONS } },
  { field: "location", label: "收纳位置", minWidth: 160 },
  { field: "color", label: "颜色标签", minWidth: 136 },
  { field: "seasons", label: "季节标签", minWidth: 136 },
  { field: "purchaseDate", label: "购入时间", minWidth: 150, control: { type: "date" } },
  { field: "price", label: "价格", minWidth: 118 },
  { field: "brand", label: "品牌备注", minWidth: 146 },
  { field: "categoryText", label: "分类说明", minWidth: 148 },
  { field: "status", label: "状态标签", minWidth: 140 },
  { field: "frequency", label: "穿着频率", minWidth: 132 },
  { field: "lastWorn", label: "最近穿着", minWidth: 144 },
  { field: "footer", label: "卡片短标签", minWidth: 148 },
  { field: "note", label: "备注", minWidth: 220, cellClass: "cell-note" }
];
const WARDROBE_REQUIRED_COLUMNS = WARDROBE_LIST_COLUMNS
  .filter((column) => column.required)
  .map((column) => column.field);
const WARDROBE_DEFAULT_VISIBLE_COLUMNS = WARDROBE_LIST_COLUMNS.map((column) => column.field);
let currentWardrobeVisibleColumns = WARDROBE_DEFAULT_VISIBLE_COLUMNS.slice();
const aiIntakeChannel = "BroadcastChannel" in window ? new BroadcastChannel(AI_INTAKE_CHANNEL_NAME) : null;
const handledAiIntakeTransferIds = new Set();
let hasBoundAddViewFrameSizing = false;
const savedOutfits = new Set(
  Array.from(favoriteButtons)
    .filter((button) => button.classList.contains("is-saved"))
    .map((button) => button.dataset.outfitId)
);
const OUTFIT_SLOT_CONFIG = [
  {
    key: "top",
    label: "上衣 / 内搭",
    eyebrow: "Upper",
    description: "T 恤、衬衫、针织、打底都先放在这里。"
  },
  {
    key: "outer",
    label: "外套",
    eyebrow: "Outer",
    description: "开衫、夹克、大衣和叠穿层。"
  },
  {
    key: "bottom",
    label: "下装",
    eyebrow: "Bottom",
    description: "裤装和裙装会加载到下半身。"
  },
  {
    key: "accessory",
    label: "鞋包配饰",
    eyebrow: "Accessories",
    description: "鞋、包、围巾和帽子统一放在这一行。"
  }
];
const outfitTopSlot = OUTFIT_SLOT_CONFIG.find((slot) => slot.key === "top");

if (outfitTopSlot) {
  outfitTopSlot.label = "\u4e0a\u8863";
}

const OUTFIT_SELECTION_NONE = "__none__";
const OUTFIT_SEASON_KEYWORDS = {
  spring: ["春", "四季"],
  summer: ["夏", "四季"],
  autumn: ["秋", "四季"],
  winter: ["冬", "四季"]
};
const OUTFIT_REFERENCE_CANVAS_SIZE = 1600;
const OUTFIT_REFERENCE_GRID_COLUMNS = 2;
const OUTFIT_REFERENCE_CELL_GAP = 44;
const OUTFIT_REFERENCE_MARGIN = 84;
const OUTFIT_GENERATION_TIMEOUT_MS = 120_000;
const OUTFIT_HISTORY_MANIFEST_FILENAME = "history.json";
const OUTFIT_SCROLLBAR_MIN_THUMB_WIDTH = 32;
const OUTFIT_HISTORY_DRAG_THRESHOLD = 6;
let outfitDraftSelection = createEmptyOutfitSelection();
let outfitAppliedSelection = createEmptyOutfitSelection();
let isOutfitGenerating = false;
let outfitGeneratedPreviewUrl = "";
let outfitDefaultModelProfile = createDefaultOutfitModelProfile();
let outfitAppliedModelProfile = normalizeOutfitModelProfile(outfitDefaultModelProfile);
let outfitHistoryItems = [];
let isOutfitHistoryLoading = false;
let lastOutfitHistoryTrigger = null;
let lastOutfitModelTrigger = null;
let outfitModelModalSnapshot = createDefaultOutfitModelProfile();
let isOutfitModelProfileSaving = false;
let outfitHistoryDragPointerId = null;
let outfitHistoryDragStartX = 0;
let outfitHistoryDragStartScrollLeft = 0;
let outfitHistoryDragMoved = false;
let suppressOutfitHistoryClick = false;
let activeOutfitScrollbarDrag = null;
let activeOutfitTrackDrag = null;
let suppressOutfitTrackClick = false;
let outfitPreviewStageIntervalId = 0;
let outfitPreviewStageTimeoutId = 0;

try {
  currentWardrobeView = window.localStorage.getItem(WARDROBE_VIEW_KEY) === "list" ? "list" : "board";
} catch {
  currentWardrobeView = "board";
}

outfitDefaultModelProfile = loadOutfitModelProfileFromStorageKey(getOutfitModelProfileStorageKeyForUser(""));
outfitAppliedModelProfile = normalizeOutfitModelProfile(outfitDefaultModelProfile);

currentWardrobeVisibleColumns = loadWardrobeVisibleColumnsFromStorageKey(
  getWardrobeVisibleColumnsStorageKeyForUser("")
);

function getGarmentCards() {
  return Array.from(document.querySelectorAll(".garment-card[data-garment-id]"));
}

function getWardrobeListRows() {
  return Array.from(document.querySelectorAll(".wardrobe-list-row"));
}

function normalizeWardrobeVisibleColumns(fields) {
  const normalized = [];
  const seen = new Set();
  const requested = Array.isArray(fields) ? fields : [];
  const availableFields = new Set(WARDROBE_LIST_COLUMNS.map((column) => column.field));

  WARDROBE_REQUIRED_COLUMNS.forEach((field) => {
    if (!availableFields.has(field) || seen.has(field)) {
      return;
    }

    seen.add(field);
    normalized.push(field);
  });

  requested.forEach((field) => {
    if (!availableFields.has(field) || seen.has(field)) {
      return;
    }

    seen.add(field);
    normalized.push(field);
  });

  return normalized;
}

function getVisibleWardrobeColumns() {
  return WARDROBE_LIST_COLUMNS.filter((column) => currentWardrobeVisibleColumns.includes(column.field));
}

function getWardrobeVisibleColumnsStorageKeyForUser(userId = "") {
  return userId ? `${WARDROBE_VISIBLE_COLUMNS_KEY}:${userId}` : WARDROBE_VISIBLE_COLUMNS_KEY;
}

function getCurrentWardrobeVisibleColumnsStorageKey() {
  return getWardrobeVisibleColumnsStorageKeyForUser(currentUser?.id || "");
}

function hasWardrobeVisibleColumnsStorageKey(storageKey) {
  try {
    return window.localStorage.getItem(storageKey) !== null;
  } catch {
    return false;
  }
}

function loadWardrobeVisibleColumnsFromStorageKey(storageKey) {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) || "null");
    return Array.isArray(parsed) ? normalizeWardrobeVisibleColumns(parsed) : WARDROBE_DEFAULT_VISIBLE_COLUMNS.slice();
  } catch {
    return WARDROBE_DEFAULT_VISIBLE_COLUMNS.slice();
  }
}

function saveWardrobeVisibleColumnsToStorageKey(storageKey, fields) {
  window.localStorage.setItem(storageKey, JSON.stringify(normalizeWardrobeVisibleColumns(fields)));
}

function clearWardrobeVisibleColumnsFromStorageKey(storageKey) {
  window.localStorage.removeItem(storageKey);
}

function getWardrobeVisibleColumnsFromAuthUser(user = currentUser) {
  const savedColumns = user?.user_metadata?.[WARDROBE_VISIBLE_COLUMNS_METADATA_KEY];
  return Array.isArray(savedColumns) ? normalizeWardrobeVisibleColumns(savedColumns) : [];
}

function setWardrobeVisibleColumns(fields, options = {}) {
  const { persistCloud = true } = options;
  currentWardrobeVisibleColumns = normalizeWardrobeVisibleColumns(fields);

  try {
    saveWardrobeVisibleColumnsToStorageKey(getCurrentWardrobeVisibleColumnsStorageKey(), currentWardrobeVisibleColumns);
  } catch {
    // Ignore storage errors and keep the in-memory setting.
  }

  renderWardrobeListEditor();
  filterWardrobeCards();
  syncWardrobeColumnPicker();

  if (persistCloud) {
    syncWardrobeVisibleColumnsToCloudInBackground(currentWardrobeVisibleColumns);
  }
}

function getSiteUrl() {
  if (SITE_URL) {
    return SITE_URL;
  }

  return new URL(window.location.pathname, window.location.origin).toString();
}

function hasSupabaseConfig() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
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

  isSupabaseScriptLoading = true;
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

    supabaseLoadErrorMessage = "Supabase SDK 加载失败，当前网络可能拦截了外部脚本。";
    return null;
  })();

  try {
    return await supabaseScriptLoadPromise;
  } finally {
    isSupabaseScriptLoading = false;
    supabaseScriptLoadPromise = null;
  }
}

function canSyncWardrobeToCloud() {
  return Boolean(supabaseClient && currentUser);
}

function syncCurrentUserMetadata(user) {
  if (!user || currentUser?.id !== user.id) {
    return;
  }

  currentUser = user;

  if (currentSession?.user?.id === user.id) {
    currentSession = {
      ...currentSession,
      user
    };
  }
}

function getGarmentStorageKeyForUser(userId = "") {
  return userId ? `${CUSTOM_GARMENTS_KEY}:${userId}` : CUSTOM_GARMENTS_KEY;
}

function getCurrentGarmentStorageKey() {
  return getGarmentStorageKeyForUser(currentUser?.id || "");
}

function loadCustomGarmentsFromStorageKey(storageKey) {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
    return Array.isArray(parsed) ? parsed.map(normalizeCustomGarment) : [];
  } catch {
    return [];
  }
}

function saveCustomGarmentsToStorageKey(storageKey, items) {
  window.localStorage.setItem(storageKey, JSON.stringify(items.map(normalizeCustomGarment)));
}

function clearCustomGarmentsFromStorageKey(storageKey) {
  window.localStorage.removeItem(storageKey);
}

async function persistWardrobeVisibleColumnsToCloud(fields, userId = currentUser?.id || "") {
  const client = await ensureSupabaseClient();
  const normalized = normalizeWardrobeVisibleColumns(fields);

  if (!client || !userId) {
    return normalized;
  }

  const currentCloudColumns = getWardrobeVisibleColumnsFromAuthUser(currentUser);

  if (JSON.stringify(currentCloudColumns) === JSON.stringify(normalized)) {
    return normalized;
  }

  const existingMetadata = currentUser?.user_metadata && typeof currentUser.user_metadata === "object"
    ? currentUser.user_metadata
    : {};
  const { data, error } = await client.auth.updateUser({
    data: {
      ...existingMetadata,
      [WARDROBE_VISIBLE_COLUMNS_METADATA_KEY]: normalized
    }
  });

  if (error) {
    throw error;
  }

  if (data?.user) {
    syncCurrentUserMetadata(data.user);
  }

  return normalized;
}

function syncWardrobeVisibleColumnsToCloudInBackground(fields, userId = currentUser?.id || "") {
  if (!canSyncWardrobeToCloud() || !userId) {
    return;
  }

  persistWardrobeVisibleColumnsToCloud(fields, userId).catch((error) => {
    handleCloudSyncError(error, "云端列表显示属性同步失败，请稍后再试。");
  });
}

async function hydrateWardrobePreferencesFromCloud() {
  if (!canSyncWardrobeToCloud()) {
    return;
  }

  const userId = currentUser.id;
  const anonymousStorageKey = getWardrobeVisibleColumnsStorageKeyForUser("");
  const userStorageKey = getWardrobeVisibleColumnsStorageKeyForUser(userId);
  const cloudColumns = getWardrobeVisibleColumnsFromAuthUser(currentUser);

  if (cloudColumns.length) {
    setWardrobeVisibleColumns(cloudColumns, { persistCloud: false });

    try {
      saveWardrobeVisibleColumnsToStorageKey(userStorageKey, cloudColumns);
    } catch {
      // Ignore storage errors and keep the in-memory setting.
    }

    return;
  }

  const hasCachedUserColumns = hasWardrobeVisibleColumnsStorageKey(userStorageKey);
  const hasAnonymousColumns = hasWardrobeVisibleColumnsStorageKey(anonymousStorageKey);
  const fallbackColumns = hasCachedUserColumns
    ? loadWardrobeVisibleColumnsFromStorageKey(userStorageKey)
    : hasAnonymousColumns
      ? loadWardrobeVisibleColumnsFromStorageKey(anonymousStorageKey)
      : [];

  if (!fallbackColumns.length) {
    return;
  }

  setWardrobeVisibleColumns(fallbackColumns, { persistCloud: false });

  try {
    saveWardrobeVisibleColumnsToStorageKey(userStorageKey, fallbackColumns);

    if (!hasCachedUserColumns && hasAnonymousColumns) {
      clearWardrobeVisibleColumnsFromStorageKey(anonymousStorageKey);
    }
  } catch {
    // Ignore storage errors and keep the in-memory setting.
  }

  try {
    await persistWardrobeVisibleColumnsToCloud(fallbackColumns, userId);
  } catch (error) {
    handleCloudSyncError(error, "云端列表显示属性恢复失败，请稍后再试。");
  }
}

function mergeGarmentCollections(...collections) {
  const merged = new Map();

  collections.flat().forEach((item) => {
    const normalized = normalizeCustomGarment(item);

    if (!normalized.id) {
      return;
    }

    merged.set(normalized.id, normalized);
  });

  return Array.from(merged.values());
}

function setAuthFeedback(message, tone = "info") {
  if (!authFeedback) {
    return;
  }

  authFeedback.hidden = !message;
  authFeedback.textContent = message || "";
  authFeedback.dataset.tone = tone;
}

function setAuthBusy(isBusy) {
  isAuthSubmitting = isBusy;

  authEmailInput?.toggleAttribute("disabled", isBusy);
  authPasswordInput?.toggleAttribute("disabled", isBusy);
  authForm?.querySelectorAll("button").forEach((button) => {
    button.disabled = isBusy;
  });
}

function syncBodyModalState() {
  const hasOpenModal = [addGarmentModal, authModal, outfitHistoryModal, outfitModelModal].some((modal) => modal && !modal.hidden);
  document.body.classList.toggle("modal-open", hasOpenModal);
}

function getAuthSummaryText() {
  if (!hasSupabaseConfig()) {
    return "还没有配置 Supabase，请先填写 public-config.js 中的项目地址和 anon key。";
  }

  if (supabaseLoadErrorMessage) {
    return supabaseLoadErrorMessage;
  }

  if (isSupabaseScriptLoading) {
    return "正在连接 Supabase 服务，请稍等。";
  }

  if (isCloudSyncLoading) {
    return "正在同步云端衣柜，请稍等。";
  }

  if (currentUser?.email) {
    return `当前账号：${currentUser.email}`;
  }

  return "未登录时，仍然可以本地使用，但不会同步到云端。";
}

function syncAuthUi() {
  const isConfigured = hasSupabaseConfig();
  const isLoggedIn = Boolean(currentUser?.email);
  const title = !isConfigured
    ? "云端未配置"
    : supabaseLoadErrorMessage
      ? "云端连接失败"
      : isSupabaseScriptLoading
        ? "云端连接中"
    : isLoggedIn
      ? "云端已连接"
      : "等待登录";
  const copy = !isConfigured
    ? "先配置 Supabase 后，才能注册账号、保存个人衣柜和上传信息。"
    : supabaseLoadErrorMessage
      ? supabaseLoadErrorMessage
      : isSupabaseScriptLoading
        ? "正在加载云端 SDK，如果当前网络拦截外部脚本会导致稍后不可用。"
    : isCloudSyncLoading
      ? "正在从云端同步你的衣柜数据。"
      : isLoggedIn
        ? `${currentUser.email} 已登录，衣柜会自动同步到云端。`
        : "登录后，新增和编辑的衣服会保存到 Supabase。";

  if (authStatusTitle) {
    authStatusTitle.textContent = title;
  }

  if (authStatusCopy) {
    authStatusCopy.textContent = copy;
  }

  if (authTriggerLabel) {
    authTriggerLabel.textContent = isConfigured ? (isLoggedIn ? "账号已连接" : "账号与云端") : "云端未配置";
  }

  if (authSessionCopy) {
    authSessionCopy.textContent = getAuthSummaryText();
  }

  authSignOutButtons.forEach((button) => {
    button.hidden = !isLoggedIn;
  });

  authSignOutModalButtons.forEach((button) => {
    button.hidden = !isLoggedIn;
  });

  authForm?.querySelectorAll("button").forEach((button) => {
    if (button.hasAttribute("data-auth-signout-modal")) {
      return;
    }

    button.disabled = isAuthSubmitting || !isConfigured;
  });

  syncOutfitHistoryButton();
  renderOutfitHistoryPanel();
}

function openAuthModal(trigger = null) {
  if (!authModal) {
    return;
  }

  if (trigger instanceof HTMLElement) {
    lastAuthTrigger = trigger;
  }

  authModal.hidden = false;
  authModal.classList.add("is-open");
  authModal.setAttribute("aria-hidden", "false");
  syncBodyModalState();
  syncAuthUi();
  authEmailInput?.focus();
}

function closeAuthModal() {
  if (!authModal) {
    return;
  }

  authModal.hidden = true;
  authModal.classList.remove("is-open");
  authModal.setAttribute("aria-hidden", "true");
  setAuthFeedback("");
  syncBodyModalState();

  if (lastAuthTrigger instanceof HTMLElement) {
    lastAuthTrigger.focus();
  }
}

function getAuthCredentials() {
  return {
    email: authEmailInput?.value.trim() || "",
    password: authPasswordInput?.value || ""
  };
}

function getWardrobeFilterLabel(type) {
  if (type === "top") {
    return "上装";
  }

  if (type === "bottom") {
    return "下装";
  }

  if (type === "outer") {
    return "外套";
  }

  if (type === "accessory") {
    return "鞋包配饰";
  }

  return "全部";
}

function ensureAddViewNavigation() {
  const sidebarNav = document.querySelector(".sidebar-nav");
  const outfitLink = sidebarNav?.querySelector('[data-view-link="outfit"]');

  if (!sidebarNav || sidebarNav.querySelector('[data-view-link="add"]')) {
    return;
  }

  const link = document.createElement("a");
  link.href = "#add";
  link.dataset.viewLink = "add";
  link.innerHTML = `
    <span class="menu-mini" aria-hidden="true">
      <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
        <path d="M12 5.5v13" />
        <path d="M5.5 12h13" />
      </svg>
    </span>
    <span class="menu-full">新增</span>
  `;

  if (outfitLink) {
    sidebarNav.insertBefore(link, outfitLink);
  } else {
    sidebarNav.appendChild(link);
  }
}

function ensureAddViewPage() {
  const mainContent = document.querySelector(".main-content");
  const storageView = document.querySelector('.page-view[data-view="storage"]');

  if (!mainContent || document.querySelector('.page-view[data-view="add"]')) {
    return;
  }

  const section = document.createElement("section");
  section.className = "page-view";
  section.dataset.view = "add";
  section.setAttribute("aria-hidden", "true");
  section.innerHTML = `
    <header class="page-hero compact-hero page-ribbon">
      <p class="eyebrow page-ribbon-kicker">新增 / Add</p>
      <h2>添加你的新衣服</h2>
      <p class="page-ribbon-note">上传原图，AI 归档，再回填衣柜。</p>
    </header>

    <section class="glass-panel simple-panel add-workspace-panel">
      <div class="add-workspace-layout">
        <aside class="add-brief-panel">
          <div class="section-head add-brief-head">
            <div>
              <p class="eyebrow">Add Flow</p>
              <h3>把新增流程收成一个稳定工作台</h3>
            </div>
          </div>

          <p class="add-brief-copy">
            先上传原图，让 AI 统一裁切、背景和画面比例，再回到衣柜补充标签、位置和状态。
            右侧处理区会固定在当前屏幕里，内容过长时在处理台内部滚动，不再把整页撑乱。
          </p>

          <div class="add-brief-points">
            <article class="add-brief-point">
              <span class="add-step-index">01</span>
              <strong>上传原图</strong>
              <p>把手机照片、平铺图或挂拍图先放进处理台，集中整理这一批新增衣物。</p>
            </article>

            <article class="add-brief-point">
              <span class="add-step-index">02</span>
              <strong>生成标准图</strong>
              <p>让 AI 统一背景和裁切比例，得到适合归档、筛选和穿搭预览的图片。</p>
            </article>

            <article class="add-brief-point">
              <span class="add-step-index">03</span>
              <strong>回填衣柜信息</strong>
              <p>处理完成后回到衣柜页，把分类、季节、位置和常穿状态补完整。</p>
            </article>
          </div>

          <div class="add-brief-note">
            <strong>工作区提示</strong>
            <p>这一页默认占满当前屏幕。浏览器尺寸变化时，会优先保持窗口整齐，再选择内部滚动。</p>
          </div>
        </aside>

        <section class="embedded-intake-panel add-view-panel">
          <div class="add-frame-head">
            <div>
              <p class="eyebrow">AI Intake Studio</p>
              <h3>标准化处理窗口</h3>
            </div>
            <p class="add-frame-note">右侧保持为独立处理区，方便连续上传、裁切和确认。</p>
          </div>

          <iframe
            class="embedded-intake-frame add-view-frame"
            title="衣物 AI 标准化处理台"
            loading="lazy"
            src="./studio/intake-studio.html?embed=1"
          ></iframe>
        </section>
      </div>
    </section>
  `;

  if (storageView) {
    mainContent.insertBefore(section, storageView);
  } else {
    mainContent.appendChild(section);
  }

  bindAddViewFrameSizing();
}

function getAddViewFrame() {
  return document.querySelector(".add-view-frame");
}

function applyAddViewFrameHeight(rawHeight) {
  const frame = getAddViewFrame();
  const height = Number(rawHeight);

  if (!(frame instanceof HTMLIFrameElement) || !Number.isFinite(height) || height <= 0) {
    return;
  }

  const viewportHeight = window.innerHeight || 0;
  const viewportWidth = window.innerWidth || 0;
  const minHeight = viewportWidth >= 1280 ? 700 : viewportWidth >= 860 ? 620 : 520;
  const reservedHeight = viewportWidth >= 1280 ? 228 : viewportWidth >= 860 ? 188 : 148;
  const maxHeight = viewportHeight > 0 ? Math.max(minHeight, viewportHeight - reservedHeight) : 1120;
  const resolvedHeight = Math.min(maxHeight, Math.max(minHeight, Math.ceil(height) + 8));
  frame.style.height = `${resolvedHeight}px`;
  frame.style.minHeight = `${resolvedHeight}px`;
}

function syncAddViewFrameHeight() {
  const frame = getAddViewFrame();

  if (!(frame instanceof HTMLIFrameElement)) {
    return;
  }

  try {
    const documentElement = frame.contentDocument?.documentElement;
    const body = frame.contentDocument?.body;
    const nextHeight = Math.max(
      documentElement?.scrollHeight || 0,
      documentElement?.offsetHeight || 0,
      body?.scrollHeight || 0,
      body?.offsetHeight || 0
    );

    applyAddViewFrameHeight(nextHeight);
  } catch {
    // Ignore cross-frame sizing errors.
  }
}

function bindAddViewFrameSizing() {
  const frame = getAddViewFrame();

  if (!(frame instanceof HTMLIFrameElement) || hasBoundAddViewFrameSizing) {
    return;
  }

  hasBoundAddViewFrameSizing = true;
  frame.addEventListener("load", () => {
    syncAddViewFrameHeight();
    window.setTimeout(syncAddViewFrameHeight, 160);
    window.setTimeout(syncAddViewFrameHeight, 520);
  });

  window.addEventListener("resize", syncAddViewFrameHeight);
}

function setText(target, value) {
  if (target) {
    target.textContent = value;
  }
}

function setTextAll(targets, value) {
  targets.forEach((target) => {
    target.textContent = value;
  });
}

function resetScrollPosition() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

function renderList(target, items) {
  target.innerHTML = "";

  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    target.appendChild(listItem);
  });
}

function getRecentGarmentWindowCount(items = [], days = 7) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

  return items.filter((item) => {
    const timestamp = Date.parse(String(item?.purchaseDate || "").trim());
    return Number.isFinite(timestamp) && timestamp >= cutoff;
  }).length;
}

function buildHomeRecentGarmentCardMarkup(item, index = 0) {
  const ribbon = escapeHtml(item.location || "待整理");
  const name = escapeHtml(item.name || "未命名衣物");
  const category = escapeHtml(item.categoryText || "AI 导入");
  const status = escapeHtml(item.status || "待整理");
  const footer = escapeHtml(item.footer || item.frequency || "刚加入衣柜");
  const imageSource = item.imageUrl || item.imageDataUrl || "";
  const image = imageSource
    ? `<div class="garment-media-shell"><img class="garment-photo" src="${escapeHtml(imageSource)}" alt="${name}" width="320" height="320" loading="lazy" decoding="async"></div>`
    : `<div class="garment-media-shell"><div class="garment-figure ${getFigureClass(item.type)}"></div></div>`;

  return `
    <button class="mini-garment-card home-garment-card" type="button" data-home-garment-id="${escapeHtml(item.id)}">
      <span class="card-ribbon">${ribbon}</span>
      ${image}
      <h4>${name}</h4>
      <p>${category}</p>
      <div class="garment-footer">
        <span>${status}</span>
        <span>${footer}</span>
      </div>
    </button>
  `;
}

function buildHomeOutfitHistoryCardMarkup(entry, index = 0) {
  const garmentRows = entry.garments.length
    ? entry.garments
      .slice(0, 3)
      .map((item) => `
        <div class="outfit-history-row">
          <strong>${escapeHtml(getTypeLabel(item.type))}</strong>
          <span>${escapeHtml(item.name)}</span>
        </div>
      `)
      .join("")
    : `<div class="outfit-history-row"><strong>单品</strong><span>无记录</span></div>`;
  const profileChips = [
    getOutfitHistoryEthnicityLabel(entry.modelProfile.ethnicity),
    getOutfitHistoryGenderLabel(entry.modelProfile.gender),
    entry.modelProfile.heightCm ? `${entry.modelProfile.heightCm} cm` : "",
    entry.modelProfile.weightKg ? `${entry.modelProfile.weightKg} kg` : ""
  ]
    .filter(Boolean)
    .map((label) => `<span class="outfit-history-chip">${escapeHtml(label)}</span>`)
    .join("");
  return `
    <article class="home-outfit-card">
      <div class="outfit-history-image-shell">
        <img class="outfit-history-image" src="${escapeHtml(entry.imageUrl)}" alt="最近穿搭预览" width="720" height="960" loading="lazy" decoding="async">
      </div>
      <div class="outfit-history-copy">
        <div class="outfit-history-meta">
          <strong>${escapeHtml(formatOutfitHistoryTime(entry.createdAt))}</strong>
          <span>${escapeHtml(entry.garments.length ? `${entry.garments.length} 件单品` : "历史记录")}</span>
        </div>
        <div class="outfit-history-rows">${garmentRows}</div>
        <div class="outfit-history-chip-row">${profileChips}</div>
        <button class="ghost-button inline-button home-outfit-action" type="button" data-load-home-outfit-history="${escapeHtml(entry.id)}">载入到穿搭</button>
      </div>
    </article>
  `;
}

function renderHomeDashboard() {
  const items = loadCustomGarments().map(normalizeCustomGarment);
  const seasonMeta = seasonConfig[currentSeason] || seasonConfig.spring;
  const totalCount = items.length;
  const seasonalCount = items.filter((item) => getOutfitSeasonScore(item) > 0).length;
  const pendingCount = items.filter((item) => item.state === "pending").length;
  const recentItems = items.slice(0, 4);
  const recentWindowCount = getRecentGarmentWindowCount(items, 7);
  const recentCount = recentWindowCount || recentItems.length;
  const ribbonMeta = totalCount
    ? `${totalCount} 件已归档 · ${seasonalCount} 件当前可穿`
    : "先建立第一批常穿单品，首页就会开始形成节奏。";
  const nextStep = !totalCount
    ? "先添加 3 到 5 件最常穿的衣物，让首页开始真正形成你的衣橱工作面。"
    : pendingCount > 0
      ? `现在最值得先做的是处理 ${pendingCount} 件待整理单品，让衣柜状态和筛选结果先变干净。`
      : outfitHistoryItems.length
        ? "衣柜基础已经稳定，今天可以直接回到穿搭页继续生成，或者复用最近的试穿结果。"
        : "衣柜已经有了基础单品，下一步建议去穿搭页生成第一套试穿图，让首页开始形成完整闭环。";
  const pulseTitle = recentWindowCount
    ? `近 7 天新增了 ${recentWindowCount} 件单品`
    : totalCount
      ? "最近没有新的归档变化"
      : "衣橱还在起步阶段";
  const pulseCopy = recentWindowCount
    ? "保持这个录入节奏，首页会持续更新最近变化和更可执行的下一步。"
    : totalCount
      ? "可以补录最近买入或最常穿但还没归档的单品，让首页保持更新和可用。"
      : "先把常穿衣物录进去，首页才会开始形成有用的数据和推荐节奏。";
  const focusTitle = `当前重点：${seasonMeta.label}`;
  const focusCopy = pendingCount
    ? `${seasonMeta.focus} 是这段时间的重点，同时先清掉待整理状态，避免衣柜判断失真。`
    : `${seasonMeta.focus} 是这段时间的重点，现在可以围绕当季单品继续补齐搭配和穿搭记录。`;

  setText(homeSeasonNote, `当前季节：${seasonMeta.label} · 重点：${seasonMeta.focus}`);
  setText(homeRibbonMeta, ribbonMeta);
  setText(homeNextStep, nextStep);
  setText(homePulseTitle, pulseTitle);
  setText(homePulseCopy, pulseCopy);
  setText(homeFocusTitle, focusTitle);
  setText(homeFocusCopy, focusCopy);
  setText(homeTotalCount, String(totalCount));
  setText(homeTotalCopy, totalCount ? "已归档的全部单品" : "还没有加入任何衣物");
  setText(homeSeasonCount, String(seasonalCount));
  setText(homeSeasonCopy, `${seasonMeta.label}季优先可穿的单品`);
  setText(homePendingCount, String(pendingCount));
  setText(homePendingCopy, pendingCount ? "建议优先处理待整理单品" : "当前没有待整理堆积");
  setText(homeRecentCount, String(recentCount));
  setText(homeRecentCopy, recentWindowCount ? "近 7 天录入的单品" : "按最近归档顺序显示");

  if (homeRecentGarments) {
    homeRecentGarments.innerHTML = recentItems.length
      ? recentItems.map((item, index) => buildHomeRecentGarmentCardMarkup(item, index)).join("")
      : `
        <div class="home-empty-card">
          <strong>先把常穿衣服放进衣柜</strong>
          <p>添加几件带图片的单品后，这里会自动显示最近加入的衣服。</p>
          <a class="primary-button inline-button" href="#add" data-view-link="add">添加新衣服</a>
        </div>
      `;
  }

  if (homeOpenOutfitHistoryButton) {
    homeOpenOutfitHistoryButton.disabled = !currentUser || !outfitHistoryItems.length;
  }

  if (!homeOutfitHistory) {
    return;
  }

  if (!currentUser) {
    homeOutfitHistory.innerHTML = `
      <div class="home-empty-card">
        <strong>登录后同步最近穿搭</strong>
        <p>历史试穿图会跟账号绑定，登录后可以直接在首页继续回看。</p>
        <button class="ghost-button inline-button" type="button" data-open-auth-modal>登录账号</button>
      </div>
    `;
    return;
  }

  if (!outfitHistoryItems.length) {
    homeOutfitHistory.innerHTML = `
      <div class="home-empty-card">
        <strong>还没有最近穿搭</strong>
        <p>生成过一套 AI 试穿图后，这里会自动显示最近的穿搭历史。</p>
        <a class="secondary-button inline-button" href="#outfit" data-view-link="outfit">去穿搭页</a>
      </div>
    `;
    return;
  }

  homeOutfitHistory.innerHTML = outfitHistoryItems
    .slice(0, 2)
    .map((entry, index) => buildHomeOutfitHistoryCardMarkup(entry, index))
    .join("");
}

function getStorageProgress() {
  const completed = Array.from(storageTaskNodes).filter((node) => node.checked).length;
  return {
    completed,
    total: storageTaskNodes.length
  };
}

function applySidebar(view) {
  const config = viewConfig[view] || viewConfig.home;

  setText(sidebarIntro, sidebarSlogan);
  setText(utilityViewName, config.viewName);
  setText(utilityViewFocus, config.focus);
  setText(utilityMode, config.mode);
  document.title = config.title;
}

function applyView(view) {
  const resolvedView = viewConfig[view] ? view : "home";
  currentView = resolvedView;
  document.body.classList.toggle("home-view-active", resolvedView === "home");
  document.body.classList.toggle("wardrobe-view-active", resolvedView === "wardrobe");
  document.body.classList.toggle("add-view-active", resolvedView === "add");
  document.body.classList.toggle("outfit-view-active", resolvedView === "outfit");

  document.querySelectorAll(".page-view").forEach((panel) => {
    const isActive = panel.dataset.view === resolvedView;
    panel.classList.toggle("is-active", isActive);
    panel.setAttribute("aria-hidden", String(!isActive));
  });

  document.querySelectorAll(".sidebar-nav [data-view-link]").forEach((link) => {
    const isActive = link.dataset.viewLink === resolvedView;
    link.classList.toggle("active-nav", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  applySidebar(resolvedView);
  resetScrollPosition();
}

function bindAddViewLink() {
  const addLink = document.querySelector('.sidebar-nav [data-view-link="add"]');

  if (!addLink || addLink.dataset.bound === "true") {
    return;
  }

  addLink.dataset.bound = "true";
  addLink.addEventListener("click", (event) => {
    event.preventDefault();

    if (window.location.hash === "#add") {
      applyView("add");
      return;
    }

    window.location.hash = "add";
  });
}

function normalizeWardrobeToolbar() {
  const wardrobeHead = document.querySelector(".wardrobe-list-head");
  const tabRow = document.querySelector(".shop-tab-row");
  const existingActions = wardrobeHead?.querySelector(".wardrobe-list-actions");
  const stateRow = existingActions?.querySelector(".wardrobe-state-row");
  const summaryStrip = document.querySelector(".wardrobe-summary-strip");

  if (!tabRow) {
    return;
  }

  stateRow?.remove();

  if (!tabRow.querySelector(".shop-tab-group")) {
    const tabGroup = document.createElement("div");
    tabGroup.className = "shop-tab-group";
    tabGroup.dataset.toggleGroup = "";
    tabGroup.dataset.wardrobeFilterGroup = "";

    Array.from(tabRow.querySelectorAll(".shop-tab")).forEach((button) => {
      tabGroup.appendChild(button);
    });

    tabRow.removeAttribute("data-toggle-group");
    tabRow.removeAttribute("data-wardrobe-filter-group");
    tabRow.prepend(tabGroup);
  }

  if (existingActions && !tabRow.querySelector(".shop-tab-tools")) {
    existingActions.classList.add("shop-tab-tools");
    tabRow.appendChild(existingActions);
  }

  if (existingActions && !existingActions.querySelector("[data-wardrobe-column-picker]")) {
    const picker = document.createElement("div");
    const addButton = existingActions.querySelector("[data-open-add-modal]");

    picker.className = "wardrobe-column-picker";
    picker.dataset.wardrobeColumnPicker = "";
    picker.innerHTML = `
      <button
        class="secondary-button inline-button wardrobe-column-toggle"
        type="button"
        data-toggle-wardrobe-columns
        aria-haspopup="dialog"
        aria-expanded="false"
        aria-controls="wardrobe-column-popover"
      >显示属性</button>
      <div class="wardrobe-column-popover" id="wardrobe-column-popover" data-wardrobe-column-panel></div>
    `;

    if (addButton) {
      existingActions.insertBefore(picker, addButton);
    } else {
      existingActions.appendChild(picker);
    }
  }

  if (existingActions && !existingActions.querySelector("[data-toggle-wardrobe-view]")) {
    const addButton = existingActions.querySelector("[data-open-add-modal]");
    const viewButton = document.createElement("button");
    viewButton.type = "button";
    viewButton.className = "secondary-button inline-button wardrobe-view-toggle";
    viewButton.dataset.toggleWardrobeView = "";

    if (addButton) {
      existingActions.insertBefore(viewButton, addButton);
    } else {
      existingActions.appendChild(viewButton);
    }
  }

  wardrobeHead?.remove();
  summaryStrip?.remove();
  toggleGroups = document.querySelectorAll("[data-toggle-group]");
}

function renderWardrobeColumnPickerOptions() {
  return `
    <div class="wardrobe-column-popover-head">
      <strong>列表显示属性</strong>
      <span>名称和操作固定显示，其他列可以按你的习惯自由隐藏。</span>
    </div>
    <div class="wardrobe-column-grid">
      ${WARDROBE_LIST_COLUMNS
        .filter((column) => !column.required)
        .map((column) => `
          <label class="wardrobe-column-option">
            <input
              type="checkbox"
              data-wardrobe-column-field="${escapeHtml(column.field)}"
              ${currentWardrobeVisibleColumns.includes(column.field) ? "checked" : ""}
            >
            <span>${escapeHtml(column.label)}</span>
          </label>
        `)
        .join("")}
    </div>
  `;
}

function closeWardrobeColumnPicker() {
  const picker = document.querySelector("[data-wardrobe-column-picker]");
  const button = picker?.querySelector("[data-toggle-wardrobe-columns]");

  picker?.classList.remove("is-open");
  button?.setAttribute("aria-expanded", "false");
}

function toggleWardrobeColumnPicker(forceOpen) {
  const picker = document.querySelector("[data-wardrobe-column-picker]");
  const button = picker?.querySelector("[data-toggle-wardrobe-columns]");

  if (!picker || picker.hidden) {
    return;
  }

  const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : !picker.classList.contains("is-open");
  picker.classList.toggle("is-open", shouldOpen);
  button?.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
}

function syncWardrobeColumnPicker() {
  const picker = document.querySelector("[data-wardrobe-column-picker]");
  const button = picker?.querySelector("[data-toggle-wardrobe-columns]");
  const panel = picker?.querySelector("[data-wardrobe-column-panel]");

  if (!picker || !button || !panel) {
    return;
  }

  if (currentWardrobeView !== "list") {
    closeWardrobeColumnPicker();
  }

  picker.hidden = currentWardrobeView !== "list";
  button.textContent = `显示属性 · ${getVisibleWardrobeColumns().length}列`;
  button.setAttribute("aria-expanded", picker.classList.contains("is-open") ? "true" : "false");
  panel.innerHTML = renderWardrobeColumnPickerOptions();
}

function ensureWardrobeListEditor() {
  if (!wardrobeGrid) {
    return null;
  }

  let editor = document.querySelector("#wardrobe-list-editor");

  if (!editor) {
    editor = document.createElement("section");
    editor.id = "wardrobe-list-editor";
    editor.className = "wardrobe-editor-list";
    wardrobeGrid.insertAdjacentElement("afterend", editor);
  }

  return editor;
}

function getTypeLabel(type) {
  if (type === "bottom") {
    return "下装";
  }

  if (type === "outer") {
    return "外套";
  }

  if (type === "dress") {
    return "连衣裙";
  }

  if (type === "accessory") {
    return "鞋包配饰";
  }

  return "上装";
}

function getStateLabel(state) {
  if (state === "active") {
    return "当季外放";
  }

  if (state === "frequent") {
    return "常穿";
  }

  return "待整理";
}

function normalizeCustomGarment(item) {
  const normalized = item && typeof item === "object" ? item : {};

  return {
    id: normalized.id || `garment-${Date.now()}`,
    type: normalized.type || "top",
    state: normalized.state || "pending",
    name: normalized.name || "未命名衣物",
    categoryText: normalized.categoryText || "AI 导入",
    location: normalized.location || "待整理",
    seasons: normalized.seasons || normalized.season || "待确认",
    frequency: normalized.frequency || "新加入",
    lastWorn: normalized.lastWorn || "未穿过",
    note: normalized.note || "",
    status: normalized.status || "待整理",
    footer: normalized.footer || "AI 标准图",
    imageUrl: normalized.imageUrl || "",
    imageDataUrl: normalized.imageDataUrl || "",
    color: normalized.color || "",
    purchaseDate: normalized.purchaseDate || "",
    price: normalized.price || "",
    brand: normalized.brand || ""
  };
}

function buildWardrobeTableControl(field, value, options = {}) {
  const { type = "text" } = options;

  if (type === "select") {
    const selectOptions = (options.options || [])
      .map((option) => {
        const selected = String(option.value) === String(value) ? " selected" : "";
        return `<option value="${escapeHtml(option.value)}"${selected}>${escapeHtml(option.label)}</option>`;
      })
      .join("");

    return `<select data-field="${field}">${selectOptions}</select>`;
  }

  return `<input data-field="${field}" type="${type}" value="${escapeHtml(value || "")}">`;
}

function buildWardrobeTableCellMarkup(item, column) {
  const controlMarkup = buildWardrobeTableControl(column.field, item[column.field], column.control || {});
  const className = column.cellClass ? ` class="${column.cellClass}"` : "";
  return `<td${className}>${controlMarkup}</td>`;
}

function getWardrobeTableMinWidth(columns) {
  return columns.reduce((total, column) => total + (column.minWidth || 120), 96);
}

function buildWardrobeListRowMarkup(item) {
  const visibleColumns = getVisibleWardrobeColumns();

  return `
    <tr
      class="wardrobe-list-row"
      data-garment-id="${escapeHtml(item.id)}"
      data-garment-type="${escapeHtml(item.type)}"
      data-garment-state="${escapeHtml(item.state)}"
      data-garment-name="${escapeHtml(item.name)}"
      data-garment-category="${escapeHtml(item.categoryText)}"
      data-garment-location="${escapeHtml(item.location)}"
      data-garment-seasons="${escapeHtml(item.seasons)}"
      data-garment-status="${escapeHtml(item.status)}"
      data-garment-color="${escapeHtml(item.color)}"
      data-garment-brand="${escapeHtml(item.brand)}"
      data-garment-price="${escapeHtml(item.price)}"
    >
      ${visibleColumns.map((column) => buildWardrobeTableCellMarkup(item, column)).join("")}
      <td class="cell-action">
        <button class="ghost-button inline-button wardrobe-delete-button" type="button" data-delete-garment="${escapeHtml(item.id)}">删除</button>
      </td>
    </tr>
  `;
}

function renderWardrobeListEditor() {
  const editor = ensureWardrobeListEditor();

  if (!editor) {
    return;
  }

  const items = loadCustomGarments();
  const visibleColumns = getVisibleWardrobeColumns();

  if (!items.length) {
    editor.innerHTML = `
      <div class="wardrobe-list-empty">
        <strong>还没有可编辑的衣物</strong>
        <span>先去“新增”页生成并加入几件衣物，再切回列表模式编辑。</span>
      </div>
    `;
    return;
  }

  editor.innerHTML = `
    <div class="wardrobe-editor-table-shell">
      <table class="wardrobe-editor-table" style="min-width: ${getWardrobeTableMinWidth(visibleColumns)}px;">
        <thead>
          <tr>
            ${visibleColumns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join("")}
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${items.map((item) => buildWardrobeListRowMarkup(item)).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function syncWardrobeViewToggle() {
  const button = document.querySelector("[data-toggle-wardrobe-view]");

  if (!button) {
    return;
  }

  button.textContent = currentWardrobeView === "list" ? "切换视图 · 看板" : "切换视图 · 列表";
}

function applyWardrobeViewMode() {
  const editor = ensureWardrobeListEditor();

  if (wardrobeGrid) {
    wardrobeGrid.hidden = currentWardrobeView !== "board";
  }

  if (editor) {
    editor.hidden = currentWardrobeView !== "list";
  }

  document.body.classList.toggle("wardrobe-list-view-active", currentWardrobeView === "list");
  syncWardrobeViewToggle();
  syncWardrobeColumnPicker();
}

function toggleWardrobeViewMode() {
  currentWardrobeView = currentWardrobeView === "list" ? "board" : "list";
  window.localStorage.setItem(WARDROBE_VIEW_KEY, currentWardrobeView);
  applyWardrobeViewMode();
  filterWardrobeCards();
}

function getViewFromHash() {
  const hashValue = window.location.hash.replace(/^#/, "");
  return viewConfig[hashValue] ? hashValue : "home";
}

function syncSeasonButtons(key) {
  seasonButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.season === key);
  });
}

function applySeason(key) {
  const config = seasonConfig[key];

  if (!config) {
    return;
  }

  currentSeason = key;
  setTextAll(seasonCountNodes, String(config.count));
  setTextAll(currentSeasonNodes, `当前季节：${config.label}`);
  setTextAll(outfitNoteNodes, config.outfitNote);
  setTextAll(seasonalStatusNodes, config.status);
  setTextAll(seasonKeepCountNodes, config.keepCount);
  setTextAll(seasonStoreCountNodes, config.storeCount);
  setTextAll(seasonFocusNodes, config.focus);
  seasonKeepLists.forEach((list) => renderList(list, config.keep));
  seasonStoreLists.forEach((list) => renderList(list, config.store));
  syncSeasonButtons(key);
  renderOutfitStudio();
  renderHomeDashboard();
}

function updateStorageProgress() {
  const { completed, total } = getStorageProgress();
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  setText(storageProgressText, `${completed} / ${total}`);

  if (storageProgressBar) {
    storageProgressBar.style.width = `${percent}%`;
  }

  if (currentView === "storage") {
    applySidebar("storage");
  }
}

function getGarmentById(id) {
  return getGarmentCards().find((card) => card.dataset.garmentId === id);
}

function matchesWardrobeFilters(node, keyword) {
  const typeMatch = currentWardrobeFilter === "all" || node.dataset.garmentType === currentWardrobeFilter;
  const stateMatch = currentWardrobeState === "all" || node.dataset.garmentState === currentWardrobeState;
  const searchableText = [
    node.dataset.garmentName,
    node.dataset.garmentCategory,
    node.dataset.garmentLocation,
    node.dataset.garmentStatus,
    node.dataset.garmentSeasons,
    node.dataset.garmentColor,
    node.dataset.garmentBrand,
    node.dataset.garmentPrice
  ].join(" ").toLowerCase();
  const keywordMatch = keyword === "" || searchableText.includes(keyword);

  return typeMatch && stateMatch && keywordMatch;
}

function filterWardrobeCards() {
  const keyword = wardrobeSearchInput ? wardrobeSearchInput.value.trim().toLowerCase() : "";
  let firstVisibleCard = null;

  getGarmentCards().forEach((card) => {
    const isVisible = matchesWardrobeFilters(card, keyword);

    card.hidden = !isVisible;

    if (isVisible && !firstVisibleCard) {
      firstVisibleCard = card;
    }
  });

  getWardrobeListRows().forEach((row) => {
    row.hidden = !matchesWardrobeFilters(row, keyword);
  });

  const activeVisibleCard = document.querySelector(".garment-card.active-card:not([hidden])");
  if (!activeVisibleCard && firstVisibleCard) {
    selectGarment(firstVisibleCard.dataset.garmentId);
  }
}

function openAddGarmentModal(trigger = null) {
  if (!addGarmentModal) {
    return;
  }

  if (trigger instanceof HTMLElement) {
    lastAddGarmentTrigger = trigger;
  }

  addGarmentModal.hidden = false;
  addGarmentModal.classList.add("is-open");
  addGarmentModal.setAttribute("aria-hidden", "false");
  syncBodyModalState();
  addGarmentCloseButton?.focus();
}

function syncEmbeddedIntakeState() {
  const toggleButtons = document.querySelectorAll("[data-toggle-ai-intake]");

  toggleButtons.forEach((button) => {
    button.textContent = isEmbeddedIntakeOpen ? "收起 AI 处理台" : "打开 AI 处理台";
  });

  if (embeddedIntakePanel) {
    embeddedIntakePanel.hidden = !isEmbeddedIntakeOpen;
  }
}

function openEmbeddedIntake() {
  isEmbeddedIntakeOpen = true;
  syncEmbeddedIntakeState();

  if (embeddedIntakeFrame instanceof HTMLIFrameElement && embeddedIntakeFrame.src) {
    embeddedIntakeFrame.focus();
  }
}

function closeEmbeddedIntake() {
  isEmbeddedIntakeOpen = false;
  syncEmbeddedIntakeState();
}

function toggleEmbeddedIntake() {
  if (isEmbeddedIntakeOpen) {
    closeEmbeddedIntake();
    return;
  }

  openEmbeddedIntake();
}

function closeAddGarmentModal() {
  if (!addGarmentModal) {
    return;
  }

  const restoreFocusTarget = lastAddGarmentTrigger;

  addGarmentModal.classList.remove("is-open");
  addGarmentModal.hidden = true;
  addGarmentModal.setAttribute("aria-hidden", "true");
  syncBodyModalState();
  closeEmbeddedIntake();
  lastAddGarmentTrigger = null;

  if (restoreFocusTarget instanceof HTMLElement) {
    restoreFocusTarget.focus();
  }
}

function selectGarment(id) {
  const card = getGarmentById(id);

  if (!card) {
    return;
  }

  getGarmentCards().forEach((item) => item.classList.remove("active-card"));
  card.classList.add("active-card");
  getWardrobeListRows().forEach((row) => {
    row.classList.toggle("active-list-row", row.dataset.garmentId === id);
  });

  setText(detailName, card.dataset.garmentName);
  setText(detailLocation, card.dataset.garmentLocation);
  setText(detailSeasons, card.dataset.garmentSeasons);
  setText(detailFrequency, card.dataset.garmentFrequency);
  setText(detailLastWorn, card.dataset.garmentLastWorn);
  setText(detailStatus, card.dataset.garmentStatus);
  setText(detailCategory, card.dataset.garmentCategory);
  setText(detailNote, card.dataset.garmentNote);
}

function openWardrobeAndSelectGarment(id) {
  if (!id) {
    return;
  }

  selectGarment(id);

  if (window.location.hash === "#wardrobe") {
    applyView("wardrobe");
    return;
  }

  window.location.hash = "wardrobe";
}

function openOutfitHistoryEntryFromHome(entryId) {
  if (!entryId) {
    return;
  }

  loadOutfitHistoryEntry(entryId);

  if (window.location.hash === "#outfit") {
    applyView("outfit");
    return;
  }

  window.location.hash = "outfit";
}

function buildSearchEntries() {
  const garmentEntries = getGarmentCards().map((card) => ({
    type: "garment",
    id: card.dataset.garmentId,
    view: "wardrobe",
    title: card.dataset.garmentName,
    subtitle: `${card.dataset.garmentCategory} · ${card.dataset.garmentLocation}`,
    keywords: [
      card.dataset.garmentName,
      card.dataset.garmentCategory,
      card.dataset.garmentLocation,
      card.dataset.garmentStatus,
      card.dataset.garmentSeasons,
      card.dataset.garmentColor,
      card.dataset.garmentBrand,
      card.dataset.garmentPrice
    ].join(" ").toLowerCase()
  }));

  const viewEntries = Object.entries(viewConfig).map(([key, config]) => ({
    type: "view",
    id: key,
    view: key,
    title: config.viewName,
    subtitle: config.focus,
    keywords: `${config.viewName} ${config.focus} ${config.intro}`.toLowerCase()
  }));

  return [...viewEntries, ...garmentEntries];
}

function refreshSearchEntries() {
  searchEntries = buildSearchEntries();
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || `garment-${Date.now()}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function createEmptyOutfitSelection() {
  return OUTFIT_SLOT_CONFIG.reduce((selection, slot) => {
    selection[slot.key] = "";
    return selection;
  }, {});
}

function clampOutfitMetric(value, min, max) {
  const numeric = Number.parseFloat(String(value || "").trim());

  if (!Number.isFinite(numeric)) {
    return null;
  }

  return Math.min(max, Math.max(min, Math.round(numeric)));
}

function getOutfitModelProfileStorageKeyForUser(userId = "") {
  return userId ? `${OUTFIT_MODEL_PROFILE_KEY}:${userId}` : OUTFIT_MODEL_PROFILE_KEY;
}

function getCurrentOutfitModelProfileStorageKey() {
  return getOutfitModelProfileStorageKeyForUser(currentUser?.id || "");
}

function hasOutfitModelProfileStorageKey(storageKey) {
  try {
    return window.localStorage.getItem(storageKey) !== null;
  } catch {
    return false;
  }
}

function loadOutfitModelProfileFromStorageKey(storageKey) {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) || "null");
    return parsed && typeof parsed === "object"
      ? normalizeOutfitModelProfile(parsed)
      : createDefaultOutfitModelProfile();
  } catch {
    return createDefaultOutfitModelProfile();
  }
}

function saveOutfitModelProfileToStorageKey(storageKey, profile) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(normalizeOutfitModelProfile(profile)));
  } catch {
    // Ignore local storage write failures.
  }
}

function getOutfitModelProfileFromAuthUser(user = currentUser) {
  const savedProfile = user?.user_metadata?.[OUTFIT_MODEL_PROFILE_METADATA_KEY];
  return savedProfile && typeof savedProfile === "object" ? normalizeOutfitModelProfile(savedProfile) : null;
}

function createDefaultOutfitModelProfile() {
  return {
    gender: "male",
    heightCm: 178,
    weightKg: 75,
    ethnicity: "asian"
  };
}

function normalizeOutfitModelProfile(profile) {
  const nextProfile = createDefaultOutfitModelProfile();
  const safeProfile = profile && typeof profile === "object" ? profile : {};
  const gender = String(safeProfile.gender || "").trim().toLowerCase();
  const ethnicity = String(safeProfile.ethnicity || "").trim().toLowerCase();
  const heightCm = clampOutfitMetric(safeProfile.heightCm, 120, 220);
  const weightKg = clampOutfitMetric(safeProfile.weightKg, 30, 180);

  nextProfile.gender = ["female", "male"].includes(gender) ? gender : "male";
  nextProfile.ethnicity = ["asian", "white", "black"].includes(ethnicity) ? ethnicity : "asian";
  nextProfile.heightCm = heightCm === null ? nextProfile.heightCm : heightCm;
  nextProfile.weightKg = weightKg === null ? nextProfile.weightKg : weightKg;

  return nextProfile;
}

function readOutfitModelProfile() {
  return normalizeOutfitModelProfile({
    gender: outfitModelGenderInput?.value || "",
    heightCm: outfitModelHeightInput?.value || "",
    weightKg: outfitModelWeightInput?.value || "",
    ethnicity: outfitModelEthnicityInput?.value || "asian"
  });
}

function applyOutfitModelProfile(profile = createDefaultOutfitModelProfile()) {
  const normalized = normalizeOutfitModelProfile(profile);

  if (outfitModelGenderInput) {
    outfitModelGenderInput.value = normalized.gender;
  }

  if (outfitModelHeightInput) {
    outfitModelHeightInput.value = normalized.heightCm ? String(normalized.heightCm) : "";
  }

  if (outfitModelWeightInput) {
    outfitModelWeightInput.value = normalized.weightKg ? String(normalized.weightKg) : "";
  }

  if (outfitModelEthnicityInput) {
    outfitModelEthnicityInput.value = normalized.ethnicity;
  }

  return normalized;
}

function setOutfitModelFeedback(message = "", tone = "info") {
  if (!outfitModelFeedback) {
    return;
  }

  outfitModelFeedback.hidden = !message;
  outfitModelFeedback.textContent = message || "";
  outfitModelFeedback.dataset.tone = tone;
}

function setOutfitModelSaveBusy(isBusy) {
  isOutfitModelProfileSaving = isBusy;

  if (outfitModelSaveButton) {
    outfitModelSaveButton.disabled = isBusy;
  }
}

function setDefaultOutfitModelProfile(profile, options = {}) {
  const { persistCloud = true, syncPreview = false } = options;
  const normalized = normalizeOutfitModelProfile(profile);

  outfitDefaultModelProfile = normalized;
  saveOutfitModelProfileToStorageKey(getCurrentOutfitModelProfileStorageKey(), normalized);
  applyOutfitModelProfile(normalized);
  outfitAppliedModelProfile = normalized;

  if (syncPreview) {
    syncOutfitPreview(groupGarmentsByOutfitSlot());
  }

  if (persistCloud) {
    syncOutfitModelProfileToCloudInBackground(normalized);
  }

  return normalized;
}

async function persistOutfitModelProfileToCloud(profile, userId = currentUser?.id || "") {
  const client = await ensureSupabaseClient();
  const normalized = normalizeOutfitModelProfile(profile);

  if (!client || !userId) {
    return normalized;
  }

  const currentCloudProfile = getOutfitModelProfileFromAuthUser(currentUser);

  if (currentCloudProfile && getOutfitModelProfileSignature(currentCloudProfile) === getOutfitModelProfileSignature(normalized)) {
    return normalized;
  }

  const existingMetadata = currentUser?.user_metadata && typeof currentUser.user_metadata === "object"
    ? currentUser.user_metadata
    : {};
  const { data, error } = await client.auth.updateUser({
    data: {
      ...existingMetadata,
      [OUTFIT_MODEL_PROFILE_METADATA_KEY]: normalized
    }
  });

  if (error) {
    throw error;
  }

  if (data?.user) {
    syncCurrentUserMetadata(data.user);
  }

  return normalized;
}

function syncOutfitModelProfileToCloudInBackground(profile, userId = currentUser?.id || "") {
  if (!canSyncWardrobeToCloud() || !userId) {
    return;
  }

  persistOutfitModelProfileToCloud(profile, userId).catch((error) => {
    console.error(error);
  });
}

async function hydrateOutfitModelProfileFromCloud() {
  if (!canSyncWardrobeToCloud()) {
    return;
  }

  const userId = currentUser.id;
  const anonymousStorageKey = getOutfitModelProfileStorageKeyForUser("");
  const userStorageKey = getOutfitModelProfileStorageKeyForUser(userId);
  const cloudProfile = getOutfitModelProfileFromAuthUser(currentUser);

  if (cloudProfile) {
    outfitDefaultModelProfile = normalizeOutfitModelProfile(cloudProfile);
    saveOutfitModelProfileToStorageKey(userStorageKey, outfitDefaultModelProfile);
    applyOutfitModelProfile(outfitDefaultModelProfile);
    outfitAppliedModelProfile = outfitDefaultModelProfile;
    syncOutfitPreview(groupGarmentsByOutfitSlot());
    return;
  }

  const hasCachedUserProfile = hasOutfitModelProfileStorageKey(userStorageKey);
  const hasAnonymousProfile = hasOutfitModelProfileStorageKey(anonymousStorageKey);
  const fallbackProfile = hasCachedUserProfile
    ? loadOutfitModelProfileFromStorageKey(userStorageKey)
    : hasAnonymousProfile
      ? loadOutfitModelProfileFromStorageKey(anonymousStorageKey)
      : createDefaultOutfitModelProfile();

  outfitDefaultModelProfile = normalizeOutfitModelProfile(fallbackProfile);
  saveOutfitModelProfileToStorageKey(userStorageKey, outfitDefaultModelProfile);
  applyOutfitModelProfile(outfitDefaultModelProfile);
  outfitAppliedModelProfile = outfitDefaultModelProfile;
  syncOutfitPreview(groupGarmentsByOutfitSlot());

  try {
    await persistOutfitModelProfileToCloud(outfitDefaultModelProfile, userId);
  } catch (error) {
    console.error(error);
  }
}

function getOutfitModelProfileSignature(profile = createDefaultOutfitModelProfile()) {
  const normalized = normalizeOutfitModelProfile(profile);
  return JSON.stringify(normalized);
}

function getOutfitHistoryStorageKeyForUser(userId = "") {
  return userId ? `${OUTFIT_HISTORY_KEY}:${userId}` : OUTFIT_HISTORY_KEY;
}

function getOutfitHistoryManifestPath(userId = "") {
  return userId ? `${userId}/outfit-preview/history/${OUTFIT_HISTORY_MANIFEST_FILENAME}` : "";
}

function loadOutfitHistoryFromStorageKey(storageKey) {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
    return Array.isArray(parsed) ? parsed.map(normalizeOutfitHistoryEntry).filter((entry) => entry.imageUrl) : [];
  } catch {
    return [];
  }
}

function saveOutfitHistoryToStorageKey(storageKey, items) {
  try {
    const normalizedItems = items
      .map(normalizeOutfitHistoryEntry)
      .filter((entry) => entry.imageUrl);
    window.localStorage.setItem(storageKey, JSON.stringify(normalizedItems));
  } catch {
    // Ignore local storage write failures.
  }
}

function isStorageObjectMissingError(error) {
  const sourceText = `${error?.message || ""} ${error?.statusCode || ""} ${error?.error || ""}`.toLowerCase();
  return sourceText.includes("not found") || sourceText.includes("404") || sourceText.includes("object not found");
}

function getOutfitHistoryGenderLabel(gender) {
  if (gender === "male") {
    return "男";
  }

  if (gender === "female") {
    return "女";
  }

  return "默认模特";
}

function getOutfitHistoryEthnicityLabel(ethnicity) {
  if (ethnicity === "white") {
    return "白人";
  }

  if (ethnicity === "black") {
    return "黑人";
  }

  return "亚洲人";
}

function normalizeOutfitHistoryEntry(entry) {
  const safeEntry = entry && typeof entry === "object" ? entry : {};
  const garments = Array.isArray(safeEntry.garments)
    ? safeEntry.garments
      .map((item) => ({
        id: String(item?.id || "").trim(),
        name: String(item?.name || "").trim() || "未命名单品",
        type: String(item?.type || "").trim() || "top",
        categoryText: String(item?.categoryText || "").trim(),
        color: String(item?.color || "").trim()
      }))
      .filter((item) => item.name)
    : [];
  const modelProfile = normalizeOutfitModelProfile(safeEntry.modelProfile);
  const createdAt = String(safeEntry.createdAt || "").trim();

  return {
    id: String(safeEntry.id || `outfit-history-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`).trim(),
    createdAt: createdAt || new Date().toISOString(),
    imageUrl: String(safeEntry.imageUrl || "").trim(),
    imagePath: String(safeEntry.imagePath || "").trim(),
    garments,
    modelProfile,
    signature: String(safeEntry.signature || "").trim() || buildOutfitHistorySignature(garments, modelProfile)
  };
}

function sortOutfitHistoryEntries(items = []) {
  return items
    .map(normalizeOutfitHistoryEntry)
    .filter((entry) => entry.imageUrl)
    .sort((left, right) => Date.parse(right.createdAt || "") - Date.parse(left.createdAt || ""));
}

function setOutfitHistoryItems(items = []) {
  outfitHistoryItems = sortOutfitHistoryEntries(items);
  renderOutfitHistoryPanel();
  syncOutfitHistoryButton();
  renderHomeDashboard();
}

function buildOutfitHistorySignature(garments = [], modelProfile = createDefaultOutfitModelProfile()) {
  const normalizedGarments = garments
    .map((item) => ({
      id: String(item?.id || "").trim(),
      type: String(item?.type || "").trim(),
      name: String(item?.name || "").trim()
    }))
    .sort((left, right) => `${left.type}:${left.id}:${left.name}`.localeCompare(`${right.type}:${right.id}:${right.name}`, "zh-Hans-CN"));

  return JSON.stringify({
    garments: normalizedGarments,
    modelProfile: normalizeOutfitModelProfile(modelProfile)
  });
}

function createOutfitHistoryEntry({ imageUrl, imagePath, garments, modelProfile }) {
  const normalizedGarments = (garments || []).map((item) => ({
    id: String(item?.id || "").trim(),
    name: String(item?.name || "").trim() || "未命名单品",
    type: String(item?.type || "").trim() || "top",
    categoryText: String(item?.categoryText || "").trim(),
    color: String(item?.color || "").trim()
  }));
  const normalizedModelProfile = normalizeOutfitModelProfile(modelProfile);

  return normalizeOutfitHistoryEntry({
    id: `outfit-history-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    imageUrl: String(imageUrl || "").trim(),
    imagePath: String(imagePath || "").trim(),
    garments: normalizedGarments,
    modelProfile: normalizedModelProfile,
    signature: buildOutfitHistorySignature(normalizedGarments, normalizedModelProfile)
  });
}

function formatOutfitHistoryTime(value) {
  const timestamp = Date.parse(String(value || ""));

  if (!Number.isFinite(timestamp)) {
    return "刚刚生成";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(timestamp));
}

function buildOutfitHistoryCardMarkup(entry) {
  const garmentRows = entry.garments.length
    ? entry.garments
      .map((item) => `
        <div class="outfit-history-row">
          <strong>${escapeHtml(getTypeLabel(item.type))}</strong>
          <span>${escapeHtml(item.name)}</span>
        </div>
      `)
      .join("")
    : `<div class="outfit-history-row"><strong>单品</strong><span>无记录</span></div>`;
  const profileChips = [
    getOutfitHistoryEthnicityLabel(entry.modelProfile.ethnicity),
    getOutfitHistoryGenderLabel(entry.modelProfile.gender),
    entry.modelProfile.heightCm ? `${entry.modelProfile.heightCm} cm` : "",
    entry.modelProfile.weightKg ? `${entry.modelProfile.weightKg} kg` : ""
  ]
    .filter(Boolean)
    .map((label) => `<span class="outfit-history-chip">${escapeHtml(label)}</span>`)
    .join("");

  return `
    <article class="outfit-history-card">
      <div class="outfit-history-image-shell">
        <img class="outfit-history-image" src="${escapeHtml(entry.imageUrl)}" alt="历史穿搭效果图" width="720" height="960" loading="lazy" decoding="async">
      </div>
      <div class="outfit-history-copy">
        <div class="outfit-history-meta">
          <strong>${escapeHtml(formatOutfitHistoryTime(entry.createdAt))}</strong>
          <span>${escapeHtml(entry.garments.length ? `${entry.garments.length} 件单品` : "历史记录")}</span>
        </div>
        <div class="outfit-history-rows">${garmentRows}</div>
        <div class="outfit-history-chip-row">${profileChips}</div>
        <button class="ghost-button inline-button outfit-history-action" type="button" data-load-outfit-history="${escapeHtml(entry.id)}">载入到右侧</button>
      </div>
    </article>
  `;
}

function syncOutfitHistoryButton() {
  if (!outfitHistoryButton) {
    return;
  }

  outfitHistoryButton.disabled = !hasSupabaseConfig();
  outfitHistoryButton.textContent = outfitHistoryItems.length ? `历史穿搭 ${outfitHistoryItems.length}` : "历史穿搭";
}

function renderOutfitHistoryPanel() {
  if (!outfitHistoryTrack) {
    return;
  }

  if (!currentUser) {
    outfitHistoryTrack.innerHTML = `
      <article class="outfit-history-empty">
        <strong>登录后可查看你的历史穿搭</strong>
        <span>历史试穿图会按账号保存到云端，换电脑也能继续查看。</span>
      </article>
    `;
    return;
  }

  if (isOutfitHistoryLoading && !outfitHistoryItems.length) {
    outfitHistoryTrack.innerHTML = `
      <article class="outfit-history-empty">
        <strong>正在读取云端历史穿搭</strong>
        <span>请稍候，系统正在拉取你之前生成过的 AI 试穿图。</span>
      </article>
    `;
    return;
  }

  if (!outfitHistoryItems.length) {
    outfitHistoryTrack.innerHTML = `
      <article class="outfit-history-empty">
        <strong>还没有历史穿搭</strong>
        <span>生成过一次 AI 试穿图后，这里就会自动保存到云端。</span>
      </article>
    `;
    return;
  }

  outfitHistoryTrack.innerHTML = outfitHistoryItems.map((entry) => buildOutfitHistoryCardMarkup(entry)).join("");
}

function resetOutfitHistoryDragState() {
  outfitHistoryDragPointerId = null;
  outfitHistoryDragStartX = 0;
  outfitHistoryDragStartScrollLeft = 0;
  outfitHistoryDragMoved = false;
  outfitHistoryTrack?.classList.remove("is-dragging");
}

function beginOutfitHistoryDrag(event) {
  if (!outfitHistoryTrack || event.button !== 0) {
    return;
  }

  if (event.target instanceof Element && event.target.closest("button, a, input, select, textarea, label")) {
    return;
  }

  outfitHistoryDragPointerId = event.pointerId;
  outfitHistoryDragStartX = event.clientX;
  outfitHistoryDragStartScrollLeft = outfitHistoryTrack.scrollLeft;
  outfitHistoryDragMoved = false;
  suppressOutfitHistoryClick = false;
  outfitHistoryTrack.classList.add("is-dragging");
  outfitHistoryTrack.setPointerCapture?.(event.pointerId);
}

function updateOutfitHistoryDrag(event) {
  if (!outfitHistoryTrack || outfitHistoryDragPointerId !== event.pointerId) {
    return;
  }

  const deltaX = event.clientX - outfitHistoryDragStartX;

  if (Math.abs(deltaX) >= OUTFIT_HISTORY_DRAG_THRESHOLD) {
    outfitHistoryDragMoved = true;
  }

  if (!outfitHistoryDragMoved) {
    return;
  }

  event.preventDefault();
  outfitHistoryTrack.scrollLeft = outfitHistoryDragStartScrollLeft - deltaX;
}

function endOutfitHistoryDrag(event) {
  if (!outfitHistoryTrack || outfitHistoryDragPointerId !== event.pointerId) {
    return;
  }

  suppressOutfitHistoryClick = outfitHistoryDragMoved;

  if (outfitHistoryTrack.hasPointerCapture?.(event.pointerId)) {
    outfitHistoryTrack.releasePointerCapture(event.pointerId);
  }

  resetOutfitHistoryDragState();
}

function openOutfitHistoryModal(trigger = null) {
  if (!outfitHistoryModal) {
    return;
  }

  if (trigger instanceof HTMLElement) {
    lastOutfitHistoryTrigger = trigger;
  }

  outfitHistoryModal.hidden = false;
  outfitHistoryModal.classList.add("is-open");
  outfitHistoryModal.setAttribute("aria-hidden", "false");
  syncBodyModalState();
  renderOutfitHistoryPanel();
}

function closeOutfitHistoryModal() {
  if (!outfitHistoryModal) {
    return;
  }

  outfitHistoryModal.hidden = true;
  outfitHistoryModal.classList.remove("is-open");
  outfitHistoryModal.setAttribute("aria-hidden", "true");
  syncBodyModalState();

  if (lastOutfitHistoryTrigger instanceof HTMLElement) {
    lastOutfitHistoryTrigger.focus();
  }
}

function mountOutfitModelPanel() {
  if (!outfitModelModal || !outfitModelPanel) {
    return;
  }

  if (outfitModelPanel.parentElement !== outfitModelModal) {
    outfitModelModal.appendChild(outfitModelPanel);
  }
}

function openOutfitModelModal(trigger = null) {
  if (!outfitModelModal || !outfitModelPanel) {
    return;
  }

  if (trigger instanceof HTMLElement) {
    lastOutfitModelTrigger = trigger;
  }

  mountOutfitModelPanel();
  outfitModelModalSnapshot = readOutfitModelProfile();
  setOutfitModelFeedback("");
  outfitModelModal.hidden = false;
  outfitModelModal.classList.add("is-open");
  outfitModelModal.setAttribute("aria-hidden", "false");
  syncBodyModalState();
  outfitModelGenderInput?.focus();
}

function closeOutfitModelModal(options = {}) {
  if (!outfitModelModal) {
    return;
  }

  const { restore = true } = options;

  if (restore) {
    applyOutfitModelProfile(outfitModelModalSnapshot);
    syncOutfitPreview(groupGarmentsByOutfitSlot());
  }

  setOutfitModelFeedback("");
  setOutfitModelSaveBusy(false);
  outfitModelModal.hidden = true;
  outfitModelModal.classList.remove("is-open");
  outfitModelModal.setAttribute("aria-hidden", "true");
  syncBodyModalState();

  if (lastOutfitModelTrigger instanceof HTMLElement) {
    lastOutfitModelTrigger.focus();
  }
}

async function saveOutfitModelProfileDefaults() {
  const profile = applyOutfitModelProfile(readOutfitModelProfile());

  setOutfitModelSaveBusy(true);
  setOutfitModelFeedback("");
  outfitModelModalSnapshot = profile;
  setDefaultOutfitModelProfile(profile, { persistCloud: false, syncPreview: true });

  if (!currentUser) {
    setOutfitModelSaveBusy(false);
    setOutfitModelFeedback("默认参数已保存在当前浏览器，登录后会自动同步到账号。", "success");
    return;
  }

  try {
    await persistOutfitModelProfileToCloud(profile, currentUser.id);
    setOutfitModelSaveBusy(false);
    setOutfitModelFeedback("默认参数已保存，并同步到当前账号。", "success");
  } catch (error) {
    console.error(error);
    setOutfitModelSaveBusy(false);
    setOutfitModelFeedback("默认参数已保存在本地，但账号同步失败，请稍后再试。", "error");
  }
}

async function fetchOutfitHistoryFromCloud() {
  const client = await ensureSupabaseClient();

  if (!client || !currentUser?.id) {
    return [];
  }

  const { data, error } = await client.storage
    .from(SUPABASE_BUCKET)
    .download(getOutfitHistoryManifestPath(currentUser.id));

  if (error) {
    if (isStorageObjectMissingError(error)) {
      return [];
    }

    throw error;
  }

  const text = await data.text();
  const parsed = JSON.parse(text || "[]");
  return Array.isArray(parsed) ? parsed.map(normalizeOutfitHistoryEntry).filter((entry) => entry.imageUrl) : [];
}

async function persistOutfitHistoryToCloud(items, userId = currentUser?.id || "") {
  const client = await ensureSupabaseClient();

  if (!client || !userId) {
    return;
  }

  const payload = JSON.stringify(sortOutfitHistoryEntries(items), null, 2);
  const blob = new Blob([payload], {
    type: "application/json"
  });
  const { error } = await client.storage
    .from(SUPABASE_BUCKET)
    .upload(getOutfitHistoryManifestPath(userId), blob, {
      upsert: true,
      contentType: "application/json; charset=utf-8"
    });

  if (error) {
    throw error;
  }
}

async function hydrateOutfitHistoryFromCloud() {
  if (!currentUser?.id) {
    setOutfitHistoryItems([]);
    return;
  }

  const userId = currentUser.id;
  const storageKey = getOutfitHistoryStorageKeyForUser(userId);
  const cachedItems = loadOutfitHistoryFromStorageKey(storageKey);

  if (cachedItems.length) {
    setOutfitHistoryItems(cachedItems);
  } else {
    renderOutfitHistoryPanel();
  }

  isOutfitHistoryLoading = true;
  renderOutfitHistoryPanel();

  try {
    const cloudItems = await fetchOutfitHistoryFromCloud();
    setOutfitHistoryItems(cloudItems);
    saveOutfitHistoryToStorageKey(storageKey, cloudItems);
  } catch (error) {
    console.error(error);
    renderOutfitHistoryPanel();
  } finally {
    isOutfitHistoryLoading = false;
    renderOutfitHistoryPanel();
  }
}

function appendOutfitHistoryInBackground(entry, userId = currentUser?.id || "") {
  if (!userId || !entry?.imageUrl) {
    return;
  }

  const normalizedEntry = normalizeOutfitHistoryEntry(entry);
  const nextItems = [
    normalizedEntry,
    ...outfitHistoryItems.filter((item) => item.signature !== normalizedEntry.signature && item.id !== normalizedEntry.id)
  ];
  const storageKey = getOutfitHistoryStorageKeyForUser(userId);

  setOutfitHistoryItems(nextItems);
  saveOutfitHistoryToStorageKey(storageKey, nextItems);

  persistOutfitHistoryToCloud(nextItems, userId).catch((error) => {
    console.error(error);
  });
}

function loadOutfitHistoryEntry(entryId) {
  const targetEntry = outfitHistoryItems.find((item) => item.id === entryId);

  if (!targetEntry) {
    return;
  }

  const nextSelection = createEmptyOutfitSelection();

  targetEntry.garments.forEach((item) => {
    if (Object.prototype.hasOwnProperty.call(nextSelection, item.type)) {
      nextSelection[item.type] = item.id;
    }
  });

  outfitDraftSelection = nextSelection;
  outfitAppliedSelection = { ...nextSelection };
  outfitAppliedModelProfile = normalizeOutfitModelProfile(targetEntry.modelProfile);
  applyOutfitModelProfile(outfitAppliedModelProfile);
  isOutfitGenerating = false;
  setOutfitGeneratedPreview(targetEntry.imageUrl);
  renderOutfitStudio();
  closeOutfitHistoryModal();
}

function drawRoundedRect(context, x, y, width, height, radius) {
  if (typeof context.roundRect === "function") {
    context.beginPath();
    context.roundRect(x, y, width, height, radius);
    return;
  }

  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.arcTo(x + width, y, x + width, y + height, safeRadius);
  context.arcTo(x + width, y + height, x, y + height, safeRadius);
  context.arcTo(x, y + height, x, y, safeRadius);
  context.arcTo(x, y, x + width, y, safeRadius);
  context.closePath();
}

function getFigureClass(type) {
  if (type === "bottom") {
    return "pants-figure";
  }

  if (type === "outer") {
    return "jacket-figure";
  }

  if (type === "accessory") {
    return "shoe-figure";
  }

  return "knit-figure";
}

function getOutfitItemPreviewSource(item) {
  return item?.imageUrl || item?.imageDataUrl || "";
}

function hasOutfitAiConfig() {
  return hasSupabaseConfig() && Boolean(AI_OUTFIT_FUNCTION_NAME);
}

function setOutfitGeneratedPreview(url) {
  outfitGeneratedPreviewUrl = String(url || "").trim();

  if (outfitPreviewRender) {
    if (outfitGeneratedPreviewUrl) {
      outfitPreviewRender.hidden = false;

      if (outfitPreviewRender.src !== outfitGeneratedPreviewUrl) {
        outfitPreviewRender.src = outfitGeneratedPreviewUrl;
      }
    } else {
      outfitPreviewRender.hidden = true;
      outfitPreviewRender.removeAttribute("src");
    }
  }

  outfitPreviewPanel?.classList.toggle("has-ai-render", Boolean(outfitGeneratedPreviewUrl));
}

function getOutfitItemMetaText(item) {
  if (!item) {
    return "";
  }

  const fragments = [item.color, item.seasons, item.location]
    .map((value) => String(value || "").trim())
    .filter(Boolean);

  return fragments.slice(0, 2).join(" / ") || item.categoryText || "已在衣柜中";
}

function getOutfitSeasonScore(item) {
  const keywords = OUTFIT_SEASON_KEYWORDS[currentSeason] || [];
  const sourceText = `${item?.seasons || ""} ${item?.categoryText || ""}`.toLowerCase();

  if (!sourceText.trim()) {
    return 0;
  }

  if (keywords.some((keyword) => keyword !== "四季" && sourceText.includes(keyword.toLowerCase()))) {
    return 2;
  }

  if (keywords.some((keyword) => sourceText.includes(keyword.toLowerCase()))) {
    return 1;
  }

  return 0;
}

function sortOutfitItemsForCurrentSeason(items) {
  return items
    .slice()
    .sort((left, right) => {
      const scoreDiff = getOutfitSeasonScore(right) - getOutfitSeasonScore(left);

      if (scoreDiff !== 0) {
        return scoreDiff;
      }

      return String(left.name || "").localeCompare(String(right.name || ""), "zh-Hans-CN");
    });
}

function groupGarmentsByOutfitSlot() {
  const grouped = createEmptyOutfitSelection();
  const items = loadCustomGarments().map(normalizeCustomGarment);

  OUTFIT_SLOT_CONFIG.forEach((slot) => {
    grouped[slot.key] = sortOutfitItemsForCurrentSeason(items.filter((item) => item.type === slot.key));
  });

  return grouped;
}

function sanitizeOutfitSelection(selection, groupedItems) {
  const nextSelection = createEmptyOutfitSelection();
  const safeSelection = selection && typeof selection === "object" ? selection : {};

  OUTFIT_SLOT_CONFIG.forEach((slot) => {
    const currentValue = String(safeSelection[slot.key] || "");
    const availableIds = new Set((groupedItems[slot.key] || []).map((item) => item.id));
    nextSelection[slot.key] = availableIds.has(currentValue) ? currentValue : "";
  });

  return nextSelection;
}

function getOutfitItemById(groupedItems, slotKey, itemId) {
  return (groupedItems[slotKey] || []).find((item) => item.id === itemId) || null;
}

function getSelectedOutfitItems(selection, groupedItems) {
  return OUTFIT_SLOT_CONFIG
    .map((slot) => ({
      slot,
      item: getOutfitItemById(groupedItems, slot.key, selection[slot.key] || "")
    }))
    .filter((entry) => entry.item);
}

function getSelectedOutfitGarments(selection = outfitDraftSelection, groupedItems = groupGarmentsByOutfitSlot()) {
  return getSelectedOutfitItems(selection, groupedItems).map((entry) => entry.item);
}

function loadImageElement(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    if (/^https?:\/\//i.test(url)) {
      image.crossOrigin = "anonymous";
    }

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load outfit reference image: ${url}`));
    image.src = url;
  });
}

async function buildOutfitReferenceBoardDataUrl(items) {
  const resolvedItems = items.filter((item) => getOutfitItemPreviewSource(item));

  if (!resolvedItems.length) {
    throw new Error("请先选择至少一件带图片的衣服。");
  }

  const loadedImages = await Promise.all(
    resolvedItems.map(async (item) => ({
      item,
      image: await loadImageElement(getOutfitItemPreviewSource(item))
    }))
  );

  const canvas = document.createElement("canvas");
  const rows = Math.max(1, Math.ceil(loadedImages.length / OUTFIT_REFERENCE_GRID_COLUMNS));
  canvas.width = OUTFIT_REFERENCE_CANVAS_SIZE;
  canvas.height = Math.max(OUTFIT_REFERENCE_CANVAS_SIZE, Math.round(OUTFIT_REFERENCE_CANVAS_SIZE * (0.7 + rows * 0.42)));

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("当前浏览器无法生成穿搭参考图。");
  }

  context.fillStyle = "#f8f4ee";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const cardWidth = (
    canvas.width
    - OUTFIT_REFERENCE_MARGIN * 2
    - OUTFIT_REFERENCE_CELL_GAP * (OUTFIT_REFERENCE_GRID_COLUMNS - 1)
  ) / OUTFIT_REFERENCE_GRID_COLUMNS;
  const cardHeight = Math.min(520, (canvas.height - OUTFIT_REFERENCE_MARGIN * 2 - OUTFIT_REFERENCE_CELL_GAP * Math.max(0, rows - 1)) / rows);

  context.textAlign = "center";
  context.textBaseline = "top";

  loadedImages.forEach(({ item, image }, index) => {
    const column = index % OUTFIT_REFERENCE_GRID_COLUMNS;
    const row = Math.floor(index / OUTFIT_REFERENCE_GRID_COLUMNS);
    const cardX = OUTFIT_REFERENCE_MARGIN + column * (cardWidth + OUTFIT_REFERENCE_CELL_GAP);
    const cardY = OUTFIT_REFERENCE_MARGIN + row * (cardHeight + OUTFIT_REFERENCE_CELL_GAP);
    const innerPadding = 24;
    const imageBoxHeight = cardHeight - 88;
    const availableWidth = cardWidth - innerPadding * 2;
    const availableHeight = imageBoxHeight - innerPadding * 2;
    const ratio = Math.min(availableWidth / (image.naturalWidth || image.width || 1), availableHeight / (image.naturalHeight || image.height || 1));
    const drawWidth = Math.max(1, Math.round((image.naturalWidth || image.width || 1) * ratio));
    const drawHeight = Math.max(1, Math.round((image.naturalHeight || image.height || 1) * ratio));
    const drawX = cardX + (cardWidth - drawWidth) / 2;
    const drawY = cardY + 18 + (imageBoxHeight - drawHeight) / 2;

    context.fillStyle = "rgba(255,255,255,0.94)";
    context.strokeStyle = "rgba(115, 87, 61, 0.14)";
    context.lineWidth = 3;
    drawRoundedRect(context, cardX, cardY, cardWidth, cardHeight, 30);
    context.fill();
    context.stroke();

    context.drawImage(image, drawX, drawY, drawWidth, drawHeight);

    context.fillStyle = "#4f4035";
    context.font = "600 30px \"Noto Sans SC\", \"PingFang SC\", sans-serif";
    context.fillText(item.name || "未命名衣物", cardX + cardWidth / 2, cardY + cardHeight - 58, cardWidth - 26);

    context.fillStyle = "rgba(79, 64, 53, 0.72)";
    context.font = "400 22px \"Noto Sans SC\", \"PingFang SC\", sans-serif";
    context.fillText(getTypeLabel(item.type), cardX + cardWidth / 2, cardY + cardHeight - 26, cardWidth - 26);
  });

  return canvas.toDataURL("image/jpeg", 0.92);
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

function buildOutfitOptionVisualMarkup(item, slotKey) {
  if (!item) {
    return `
      <span class="outfit-option-visual">
        <span class="garment-figure ${getFigureClass(slotKey)}"></span>
      </span>
    `;
  }

  const imageSource = getOutfitItemPreviewSource(item);

  if (imageSource) {
    return `
      <span class="outfit-option-visual">
        <img class="outfit-option-photo" src="${escapeHtml(imageSource)}" alt="${escapeHtml(item.name || "衣物预览")}" width="320" height="320" loading="lazy" decoding="async">
      </span>
    `;
  }

  return `
    <span class="outfit-option-visual">
      <span class="garment-figure ${getFigureClass(item.type || slotKey)}"></span>
    </span>
  `;
}

function buildOutfitOptionCardMarkup(slot, item) {
  const itemId = item?.id || OUTFIT_SELECTION_NONE;
  const displayName = item?.name || `暂不穿${slot.label}`;

  return `
    <button
      class="outfit-option-card${item ? "" : " is-empty"}"
      type="button"
      data-outfit-select
      data-outfit-slot="${escapeHtml(slot.key)}"
      data-outfit-item-id="${escapeHtml(itemId)}"
    >
      ${buildOutfitOptionVisualMarkup(item, slot.key)}
      <span class="outfit-option-copy">
        <strong>${escapeHtml(displayName)}</strong>
      </span>
    </button>
  `;
}

function buildOutfitSlotRowMarkup(slot, items) {
  const trackCards = [buildOutfitOptionCardMarkup(slot, null)]
    .concat(items.map((item) => buildOutfitOptionCardMarkup(slot, item)))
    .join("");

  const availabilityText = items.length ? `可选 ${items.length} 件` : "衣柜里还没有这一类";

  return `
    <section class="outfit-slot-row" data-outfit-slot-row="${escapeHtml(slot.key)}">
      <div class="outfit-slot-head">
        <div class="outfit-slot-copy">
          <h4>${escapeHtml(slot.label)}</h4>
        </div>
        <span class="outfit-slot-count">${escapeHtml(availabilityText)}</span>
      </div>

      <div class="outfit-slot-scroll">
        <button
          class="outfit-scroll-button"
          type="button"
          data-outfit-scroll="-1"
          data-outfit-slot="${escapeHtml(slot.key)}"
          aria-label="向左查看${escapeHtml(slot.label)}"
        >‹</button>
        <div class="outfit-slot-track" data-outfit-track="${escapeHtml(slot.key)}">
          ${trackCards}
        </div>
        <button
          class="outfit-scroll-button"
          type="button"
          data-outfit-scroll="1"
          data-outfit-slot="${escapeHtml(slot.key)}"
          aria-label="向右查看${escapeHtml(slot.label)}"
        >›</button>
      </div>
    </section>
  `;
}

function buildCompactOutfitSlotRowMarkup(slot, items) {
  const trackCards = [buildOutfitOptionCardMarkup(slot, null)]
    .concat(items.map((item) => buildOutfitOptionCardMarkup(slot, item)))
    .join("");

  const availabilityText = items.length ? `\u53ef\u9009 ${items.length} \u4ef6` : "\u6682\u65e0\u6b64\u7c7b";

  return `
    <section class="outfit-slot-row" data-outfit-slot-row="${escapeHtml(slot.key)}">
      <div class="outfit-slot-head">
        <div class="outfit-slot-copy">
          <h4>${escapeHtml(slot.label)}</h4>
        </div>
        <span class="outfit-slot-count">${escapeHtml(availabilityText)}</span>
      </div>

      <div class="outfit-slot-scroll">
        <div class="outfit-slot-track" data-outfit-track="${escapeHtml(slot.key)}">
          ${trackCards}
        </div>
        <div class="outfit-slot-scrollbar" data-outfit-scrollbar="${escapeHtml(slot.key)}">
          <div class="outfit-slot-scrollbar-thumb" data-outfit-scrollbar-thumb="${escapeHtml(slot.key)}"></div>
        </div>
      </div>
    </section>
  `;
}

function getOutfitTrackNodes(slotKey) {
  if (!outfitSelectorRows || !slotKey) {
    return { track: null, scrollbar: null, thumb: null };
  }

  return {
    track: outfitSelectorRows.querySelector(`[data-outfit-track="${slotKey}"]`),
    scrollbar: outfitSelectorRows.querySelector(`[data-outfit-scrollbar="${slotKey}"]`),
    thumb: outfitSelectorRows.querySelector(`[data-outfit-scrollbar-thumb="${slotKey}"]`)
  };
}

function syncOutfitTrackScrollbar(slotKey) {
  const { track, scrollbar, thumb } = getOutfitTrackNodes(slotKey);

  if (!track || !scrollbar || !thumb) {
    return;
  }

  const visibleWidth = track.clientWidth;
  const contentWidth = track.scrollWidth;
  const trackWidth = scrollbar.clientWidth;

  if (!visibleWidth || !trackWidth || !contentWidth) {
    thumb.style.width = "100%";
    thumb.style.transform = "translateX(0)";
    return;
  }

  const maxScrollLeft = Math.max(contentWidth - visibleWidth, 0);
  const rawThumbWidth = trackWidth * (visibleWidth / contentWidth);
  const thumbWidth = maxScrollLeft > 0
    ? Math.min(trackWidth, Math.max(rawThumbWidth, OUTFIT_SCROLLBAR_MIN_THUMB_WIDTH))
    : trackWidth;
  const maxThumbOffset = Math.max(trackWidth - thumbWidth, 0);
  const thumbOffset = maxScrollLeft > 0
    ? (track.scrollLeft / maxScrollLeft) * maxThumbOffset
    : 0;

  thumb.style.width = `${thumbWidth}px`;
  thumb.style.transform = `translateX(${thumbOffset}px)`;
}

function syncAllOutfitTrackScrollbars() {
  if (!outfitSelectorRows) {
    return;
  }

  outfitSelectorRows.querySelectorAll("[data-outfit-track]").forEach((track) => {
    syncOutfitTrackScrollbar(track.dataset.outfitTrack || "");
  });
}

function bindOutfitTrackScrollbars() {
  if (!outfitSelectorRows) {
    return;
  }

  outfitSelectorRows.querySelectorAll("[data-outfit-track]").forEach((track) => {
    const slotKey = track.dataset.outfitTrack || "";

    track.addEventListener("scroll", () => {
      syncOutfitTrackScrollbar(slotKey);
    }, { passive: true });
  });

  window.requestAnimationFrame(() => {
    syncAllOutfitTrackScrollbars();
  });
}

function updateOutfitScrollbarDrag(clientX) {
  if (!activeOutfitScrollbarDrag) {
    return;
  }

  const { scrollbar, thumb, track, pointerOffsetX, slotKey } = activeOutfitScrollbarDrag;
  const scrollbarRect = scrollbar.getBoundingClientRect();
  const maxScrollLeft = Math.max(track.scrollWidth - track.clientWidth, 0);
  const thumbWidth = Math.min(thumb.offsetWidth || scrollbarRect.width, scrollbarRect.width);
  const maxThumbOffset = Math.max(scrollbarRect.width - thumbWidth, 0);
  const nextThumbOffset = Math.max(
    0,
    Math.min(maxThumbOffset, clientX - scrollbarRect.left - pointerOffsetX)
  );

  track.scrollLeft = maxThumbOffset > 0
    ? (nextThumbOffset / maxThumbOffset) * maxScrollLeft
    : 0;

  syncOutfitTrackScrollbar(slotKey);
}

function startOutfitScrollbarDrag(event) {
  if (!(event.target instanceof Element) || event.button !== 0) {
    return;
  }

  const scrollbar = event.target.closest("[data-outfit-scrollbar]");

  if (!scrollbar) {
    return;
  }

  const slotKey = scrollbar.dataset.outfitScrollbar || "";
  const { track, thumb } = getOutfitTrackNodes(slotKey);

  if (!track || !thumb) {
    return;
  }

  const thumbTarget = event.target.closest("[data-outfit-scrollbar-thumb]");
  const thumbRect = thumb.getBoundingClientRect();
  const pointerOffsetX = thumbTarget
    ? event.clientX - thumbRect.left
    : thumbRect.width / 2;

  activeOutfitScrollbarDrag = {
    pointerId: event.pointerId,
    scrollbar,
    thumb,
    track,
    slotKey,
    pointerOffsetX
  };

  scrollbar.classList.add("is-dragging");
  scrollbar.setPointerCapture?.(event.pointerId);
  event.preventDefault();
  updateOutfitScrollbarDrag(event.clientX);
}

function moveOutfitScrollbarDrag(event) {
  if (!activeOutfitScrollbarDrag || activeOutfitScrollbarDrag.pointerId !== event.pointerId) {
    return;
  }

  event.preventDefault();
  updateOutfitScrollbarDrag(event.clientX);
}

function endOutfitScrollbarDrag(event) {
  if (!activeOutfitScrollbarDrag) {
    return;
  }

  if (typeof event.pointerId === "number" && activeOutfitScrollbarDrag.pointerId !== event.pointerId) {
    return;
  }

  const { scrollbar } = activeOutfitScrollbarDrag;

  if (typeof event.pointerId === "number" && scrollbar.hasPointerCapture?.(event.pointerId)) {
    scrollbar.releasePointerCapture(event.pointerId);
  }

  scrollbar.classList.remove("is-dragging");
  activeOutfitScrollbarDrag = null;
}

function startOutfitTrackDrag(event) {
  if (!(event.target instanceof Element) || event.button !== 0 || activeOutfitScrollbarDrag) {
    return;
  }

  const track = event.target.closest("[data-outfit-track]");

  if (!(track instanceof HTMLElement) || event.target.closest("[data-outfit-scrollbar], [data-outfit-scroll]")) {
    return;
  }

  activeOutfitTrackDrag = {
    pointerId: event.pointerId,
    track,
    slotKey: track.dataset.outfitTrack || "",
    startX: event.clientX,
    startScrollLeft: track.scrollLeft,
    moved: false
  };

  suppressOutfitTrackClick = false;
  track.classList.add("is-dragging");
  track.setPointerCapture?.(event.pointerId);
}

function moveOutfitTrackDrag(event) {
  if (!activeOutfitTrackDrag || activeOutfitTrackDrag.pointerId !== event.pointerId) {
    return;
  }

  const deltaX = event.clientX - activeOutfitTrackDrag.startX;

  if (Math.abs(deltaX) >= OUTFIT_HISTORY_DRAG_THRESHOLD) {
    activeOutfitTrackDrag.moved = true;
  }

  if (!activeOutfitTrackDrag.moved) {
    return;
  }

  event.preventDefault();
  activeOutfitTrackDrag.track.scrollLeft = activeOutfitTrackDrag.startScrollLeft - deltaX;
  syncOutfitTrackScrollbar(activeOutfitTrackDrag.slotKey);
}

function endOutfitTrackDrag(event) {
  if (!activeOutfitTrackDrag) {
    return;
  }

  if (typeof event.pointerId === "number" && activeOutfitTrackDrag.pointerId !== event.pointerId) {
    return;
  }

  const { track, moved } = activeOutfitTrackDrag;

  if (moved) {
    suppressOutfitTrackClick = true;
  }

  if (typeof event.pointerId === "number" && track.hasPointerCapture?.(event.pointerId)) {
    track.releasePointerCapture(event.pointerId);
  }

  track.classList.remove("is-dragging");
  activeOutfitTrackDrag = null;
}

function updateOutfitPreviewProcessing(title, copy) {
  if (outfitPreviewProcessingTitle) {
    outfitPreviewProcessingTitle.textContent = title;
  }

  if (outfitPreviewProcessingCopy) {
    outfitPreviewProcessingCopy.textContent = copy;
  }
}

function stopOutfitPreviewProgress() {
  if (outfitPreviewStageIntervalId) {
    window.clearInterval(outfitPreviewStageIntervalId);
    outfitPreviewStageIntervalId = 0;
  }

  if (outfitPreviewStageTimeoutId) {
    window.clearTimeout(outfitPreviewStageTimeoutId);
    outfitPreviewStageTimeoutId = 0;
  }
}

function startOutfitPreviewProgress() {
  stopOutfitPreviewProgress();

  const stages = [
    {
      title: "正在整理参考衣物",
      copy: "系统正在核对所选单品、模特设定和参考图板，准备生成试穿图。"
    },
    {
      title: "正在匹配穿搭层次",
      copy: "AI 正在分析上衣、下装、外套和配饰之间的穿搭关系，避免错穿和漏穿。"
    },
    {
      title: "正在生成试穿画面",
      copy: "系统正在组合完整人物姿态与整体穿搭效果，请稍候。"
    },
    {
      title: "正在细化成图细节",
      copy: "AI 正在修整边缘、材质和画面观感，让试穿图更接近最终效果。"
    }
  ];

  let stageIndex = 0;

  const renderStage = () => {
    const stage = stages[Math.min(stageIndex, stages.length - 1)];
    updateOutfitPreviewProcessing(stage.title, stage.copy);
  };

  renderStage();

  outfitPreviewStageIntervalId = window.setInterval(() => {
    if (stageIndex >= stages.length - 1) {
      window.clearInterval(outfitPreviewStageIntervalId);
      outfitPreviewStageIntervalId = 0;
      return;
    }

    stageIndex += 1;
    renderStage();
  }, 3200);

  outfitPreviewStageTimeoutId = window.setTimeout(() => {
    updateOutfitPreviewProcessing(
      "正在继续生成，请稍候",
      "当前生成时间比平时稍长，系统仍在处理穿搭细节和人物成图，请不要关闭页面。"
    );
  }, 16_000);
}

function syncOutfitPreviewCanvasState(groupedItems) {
  const draftSelectedCount = getSelectedOutfitGarments(outfitDraftSelection, groupedItems).length;
  const isAuthenticated = Boolean(currentUser && currentSession?.access_token);

  if (outfitPreviewProcessing) {
    if (isOutfitGenerating) {
      if (outfitPreviewProcessing.hidden) {
        startOutfitPreviewProgress();
      }

      outfitPreviewProcessing.hidden = false;
    } else {
      stopOutfitPreviewProgress();
      outfitPreviewProcessing.hidden = true;
    }
  }

  if (!outfitPreviewEmpty) {
    return;
  }

  const shouldShowEmpty = !outfitGeneratedPreviewUrl && !isOutfitGenerating;
  outfitPreviewEmpty.hidden = !shouldShowEmpty;

  if (!shouldShowEmpty) {
    return;
  }

  if (!draftSelectedCount) {
    if (outfitPreviewEmptyTitle) {
      outfitPreviewEmptyTitle.textContent = "AI 穿搭预览将在这里显示";
    }

    if (outfitPreviewEmptyCopy) {
      outfitPreviewEmptyCopy.textContent = "先从左侧选择两件或更多衣物，再点击“AI 生成试穿图”。";
    }

    return;
  }

  if (!isAuthenticated) {
    if (outfitPreviewEmptyTitle) {
      outfitPreviewEmptyTitle.textContent = `已选中 ${draftSelectedCount} 件衣物`;
    }

    if (outfitPreviewEmptyCopy) {
      outfitPreviewEmptyCopy.textContent = "登录后即可生成完整试穿图，当前搭配会保留在右侧等待你继续。";
    }

    return;
  }

  if (!hasOutfitAiConfig()) {
    if (outfitPreviewEmptyTitle) {
      outfitPreviewEmptyTitle.textContent = "AI 穿搭功能尚未配置完成";
    }

    if (outfitPreviewEmptyCopy) {
      outfitPreviewEmptyCopy.textContent = "请先完成 Supabase 和 AI 函数配置，之后这里会显示完整试穿效果。";
    }

    return;
  }

  if (outfitPreviewEmptyTitle) {
    outfitPreviewEmptyTitle.textContent = `已准备好 ${draftSelectedCount} 件参考衣物`;
  }

  if (outfitPreviewEmptyCopy) {
    outfitPreviewEmptyCopy.textContent = "点击“AI 生成试穿图”后，这里会显示完整的穿搭预览。";
  }
}

function syncOutfitActionButtons(groupedItems) {
  const hasAnyGarments = OUTFIT_SLOT_CONFIG.some((slot) => (groupedItems[slot.key] || []).length > 0);
  const selectedCount = getSelectedOutfitGarments(outfitDraftSelection, groupedItems).length;
  const hasDraftSelectionChanges = OUTFIT_SLOT_CONFIG.some((slot) => outfitDraftSelection[slot.key] !== outfitAppliedSelection[slot.key]);
  const hasDraftModelChanges = getOutfitModelProfileSignature(readOutfitModelProfile()) !== getOutfitModelProfileSignature(outfitAppliedModelProfile);
  const hasDraftChanges = hasDraftSelectionChanges || hasDraftModelChanges;
  const hasAnySelection = OUTFIT_SLOT_CONFIG.some((slot) => outfitDraftSelection[slot.key] || outfitAppliedSelection[slot.key]);
  const isAuthenticated = Boolean(currentUser && currentSession?.access_token);
  const canGenerate = hasAnyGarments && selectedCount > 0 && hasOutfitAiConfig() && isAuthenticated && !isOutfitGenerating;

  if (outfitLoadButton) {
    outfitLoadButton.disabled = !canGenerate;
    outfitLoadButton.textContent = isOutfitGenerating
      ? "AI 正在生成..."
      : (!hasAnyGarments
        ? "AI 生成试穿图"
        : (hasDraftChanges || !outfitGeneratedPreviewUrl ? "AI 生成试穿图" : "重新生成穿搭图"));
  }

  if (outfitResetButton) {
    outfitResetButton.disabled = (!hasAnyGarments && !outfitGeneratedPreviewUrl) || !hasAnySelection || isOutfitGenerating;
  }
}

function syncOutfitSelectionUi(groupedItems) {
  if (!outfitSelectorRows) {
    return;
  }

  outfitSelectorRows.querySelectorAll("[data-outfit-select]").forEach((button) => {
    const slotKey = button.dataset.outfitSlot || "";
    const itemId = button.dataset.outfitItemId === OUTFIT_SELECTION_NONE ? "" : button.dataset.outfitItemId || "";
    const isSelected = outfitDraftSelection[slotKey] === itemId;
    const isApplied = outfitAppliedSelection[slotKey] === itemId;

    button.classList.toggle("is-selected", isSelected);
    button.classList.toggle("is-applied", Boolean(itemId) && isApplied);
    button.setAttribute("aria-pressed", isSelected ? "true" : "false");
  });

  syncOutfitActionButtons(groupedItems);
}

function syncOutfitPreview(groupedItems) {
  const draftItems = getSelectedOutfitItems(outfitDraftSelection, groupedItems);
  setOutfitGeneratedPreview(outfitGeneratedPreviewUrl);
  syncOutfitPreviewCanvasState(groupedItems);

  if (outfitSelectedSummary) {
    outfitSelectedSummary.innerHTML = draftItems.length
      ? draftItems
        .map(({ slot, item }) => `
          <span class="outfit-summary-chip">
            <strong>${escapeHtml(slot.label)}</strong>
            <span>${escapeHtml(item.name || "未命名衣物")}</span>
          </span>
        `)
        .join("")
      : `<span class="outfit-summary-chip is-empty">还没有选中任何单品</span>`;
  }

  syncOutfitActionButtons(groupedItems);
}

function renderOutfitStudio() {
  if (!outfitSelectorRows) {
    return;
  }

  const groupedItems = groupGarmentsByOutfitSlot();
  const totalItems = OUTFIT_SLOT_CONFIG.reduce((count, slot) => count + (groupedItems[slot.key] || []).length, 0);

  outfitDraftSelection = sanitizeOutfitSelection(outfitDraftSelection, groupedItems);
  outfitAppliedSelection = sanitizeOutfitSelection(outfitAppliedSelection, groupedItems);

  if (totalItems === 0) {
    setOutfitGeneratedPreview("");
    outfitSelectorRows.innerHTML = `
      <div class="outfit-empty-state">
        <strong>衣柜里还没有可搭配的单品</strong>
        <p>先去“衣柜”或“新增衣物”里导入几件标准正面图，再回到这里组合搭配。</p>
        <button class="primary-button inline-button" type="button" data-open-add-modal>去新增衣物</button>
      </div>
    `;
    syncOutfitPreview(groupedItems);
    return;
  }

  outfitSelectorRows.innerHTML = OUTFIT_SLOT_CONFIG
    .map((slot) => buildCompactOutfitSlotRowMarkup(slot, groupedItems[slot.key] || []))
    .join("");

  bindOutfitTrackScrollbars();
  syncOutfitSelectionUi(groupedItems);
  syncOutfitPreview(groupedItems);
}

function setOutfitDraftSelection(slotKey, itemId) {
  if (!OUTFIT_SLOT_CONFIG.some((slot) => slot.key === slotKey)) {
    return;
  }

  outfitDraftSelection = {
    ...outfitDraftSelection,
    [slotKey]: itemId
  };

  const groupedItems = groupGarmentsByOutfitSlot();
  syncOutfitSelectionUi(groupedItems);
  syncOutfitPreview(groupedItems);

  const targetId = itemId || OUTFIT_SELECTION_NONE;
  const selectedCard = outfitSelectorRows?.querySelector(
    `[data-outfit-select][data-outfit-slot="${slotKey}"][data-outfit-item-id="${targetId}"]`
  );

  selectedCard?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
}

async function generateAiOutfitPreview() {
  const groupedItems = groupGarmentsByOutfitSlot();
  const selectedGarments = getSelectedOutfitGarments(outfitDraftSelection, groupedItems);
  const modelProfile = readOutfitModelProfile();

  if (!selectedGarments.length) {
    return;
  }

  if (!hasOutfitAiConfig()) {
    return;
  }

  isOutfitGenerating = true;
  syncOutfitActionButtons(groupedItems);
  syncOutfitPreview(groupedItems);

  try {
    const client = await ensureSupabaseClient();

    if (!client) {
      throw new Error(supabaseLoadErrorMessage || "Supabase SDK 加载失败，请稍后重试。");
    }

    if (!currentUser || !currentSession?.access_token) {
      throw new Error("请先登录账号，再生成 AI 穿搭试穿图。");
    }

    const referenceBoardDataUrl = await buildOutfitReferenceBoardDataUrl(selectedGarments);
    const { data, error } = await withTimeout(
      client.functions.invoke(AI_OUTFIT_FUNCTION_NAME, {
        body: {
          referenceBoardDataUrl,
          modelProfile,
          garments: selectedGarments.map((item) => ({
            id: item.id,
            name: item.name,
            type: item.type,
            categoryText: item.categoryText,
            color: item.color,
            seasons: item.seasons,
            imageUrl: item.imageUrl,
            imageDataUrl: item.imageDataUrl
          }))
        }
      }),
      OUTFIT_GENERATION_TIMEOUT_MS,
      "AI 生成试穿图超时了。请稍后重试。"
    );

    if (error) {
      throw error;
    }

    const outputUrl = String(data?.output?.imageUrl || "").trim();
    const outputPath = String(data?.output?.path || "").trim();

    if (!outputUrl) {
      throw new Error("AI 没有返回可用的试穿图。");
    }

    outfitAppliedSelection = {
      ...outfitDraftSelection
    };
    outfitAppliedModelProfile = modelProfile;
    setOutfitGeneratedPreview(outputUrl);
    appendOutfitHistoryInBackground(
      createOutfitHistoryEntry({
        imageUrl: outputUrl,
        imagePath: outputPath,
        garments: selectedGarments,
        modelProfile
      }),
      currentUser?.id || ""
    );
    syncOutfitSelectionUi(groupedItems);
    syncOutfitPreview(groupedItems);
  } catch (error) {
    console.error(error);
    outfitAppliedSelection = {
      ...outfitDraftSelection
    };
    outfitAppliedModelProfile = modelProfile;
    setOutfitGeneratedPreview("");
    const refreshedGroups = groupGarmentsByOutfitSlot();
    syncOutfitSelectionUi(refreshedGroups);
  } finally {
    isOutfitGenerating = false;
    const finalGroups = groupGarmentsByOutfitSlot();
    syncOutfitActionButtons(finalGroups);
    syncOutfitPreview(finalGroups);
  }
}

function resetOutfitStudio() {
  outfitDraftSelection = createEmptyOutfitSelection();
  outfitAppliedSelection = createEmptyOutfitSelection();
  outfitAppliedModelProfile = normalizeOutfitModelProfile(outfitDefaultModelProfile);
  applyOutfitModelProfile(outfitAppliedModelProfile);
  setOutfitGeneratedPreview("");
  isOutfitGenerating = false;
  stopOutfitPreviewProgress();

  const groupedItems = groupGarmentsByOutfitSlot();
  syncOutfitSelectionUi(groupedItems);
  syncOutfitPreview(groupedItems);
}

function scrollOutfitTrack(slotKey, direction) {
  const track = outfitSelectorRows?.querySelector(`[data-outfit-track="${slotKey}"]`);

  if (!track) {
    return;
  }

  const distance = Math.max(track.clientWidth * 0.86, 220) * direction;
  track.scrollBy({
    left: distance,
    behavior: "smooth"
  });
}

function loadCustomGarments() {
  return loadCustomGarmentsFromStorageKey(getCurrentGarmentStorageKey());
}

function saveCustomGarments(items) {
  saveCustomGarmentsToStorageKey(getCurrentGarmentStorageKey(), items);
}

function replaceGarmentInStorageKey(storageKey, item) {
  const items = loadCustomGarmentsFromStorageKey(storageKey);
  const index = items.findIndex((entry) => entry.id === item.id);

  if (index < 0) {
    return false;
  }

  items[index] = normalizeCustomGarment(item);
  saveCustomGarmentsToStorageKey(storageKey, items);
  return true;
}

function normalizeCloudGarmentRecord(record) {
  return normalizeCustomGarment({
    id: record.id,
    type: record.type,
    state: record.state,
    name: record.name,
    categoryText: record.category_text,
    location: record.location,
    seasons: record.seasons,
    frequency: record.frequency,
    lastWorn: record.last_worn,
    note: record.note,
    status: record.status,
    footer: record.footer,
    imageUrl: record.image_url,
    color: record.color,
    purchaseDate: record.purchase_date,
    price: record.price,
    brand: record.brand
  });
}

function buildCloudGarmentRecord(item, userId = currentUser?.id || "") {
  const normalized = normalizeCustomGarment(item);

  return {
    id: normalized.id,
    user_id: userId,
    type: normalized.type,
    state: normalized.state,
    name: normalized.name,
    category_text: normalized.categoryText,
    location: normalized.location,
    seasons: normalized.seasons,
    frequency: normalized.frequency,
    last_worn: normalized.lastWorn,
    note: normalized.note,
    status: normalized.status,
    footer: normalized.footer,
    image_url: normalized.imageUrl,
    color: normalized.color,
    purchase_date: normalized.purchaseDate,
    price: normalized.price,
    brand: normalized.brand
  };
}

function isLocalDevUrl(url) {
  return /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?/i.test(url || "");
}

function getFileExtensionFromMimeType(mimeType) {
  if (mimeType === "image/jpeg") {
    return "jpg";
  }

  if (mimeType === "image/png") {
    return "png";
  }

  if (mimeType === "image/webp") {
    return "webp";
  }

  return "png";
}

function shouldUploadGarmentImage(normalized) {
  return Boolean(
    normalized.imageDataUrl?.startsWith("data:image/")
      || isLocalDevUrl(normalized.imageUrl)
  );
}

async function getGarmentImageBlob(normalized) {
  const imageSource = normalized.imageDataUrl?.startsWith("data:image/")
    ? normalized.imageDataUrl
    : normalized.imageUrl;

  if (!imageSource) {
    return null;
  }

  const response = await fetch(imageSource);

  if (!response.ok) {
    throw new Error(`Failed to fetch garment image: ${response.status}`);
  }

  return response.blob();
}

async function maybeUploadGarmentImage(item, userId = currentUser?.id || "") {
  const normalized = normalizeCustomGarment(item);
  const client = initializeSupabaseClient();

  if (!client || !userId || !shouldUploadGarmentImage(normalized)) {
    return normalized;
  }

  const blob = await getGarmentImageBlob(normalized);

  if (!blob) {
    return normalized;
  }

  const extension = getFileExtensionFromMimeType(blob.type);
  const storagePath = `${userId}/${normalized.id}.${extension}`;
  const { error } = await client.storage.from(SUPABASE_BUCKET).upload(storagePath, blob, {
    upsert: true,
    contentType: blob.type || "image/png"
  });

  if (error) {
    throw error;
  }

  const { data } = client.storage.from(SUPABASE_BUCKET).getPublicUrl(storagePath);

  return normalizeCustomGarment({
    ...normalized,
    imageUrl: data?.publicUrl || normalized.imageUrl,
    imageDataUrl: ""
  });
}

async function upsertGarmentInCloud(item, userId = currentUser?.id || "") {
  const client = await ensureSupabaseClient();

  if (!client || !userId) {
    return normalizeCustomGarment(item);
  }

  const prepared = await maybeUploadGarmentImage(item, userId);
  const { data, error } = await client
    .from("garments")
    .upsert(buildCloudGarmentRecord(prepared, userId))
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data ? normalizeCloudGarmentRecord(data) : prepared;
}

async function removeGarmentFromCloud(id) {
  const client = await ensureSupabaseClient();

  if (!client || !currentUser?.id) {
    return;
  }

  const { error } = await client.from("garments").delete().eq("id", id);

  if (error) {
    throw error;
  }
}

async function fetchCloudGarments() {
  const client = await ensureSupabaseClient();

  if (!client || !currentUser?.id) {
    return [];
  }

  const { data, error } = await client
    .from("garments")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []).map(normalizeCloudGarmentRecord);
}

function handleCloudSyncError(error, fallbackMessage) {
  console.error(error);

  if (authStatusCopy) {
    authStatusCopy.textContent = fallbackMessage;
  }

  setAuthFeedback(fallbackMessage, "error");
}

async function hydrateWardrobeFromCloud() {
  if (!canSyncWardrobeToCloud() || isCloudSyncLoading) {
    return;
  }

  isCloudSyncLoading = true;
  syncAuthUi();

  const userId = currentUser.id;
  const userStorageKey = getGarmentStorageKeyForUser(userId);
  const anonymousItems = loadCustomGarmentsFromStorageKey(CUSTOM_GARMENTS_KEY);
  const cachedUserItems = loadCustomGarmentsFromStorageKey(userStorageKey);

  try {
    const cloudItems = await fetchCloudGarments();
    const localItems = mergeGarmentCollections(cachedUserItems, anonymousItems);
    const cloudIds = new Set(cloudItems.map((item) => item.id));
    const localOnlyItems = localItems.filter((item) => !cloudIds.has(item.id));
    const syncedLocalItems = [];

    for (const item of localOnlyItems) {
      try {
        syncedLocalItems.push(await upsertGarmentInCloud(item, userId));
      } catch (error) {
        console.error(error);
        syncedLocalItems.push(item);
      }
    }

    const finalItems = mergeGarmentCollections(localItems, cloudItems, syncedLocalItems);
    saveCustomGarmentsToStorageKey(userStorageKey, finalItems);

    if (anonymousItems.length) {
      clearCustomGarmentsFromStorageKey(CUSTOM_GARMENTS_KEY);
    }

    if (currentUser?.id === userId) {
      renderCustomGarments();
      filterWardrobeCards();
    }
  } catch (error) {
    handleCloudSyncError(error, "云端同步失败，当前先继续使用本地缓存。");
  } finally {
    isCloudSyncLoading = false;
    syncAuthUi();
  }
}

function syncGarmentToCloudInBackground(item, userId = currentUser?.id || "") {
  if (!supabaseClient || !userId) {
    return;
  }

  const storageKey = getGarmentStorageKeyForUser(userId);

  upsertGarmentInCloud(item, userId)
    .then((syncedItem) => {
      const didReplace = replaceGarmentInStorageKey(storageKey, syncedItem);

      if (!didReplace) {
        return;
      }

      if (currentUser?.id === userId) {
        renderCustomGarments();
        filterWardrobeCards();
        selectGarment(syncedItem.id);
      }
    })
    .catch((error) => {
      handleCloudSyncError(error, "云端保存失败，当前修改仍保留在本地。");
    });
}

function deleteGarmentFromCloudInBackground(id) {
  if (!canSyncWardrobeToCloud()) {
    return;
  }

  removeGarmentFromCloud(id).catch((error) => {
    handleCloudSyncError(error, "云端删除失败，刷新后可能还会看到这件衣物。");
  });
}

function buildCustomGarmentCardMarkup(item) {
  const ribbon = escapeHtml(item.location || "待整理");
  const name = escapeHtml(item.name || "未命名衣物");
  const category = escapeHtml(item.categoryText || "AI 导入");
  const status = escapeHtml(item.status || "待整理");
  const footer = escapeHtml(item.footer || "刚加入衣柜");
  const imageSource = item.imageUrl || item.imageDataUrl || "";
  const image = imageSource
    ? `<div class="garment-media-shell"><img class="garment-photo" src="${escapeHtml(imageSource)}" alt="${name}" width="320" height="320" loading="lazy" decoding="async"></div>`
    : `<div class="garment-media-shell"><div class="garment-figure ${getFigureClass(item.type)}"></div></div>`;

  return `
    <span class="card-ribbon">${ribbon}</span>
    ${image}
    <h4>${name}</h4>
    <p>${category}</p>
    <div class="garment-footer">
      <span>${status}</span>
      <span>${footer}</span>
    </div>
  `;
}

function createCustomGarmentCard(item) {
  const card = document.createElement("button");
  card.className = "garment-card custom-garment-card";
  card.type = "button";
  card.dataset.garmentId = item.id;
  card.dataset.garmentType = item.type;
  card.dataset.garmentState = item.state;
  card.dataset.garmentName = item.name;
  card.dataset.garmentCategory = item.categoryText;
  card.dataset.garmentLocation = item.location;
  card.dataset.garmentSeasons = item.seasons;
  card.dataset.garmentFrequency = item.frequency;
  card.dataset.garmentLastWorn = item.lastWorn;
  card.dataset.garmentNote = item.note;
  card.dataset.garmentStatus = item.status;
  card.dataset.garmentColor = item.color;
  card.dataset.garmentBrand = item.brand;
  card.dataset.garmentPurchaseDate = item.purchaseDate;
  card.dataset.garmentPrice = item.price;
  card.innerHTML = buildCustomGarmentCardMarkup(item);
  return card;
}

function removePlaceholderGarments() {
  if (!wardrobeGrid) {
    return;
  }

  wardrobeGrid.querySelectorAll('[data-garment-id]:not(.custom-garment-card)').forEach((card) => {
    card.remove();
  });
}

function updateWardrobeSummaryCounts() {
  const counts = {
    top: 0,
    bottom: 0,
    outer: 0,
    other: 0
  };

  getGarmentCards().forEach((card) => {
    const type = card.dataset.garmentType;

    if (type === "top") {
      counts.top += 1;
      return;
    }

    if (type === "bottom") {
      counts.bottom += 1;
      return;
    }

    if (type === "outer") {
      counts.outer += 1;
      return;
    }

    counts.other += 1;
  });

  if (wardrobeSummaryCounts[0]) {
    wardrobeSummaryCounts[0].textContent = String(counts.top);
  }

  if (wardrobeSummaryCounts[1]) {
    wardrobeSummaryCounts[1].textContent = String(counts.bottom);
  }

  if (wardrobeSummaryCounts[2]) {
    wardrobeSummaryCounts[2].textContent = String(counts.outer);
  }

  if (wardrobeSummaryCounts[3]) {
    wardrobeSummaryCounts[3].textContent = String(counts.other);
  }

  const total = counts.top + counts.bottom + counts.outer + counts.other;
  const countMap = {
    all: total,
    top: counts.top,
    bottom: counts.bottom,
    outer: counts.outer,
    accessory: counts.other
  };

  document.querySelectorAll("[data-wardrobe-filter]").forEach((button) => {
    const type = button.dataset.wardrobeFilter || "all";
    button.textContent = `${getWardrobeFilterLabel(type)}（${countMap[type] ?? 0}）`;
  });
}

function syncWardrobeFilterCountLabels() {
  const counts = {
    all: 0,
    top: 0,
    bottom: 0,
    outer: 0,
    accessory: 0
  };

  getGarmentCards().forEach((card) => {
    counts.all += 1;

    if (card.dataset.garmentType === "top") {
      counts.top += 1;
      return;
    }

    if (card.dataset.garmentType === "bottom") {
      counts.bottom += 1;
      return;
    }

    if (card.dataset.garmentType === "outer") {
      counts.outer += 1;
      return;
    }

    counts.accessory += 1;
  });

  const labels = {
    all: "全部",
    top: "上装",
    bottom: "下装",
    outer: "外套",
    accessory: "鞋包配饰"
  };

  document.querySelectorAll("[data-wardrobe-filter]").forEach((button) => {
    const type = button.dataset.wardrobeFilter || "all";
    button.textContent = `${labels[type] || labels.all}（${counts[type] ?? 0}）`;
  });
}

function renderCustomGarments() {
  if (!wardrobeGrid) {
    return;
  }

  removePlaceholderGarments();

  wardrobeGrid.querySelectorAll(".custom-garment-card").forEach((card) => {
    card.remove();
  });

  loadCustomGarments().forEach((item) => {
    wardrobeGrid.prepend(createCustomGarmentCard(item));
  });

  updateWardrobeSummaryCounts();
  syncWardrobeFilterCountLabels();
  refreshSearchEntries();
  renderWardrobeListEditor();
  applyWardrobeViewMode();
  renderOutfitStudio();
  renderHomeDashboard();
}

function addGarmentToWardrobe(item) {
  const allItems = loadCustomGarments();
  const normalizedItem = normalizeCustomGarment(item);
  const existingIndex = allItems.findIndex((entry) => entry.id === normalizedItem.id);
  const userId = currentUser?.id || "";

  if (existingIndex >= 0) {
    allItems[existingIndex] = normalizedItem;
  } else {
    allItems.unshift(normalizedItem);
  }

  saveCustomGarments(allItems);
  renderCustomGarments();
  filterWardrobeCards();
  selectGarment(normalizedItem.id);
  syncGarmentToCloudInBackground(normalizedItem, userId);
}

function updateGarmentInWardrobe(id, field, value) {
  const allItems = loadCustomGarments();
  const itemIndex = allItems.findIndex((entry) => entry.id === id);

  if (itemIndex < 0) {
    return;
  }

  allItems[itemIndex] = normalizeCustomGarment({
    ...allItems[itemIndex],
    [field]: value
  });
  const updatedItem = allItems[itemIndex];
  const userId = currentUser?.id || "";

  saveCustomGarments(allItems);
  renderCustomGarments();
  filterWardrobeCards();
  selectGarment(id);
  syncGarmentToCloudInBackground(updatedItem, userId);
}

function removeGarmentFromWardrobe(id) {
  const userId = currentUser?.id || "";
  const remainingItems = loadCustomGarments().filter((entry) => entry.id !== id);
  saveCustomGarments(remainingItems);
  renderCustomGarments();
  filterWardrobeCards();
  deleteGarmentFromCloudInBackground(id, userId);

  const nextItem = remainingItems[0];
  if (nextItem) {
    selectGarment(nextItem.id);
  }
}

removePlaceholderGarments();
let searchEntries = buildSearchEntries();

function renderSearchResults(query) {
  if (!globalSearchResults) {
    return;
  }

  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    globalSearchResults.hidden = true;
    globalSearchResults.innerHTML = "";
    return;
  }

  const matches = searchEntries
    .filter((entry) => entry.keywords.includes(normalizedQuery))
    .slice(0, 5);

  globalSearchResults.innerHTML = "";

  if (matches.length === 0) {
    const empty = document.createElement("div");
    empty.className = "search-result";
    empty.innerHTML = "<strong>没有找到匹配项</strong><span>试试衣物名称、位置、场景或页面名。</span>";
    globalSearchResults.appendChild(empty);
    globalSearchResults.hidden = false;
    return;
  }

  matches.forEach((entry) => {
    const link = document.createElement("a");
    link.href = `#${entry.view}`;
    link.className = "search-result";
    link.dataset.resultView = entry.view;
    link.dataset.resultType = entry.type;
    link.dataset.resultId = entry.id;
    link.innerHTML = `<strong>${entry.title}</strong><span>${entry.subtitle}</span>`;
    globalSearchResults.appendChild(link);
  });

  globalSearchResults.hidden = false;
}

async function signInWithEmailPassword() {
  if (!hasSupabaseConfig()) {
    setAuthFeedback("还没有配置 Supabase，请先填写 public-config.js。", "error");
    return;
  }

  const { email, password } = getAuthCredentials();

  if (!email || !password) {
    setAuthFeedback("请输入邮箱和密码。", "error");
    return;
  }

  setAuthBusy(true);
  setAuthFeedback("");

  try {
    const client = await ensureSupabaseClient();

    if (!client) {
      throw new Error(supabaseLoadErrorMessage || "Supabase SDK 加载失败，请稍后重试。");
    }

    const { error } = await client.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    closeAuthModal();
  } catch (error) {
    setAuthFeedback(error.message || "登录失败，请稍后再试。", "error");
  } finally {
    setAuthBusy(false);
    syncAuthUi();
  }
}

async function signUpWithEmailPassword() {
  if (!hasSupabaseConfig()) {
    setAuthFeedback("还没有配置 Supabase，请先填写 public-config.js。", "error");
    return;
  }

  const { email, password } = getAuthCredentials();

  if (!email || !password) {
    setAuthFeedback("请输入邮箱和密码。", "error");
    return;
  }

  setAuthBusy(true);
  setAuthFeedback("");

  try {
    const client = await ensureSupabaseClient();

    if (!client) {
      throw new Error(supabaseLoadErrorMessage || "Supabase SDK 加载失败，请稍后重试。");
    }

    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getSiteUrl()
      }
    });

    if (error) {
      throw error;
    }

    if (data.session) {
      closeAuthModal();
      return;
    }

    setAuthFeedback("注册成功，请先到邮箱完成验证，然后再回来登录。", "success");
  } catch (error) {
    setAuthFeedback(error.message || "注册失败，请稍后再试。", "error");
  } finally {
    setAuthBusy(false);
    syncAuthUi();
  }
}

async function signOutCurrentUser() {
  const client = await ensureSupabaseClient();

  if (!client) {
    closeAuthModal();
    return;
  }

  setAuthBusy(true);
  setAuthFeedback("");

  try {
    const { error } = await client.auth.signOut();

    if (error) {
      throw error;
    }

    closeAuthModal();
  } catch (error) {
    setAuthFeedback(error.message || "退出登录失败，请稍后再试。", "error");
  } finally {
    setAuthBusy(false);
    syncAuthUi();
  }
}

async function initializeCloudFeatures() {
  syncAuthUi();

  if (!hasSupabaseConfig()) {
    return;
  }

  try {
    const client = await ensureSupabaseClient();

    if (!client) {
      syncAuthUi();
      return;
    }

    const { data, error } = await client.auth.getSession();

    if (error) {
      throw error;
    }

    currentSession = data.session || null;
    currentUser = currentSession?.user || null;
    syncAuthUi();

    if (currentUser) {
      await hydrateOutfitModelProfileFromCloud();
      await hydrateWardrobePreferencesFromCloud();
      await hydrateWardrobeFromCloud();
      await hydrateOutfitHistoryFromCloud();
    }
  } catch (error) {
    handleCloudSyncError(error, "云端连接初始化失败，当前先继续使用本地缓存。");
  }

  supabaseClient.auth.onAuthStateChange((_event, session) => {
    currentSession = session || null;
    currentUser = currentSession?.user || null;
    syncAuthUi();

    if (currentUser) {
      void hydrateOutfitModelProfileFromCloud();
      void hydrateWardrobePreferencesFromCloud();
      void hydrateWardrobeFromCloud();
      void hydrateOutfitHistoryFromCloud();
      return;
    }

    setOutfitHistoryItems([]);
    setDefaultOutfitModelProfile(
      loadOutfitModelProfileFromStorageKey(getOutfitModelProfileStorageKeyForUser("")),
      { persistCloud: false, syncPreview: true }
    );
    setWardrobeVisibleColumns(
      loadWardrobeVisibleColumnsFromStorageKey(getWardrobeVisibleColumnsStorageKeyForUser("")),
      { persistCloud: false }
    );
    renderCustomGarments();
    filterWardrobeCards();
  });
}

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

window.addEventListener("resize", () => {
  syncAllOutfitTrackScrollbars();
});

viewLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const view = link.dataset.viewLink;

    if (!viewConfig[view]) {
      return;
    }

    event.preventDefault();

    if (window.location.hash === `#${view}`) {
      applyView(view);
      return;
    }

    window.location.hash = view;
  });
});

window.addEventListener("hashchange", () => {
  applyView(getViewFromHash());
});

authForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  void signInWithEmailPassword();
});

document.querySelectorAll('[data-auth-action="signup"]').forEach((button) => {
  button.addEventListener("click", () => {
    void signUpWithEmailPassword();
  });
});

[...authSignOutButtons, ...authSignOutModalButtons].forEach((button) => {
  button.addEventListener("click", () => {
    void signOutCurrentUser();
  });
});

seasonButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applySeason(button.dataset.season);
  });
});

outfitSelectorRows?.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  if (suppressOutfitTrackClick) {
    suppressOutfitTrackClick = false;
    event.preventDefault();
    return;
  }

  const scrollButton = event.target.closest("[data-outfit-scroll]");

  if (scrollButton) {
    scrollOutfitTrack(scrollButton.dataset.outfitSlot || "", Number(scrollButton.dataset.outfitScroll || "0") || 0);
    return;
  }

  const optionButton = event.target.closest("[data-outfit-select]");

  if (!optionButton) {
    return;
  }

  const slotKey = optionButton.dataset.outfitSlot || "";
  const itemId = optionButton.dataset.outfitItemId === OUTFIT_SELECTION_NONE
    ? ""
    : optionButton.dataset.outfitItemId || "";

  setOutfitDraftSelection(slotKey, itemId);
});

outfitSelectorRows?.addEventListener("pointerdown", startOutfitScrollbarDrag);
outfitSelectorRows?.addEventListener("pointermove", moveOutfitScrollbarDrag);
outfitSelectorRows?.addEventListener("pointerup", endOutfitScrollbarDrag);
outfitSelectorRows?.addEventListener("pointercancel", endOutfitScrollbarDrag);
outfitSelectorRows?.addEventListener("lostpointercapture", endOutfitScrollbarDrag);
outfitSelectorRows?.addEventListener("pointerdown", startOutfitTrackDrag);
outfitSelectorRows?.addEventListener("pointermove", moveOutfitTrackDrag);
outfitSelectorRows?.addEventListener("pointerup", endOutfitTrackDrag);
outfitSelectorRows?.addEventListener("pointercancel", endOutfitTrackDrag);
outfitSelectorRows?.addEventListener("lostpointercapture", endOutfitTrackDrag);

outfitHistoryButton?.addEventListener("click", () => {
  openOutfitHistoryModal(outfitHistoryButton);
});

outfitModelButton?.addEventListener("click", () => {
  openOutfitModelModal(outfitModelButton);
});

outfitLoadButton?.addEventListener("click", () => {
  void generateAiOutfitPreview();
});

outfitResetButton?.addEventListener("click", () => {
  resetOutfitStudio();
});

outfitModelSaveButton?.addEventListener("click", () => {
  void saveOutfitModelProfileDefaults();
});

outfitHistoryTrack?.addEventListener("click", (event) => {
  if (suppressOutfitHistoryClick) {
    event.preventDefault();
    event.stopPropagation();
    suppressOutfitHistoryClick = false;
    return;
  }

  if (!(event.target instanceof Element)) {
    return;
  }

  const button = event.target.closest("[data-load-outfit-history]");

  if (!button) {
    return;
  }

  loadOutfitHistoryEntry(button.dataset.loadOutfitHistory || "");
});

outfitHistoryTrack?.addEventListener("pointerdown", beginOutfitHistoryDrag);
outfitHistoryTrack?.addEventListener("pointermove", updateOutfitHistoryDrag);
outfitHistoryTrack?.addEventListener("pointerup", endOutfitHistoryDrag);
outfitHistoryTrack?.addEventListener("pointercancel", endOutfitHistoryDrag);
outfitHistoryTrack?.addEventListener("lostpointercapture", endOutfitHistoryDrag);

homeOpenOutfitHistoryButton?.addEventListener("click", () => {
  openOutfitHistoryModal(homeOpenOutfitHistoryButton);
});

homeRecentGarments?.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const card = event.target.closest("[data-home-garment-id]");

  if (!card) {
    return;
  }

  openWardrobeAndSelectGarment(card.dataset.homeGarmentId || "");
});

homeOutfitHistory?.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const button = event.target.closest("[data-load-home-outfit-history]");

  if (!button) {
    return;
  }

  openOutfitHistoryEntryFromHome(button.dataset.loadHomeOutfitHistory || "");
});

if (wardrobeGrid) {
  wardrobeGrid.addEventListener("click", (event) => {
    const card = event.target.closest("[data-garment-id]");

    if (!card) {
      return;
    }

    selectGarment(card.dataset.garmentId);
  });
}

normalizeWardrobeToolbar();
const wardrobeListEditor = ensureWardrobeListEditor();
const wardrobeFilterGroup = document.querySelector("[data-wardrobe-filter-group]");
const wardrobeColumnPicker = document.querySelector("[data-wardrobe-column-picker]");

syncWardrobeColumnPicker();

if (wardrobeListEditor) {
  wardrobeListEditor.addEventListener("focusin", (event) => {
    const row = event.target.closest(".wardrobe-list-row");

    if (!row) {
      return;
    }

    selectGarment(row.dataset.garmentId);
  });

  wardrobeListEditor.addEventListener("change", (event) => {
    const control = event.target.closest("[data-field]");
    const row = event.target.closest(".wardrobe-list-row");

    if (!control || !row) {
      return;
    }

    updateGarmentInWardrobe(row.dataset.garmentId, control.dataset.field, control.value.trim());
  });

  wardrobeListEditor.addEventListener("click", (event) => {
    const deleteButton = event.target.closest("[data-delete-garment]");
    const row = event.target.closest(".wardrobe-list-row");

    if (deleteButton) {
      removeGarmentFromWardrobe(deleteButton.dataset.deleteGarment);
      return;
    }

    if (row) {
      selectGarment(row.dataset.garmentId);
    }
  });
}

document.querySelector("[data-toggle-wardrobe-view]")?.addEventListener("click", () => {
  toggleWardrobeViewMode();
});

wardrobeColumnPicker?.addEventListener("click", (event) => {
  const toggleButton = event.target.closest("[data-toggle-wardrobe-columns]");

  if (!toggleButton) {
    return;
  }

  toggleWardrobeColumnPicker();
});

wardrobeColumnPicker?.addEventListener("change", (event) => {
  const checkbox = event.target.closest("[data-wardrobe-column-field]");

  if (!checkbox) {
    return;
  }

  const selectedOptionalFields = Array.from(
    wardrobeColumnPicker.querySelectorAll("[data-wardrobe-column-field]:checked")
  ).map((input) => input.dataset.wardrobeColumnField);

  setWardrobeVisibleColumns([...WARDROBE_REQUIRED_COLUMNS, ...selectedOptionalFields]);
});

aiIntakeChannel?.addEventListener("message", (event) => {
  dispatchAiIntakePayload(event.data);
});

window.addEventListener("storage", (event) => {
  if (event.key !== AI_INTAKE_PENDING_GARMENT_KEY || !event.newValue) {
    return;
  }

  consumePendingAiIntakeGarment(event.newValue);
});

try {
  const pendingAiIntakePayload = window.localStorage.getItem(AI_INTAKE_PENDING_GARMENT_KEY);

  if (pendingAiIntakePayload) {
    consumePendingAiIntakeGarment(pendingAiIntakePayload);
  }
} catch {
  // Ignore localStorage read errors.
}

document.addEventListener("click", (event) => {
  if (!wardrobeColumnPicker || !wardrobeColumnPicker.classList.contains("is-open")) {
    return;
  }

  if (!wardrobeColumnPicker.contains(event.target)) {
    closeWardrobeColumnPicker();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeWardrobeColumnPicker();
  }
});

wardrobeFilterGroup?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-wardrobe-filter]");

  if (!button) {
    return;
  }

  currentWardrobeFilter = button.dataset.wardrobeFilter || "all";
  filterWardrobeCards();
});

toggleGroups.forEach((group) => {
  group.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) {
      return;
    }

    group.querySelectorAll("button").forEach((item) => {
      item.classList.remove("active");
    });

    button.classList.add("active");
  });
});

wardrobeFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentWardrobeFilter = button.dataset.wardrobeFilter || "all";
    filterWardrobeCards();
  });
});

wardrobeStateButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentWardrobeState = button.dataset.wardrobeState || "all";
    filterWardrobeCards();
  });
});

if (wardrobeSearchInput) {
  wardrobeSearchInput.addEventListener("input", () => {
    filterWardrobeCards();
  });
}

favoriteButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const { outfitId } = button.dataset;

    if (savedOutfits.has(outfitId)) {
      savedOutfits.delete(outfitId);
      button.classList.remove("is-saved");
      button.textContent = "收藏";
    } else {
      savedOutfits.add(outfitId);
      button.classList.add("is-saved");
      button.textContent = "已收藏";
    }

    if (currentView === "outfit") {
      applySidebar("outfit");
    }
  });
});

storageTaskNodes.forEach((node) => {
  node.addEventListener("change", () => {
    updateStorageProgress();
  });
});

if (globalSearchInput) {
  globalSearchInput.addEventListener("input", () => {
    renderSearchResults(globalSearchInput.value);
  });
}

if (globalSearchResults) {
  globalSearchResults.addEventListener("click", (event) => {
    const button = event.target.closest(".search-result");

    if (!button || !button.dataset.resultView) {
      return;
    }

    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();

    const { resultView, resultType, resultId } = button.dataset;
    if (window.location.hash === `#${resultView}`) {
      applyView(resultView);
    } else {
      window.location.hash = resultView;
    }

    if (resultType === "garment") {
      requestAnimationFrame(() => {
        selectGarment(resultId);
      });
    }

    globalSearchResults.hidden = true;
    globalSearchResults.innerHTML = "";
    globalSearchInput.value = "";
  });
}

function dispatchAiIntakePayload(payload) {
  window.dispatchEvent(new MessageEvent("message", { data: payload }));
}

function consumePendingAiIntakeGarment(rawValue) {
  if (!rawValue) {
    return;
  }

  try {
    const payload = JSON.parse(rawValue);
    dispatchAiIntakePayload(payload);
  } catch (error) {
    console.warn(error);
  } finally {
    try {
      window.localStorage.removeItem(AI_INTAKE_PENDING_GARMENT_KEY);
    } catch {
      // Ignore localStorage cleanup errors.
    }
  }
}

window.addEventListener("message", (event) => {
  const payload = event.data;

  if (payload?.type === "ai-intake:embed-height") {
    const addViewFrame = getAddViewFrame();

    if (addViewFrame instanceof HTMLIFrameElement && addViewFrame.contentWindow === event.source) {
      applyAddViewFrameHeight(payload.height);
    }

    return;
  }

  if (!payload || payload.type !== "ai-intake:add-garment") {
    return;
  }

  const transferId = String(payload.transferId || "").trim();

  if (transferId) {
    if (handledAiIntakeTransferIds.has(transferId)) {
      return;
    }

    handledAiIntakeTransferIds.add(transferId);
  }

  const garmentName = payload.garmentName || "AI 新增衣物";
  const category = payload.category || "top";
  const location = payload.location || "待整理";
  const seasons = payload.season || "待确认";
  const color = payload.color || "待确认";
  const note = payload.note || "由 AI 处理台导入";
  const purchaseDate = payload.purchaseDate || "";
  const price = payload.price || "";
  const brand = payload.brand || "";
  const imageUrl = payload.imageUrl || "";
  const id = `${slugify(garmentName)}-${Date.now()}`;

  addGarmentToWardrobe({
    id,
    type: category,
    state: "pending",
    name: garmentName,
    categoryText: `${color} / ${seasons} / AI 导入`,
    location,
    seasons,
    frequency: "新加入",
    lastWorn: "未穿过",
    note,
    status: "待整理",
    footer: "AI 标准图",
    imageUrl,
    color,
    purchaseDate,
    price,
    brand
  });

  applyView("wardrobe");
  window.location.hash = "wardrobe";
  closeAddGarmentModal();

  try {
    window.localStorage.removeItem(AI_INTAKE_PENDING_GARMENT_KEY);
  } catch {
    // Ignore localStorage cleanup errors.
  }
});

document.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  const openModalTrigger = target.closest("[data-open-add-modal]");
  if (openModalTrigger) {
    event.preventDefault();
    if (window.location.hash === "#add") {
      applyView("add");
    } else {
      window.location.hash = "add";
    }
    return;
  }

  const openAuthTrigger = target.closest("[data-open-auth-modal]");
  if (openAuthTrigger) {
    event.preventDefault();
    openAuthModal(openAuthTrigger);
    return;
  }

  const toggleAiTrigger = target.closest("[data-toggle-ai-intake]");
  if (toggleAiTrigger) {
    event.preventDefault();
    toggleEmbeddedIntake();
    return;
  }

  const closeModalTrigger = target.closest("[data-close-add-modal]");
  if (closeModalTrigger) {
    event.preventDefault();
    closeAddGarmentModal();
    return;
  }

  const closeAuthTrigger = target.closest("[data-close-auth-modal]");
  if (closeAuthTrigger) {
    event.preventDefault();
    closeAuthModal();
    return;
  }

  const closeOutfitHistoryTrigger = target.closest("[data-close-outfit-history]");
  if (closeOutfitHistoryTrigger) {
    event.preventDefault();
    closeOutfitHistoryModal();
    return;
  }

  const closeOutfitModelTrigger = target.closest("[data-close-outfit-model]");
  if (closeOutfitModelTrigger) {
    event.preventDefault();
    closeOutfitModelModal();
    return;
  }

  if (addGarmentModal && !addGarmentModal.hidden) {
    const clickedBackdrop = target === addGarmentModal;
    const clickedInsidePanel = addGarmentModalPanel instanceof Element && addGarmentModalPanel.contains(target);

    if (clickedBackdrop && !clickedInsidePanel) {
      closeAddGarmentModal();
      return;
    }
  }

  if (authModal && !authModal.hidden) {
    const clickedBackdrop = target === authModal;
    const clickedInsidePanel = authModalPanel instanceof Element && authModalPanel.contains(target);

    if (clickedBackdrop && !clickedInsidePanel) {
      closeAuthModal();
      return;
    }
  }

  if (outfitHistoryModal && !outfitHistoryModal.hidden) {
    const clickedBackdrop = target === outfitHistoryModal;
    const clickedInsidePanel = outfitHistoryModalPanel instanceof Element && outfitHistoryModalPanel.contains(target);

    if (clickedBackdrop && !clickedInsidePanel) {
      closeOutfitHistoryModal();
      return;
    }
  }

  if (outfitModelModal && !outfitModelModal.hidden && target === outfitModelModal) {
    closeOutfitModelModal();
    return;
  }

  if (!globalSearchResults || !globalSearchInput) {
    return;
  }

  if (target.closest(".search-shell") || target.closest(".search-popover")) {
    return;
  }

  globalSearchResults.hidden = true;
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && addGarmentModal && !addGarmentModal.hidden) {
    closeAddGarmentModal();
  }

  if (event.key === "Escape" && authModal && !authModal.hidden) {
    closeAuthModal();
  }

  if (event.key === "Escape" && outfitHistoryModal && !outfitHistoryModal.hidden) {
    closeOutfitHistoryModal();
  }

  if (event.key === "Escape" && outfitModelModal && !outfitModelModal.hidden) {
    closeOutfitModelModal();
  }
});

window.addEventListener("load", () => {
  resetScrollPosition();
});

window.addEventListener("pageshow", () => {
  resetScrollPosition();
});

ensureAddViewNavigation();
ensureAddViewPage();
bindAddViewFrameSizing();
bindAddViewLink();
mountOutfitModelPanel();
applyOutfitModelProfile(outfitAppliedModelProfile);
applyView(getViewFromHash());
applySeason("spring");
renderCustomGarments();
filterWardrobeCards();
updateStorageProgress();
syncEmbeddedIntakeState();
void initializeCloudFeatures();
