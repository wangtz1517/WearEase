const viewConfig = {
  home: {
    title: "衣橱志 Atelier Archive | 首页",
    intro: "像家里真正的衣柜一样，知道哪件挂着、哪件叠着、哪件该收起来，也知道明天早上穿什么。",
    viewName: "首页",
    focus: "查看衣橱整体概况。",
    mode: "总览模式"
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
  },
  storage: {
    title: "衣橱志 Atelier Archive | 收纳",
    intro: "收纳视图负责季节切换和位置管理。这里不是看穿搭灵感，而是决定衣服该在哪里、什么时候该换位。",
    viewName: "收纳",
    focus: "查看当前季节整理建议。",
    mode: "收纳模式"
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
const addGarmentModal = document.querySelector("#add-garment-modal");
const addGarmentModalPanel = addGarmentModal ? addGarmentModal.querySelector(".modal-panel") : null;
const addGarmentCloseButton = addGarmentModal
  ? addGarmentModal.querySelector("[data-close-add-modal]")
  : null;
const embeddedIntakePanel = document.querySelector("#embedded-intake-panel");
const embeddedIntakeFrame = document.querySelector("#embedded-intake-frame");

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

let currentView = "home";
let currentSeason = "spring";
let currentWardrobeFilter = "all";
let currentWardrobeState = "all";
let currentWardrobeView = "board";
let lastAddGarmentTrigger = null;
let isEmbeddedIntakeOpen = false;
const CUSTOM_GARMENTS_KEY = "atelier-archive-custom-garments";
const WARDROBE_VIEW_KEY = "atelier-archive-wardrobe-view";
const savedOutfits = new Set(
  Array.from(favoriteButtons)
    .filter((button) => button.classList.contains("is-saved"))
    .map((button) => button.dataset.outfitId)
);

try {
  currentWardrobeView = window.localStorage.getItem(WARDROBE_VIEW_KEY) === "list" ? "list" : "board";
} catch {
  currentWardrobeView = "board";
}

function getGarmentCards() {
  return Array.from(document.querySelectorAll(".garment-card[data-garment-id]"));
}

function getWardrobeListRows() {
  return Array.from(document.querySelectorAll(".wardrobe-list-row"));
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
    <span class="menu-mini">＋</span>
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
    <header class="page-hero compact-hero">
      <div class="page-hero-copy compact-copy">
        <div class="title-pair page-title-pair">
          <h2>新增你的衣物</h2>
          <p class="eyebrow">新增 / Add</p>
        </div>
        <p class="hero-text">上传原图，生成标准归档图，并直接加入主衣柜。</p>
      </div>
    </header>

    <section class="glass-panel simple-panel">
      <section class="embedded-intake-panel add-view-panel">
        <iframe
          class="embedded-intake-frame add-view-frame"
          title="衣物 AI 标准化处理台"
          src="./studio/intake-studio.html?embed=1"
        ></iframe>
      </section>
    </section>
  `;

  if (storageView) {
    mainContent.insertBefore(section, storageView);
  } else {
    mainContent.appendChild(section);
  }
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
  document.body.classList.toggle("add-view-active", resolvedView === "add");

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

function buildWardrobeEditorField(label, field, value, options = {}) {
  const { type = "text", rows = 0, fieldClass = "" } = options;

  if (type === "textarea") {
    return `
      <label class="wardrobe-editor-field ${fieldClass}">
        <span>${label}</span>
        <textarea data-field="${field}" rows="${rows || 3}">${escapeHtml(value || "")}</textarea>
      </label>
    `;
  }

  if (type === "select") {
    const selectOptions = (options.options || [])
      .map((option) => {
        const selected = String(option.value) === String(value) ? " selected" : "";
        return `<option value="${escapeHtml(option.value)}"${selected}>${escapeHtml(option.label)}</option>`;
      })
      .join("");

    return `
      <label class="wardrobe-editor-field ${fieldClass}">
        <span>${label}</span>
        <select data-field="${field}">
          ${selectOptions}
        </select>
      </label>
    `;
  }

  return `
    <label class="wardrobe-editor-field ${fieldClass}">
      <span>${label}</span>
      <input data-field="${field}" type="${type}" value="${escapeHtml(value || "")}">
    </label>
  `;
}

function buildWardrobeListRowMarkup(item, index) {
  const summary = [getTypeLabel(item.type), item.location || "待整理"].filter(Boolean).join(" / ");

  return `
    <article
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
      <div class="wardrobe-list-row-head">
        <div class="wardrobe-list-row-title">
          <strong>${escapeHtml(item.name || `衣物 ${index + 1}`)}</strong>
          <span>${escapeHtml(summary)}</span>
        </div>
        <button class="ghost-button inline-button wardrobe-delete-button" type="button" data-delete-garment="${escapeHtml(item.id)}">删除衣物</button>
      </div>

      <div class="wardrobe-list-fields">
        ${buildWardrobeEditorField("衣物名称", "name", item.name)}
        ${buildWardrobeEditorField("衣物类型", "type", item.type, {
          type: "select",
          options: [
            { value: "top", label: "上装" },
            { value: "bottom", label: "下装" },
            { value: "outer", label: "外套" },
            { value: "accessory", label: "鞋包配饰" }
          ]
        })}
        ${buildWardrobeEditorField("衣柜状态", "state", item.state, {
          type: "select",
          options: [
            { value: "pending", label: "待整理" },
            { value: "active", label: "当季外放" },
            { value: "frequent", label: "常穿" }
          ]
        })}
        ${buildWardrobeEditorField("收纳位置", "location", item.location)}
        ${buildWardrobeEditorField("颜色标签", "color", item.color)}
        ${buildWardrobeEditorField("季节标签", "seasons", item.seasons)}
        ${buildWardrobeEditorField("购入时间", "purchaseDate", item.purchaseDate, { type: "date" })}
        ${buildWardrobeEditorField("价格", "price", item.price)}
        ${buildWardrobeEditorField("品牌备注", "brand", item.brand)}
        ${buildWardrobeEditorField("分类说明", "categoryText", item.categoryText)}
        ${buildWardrobeEditorField("状态标签", "status", item.status)}
        ${buildWardrobeEditorField("穿着频率", "frequency", item.frequency)}
        ${buildWardrobeEditorField("最近穿着", "lastWorn", item.lastWorn)}
        ${buildWardrobeEditorField("卡片短标签", "footer", item.footer)}
        ${buildWardrobeEditorField("备注", "note", item.note, { type: "textarea", rows: 3, fieldClass: "is-wide" })}
      </div>
    </article>
  `;
}

function renderWardrobeListEditor() {
  const editor = ensureWardrobeListEditor();

  if (!editor) {
    return;
  }

  const items = loadCustomGarments();

  if (!items.length) {
    editor.innerHTML = `
      <div class="wardrobe-list-empty">
        <strong>还没有可编辑的衣物</strong>
        <span>先去“新增”页生成并加入几件衣物，再切回列表模式编辑。</span>
      </div>
    `;
    return;
  }

  editor.innerHTML = items.map((item, index) => buildWardrobeListRowMarkup(item, index)).join("");
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

function buildWardrobeListRowMarkup(item) {
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
      <td class="cell-name">${buildWardrobeTableControl("name", item.name)}</td>
      <td>${buildWardrobeTableControl("type", item.type, {
        type: "select",
        options: [
          { value: "top", label: "上装" },
          { value: "bottom", label: "下装" },
          { value: "outer", label: "外套" },
          { value: "accessory", label: "鞋包配饰" }
        ]
      })}</td>
      <td>${buildWardrobeTableControl("state", item.state, {
        type: "select",
        options: [
          { value: "pending", label: "待整理" },
          { value: "active", label: "当季外放" },
          { value: "frequent", label: "常穿" }
        ]
      })}</td>
      <td>${buildWardrobeTableControl("location", item.location)}</td>
      <td>${buildWardrobeTableControl("color", item.color)}</td>
      <td>${buildWardrobeTableControl("seasons", item.seasons)}</td>
      <td>${buildWardrobeTableControl("purchaseDate", item.purchaseDate, { type: "date" })}</td>
      <td>${buildWardrobeTableControl("price", item.price)}</td>
      <td>${buildWardrobeTableControl("brand", item.brand)}</td>
      <td>${buildWardrobeTableControl("categoryText", item.categoryText)}</td>
      <td>${buildWardrobeTableControl("status", item.status)}</td>
      <td>${buildWardrobeTableControl("frequency", item.frequency)}</td>
      <td>${buildWardrobeTableControl("lastWorn", item.lastWorn)}</td>
      <td>${buildWardrobeTableControl("footer", item.footer)}</td>
      <td class="cell-note">${buildWardrobeTableControl("note", item.note)}</td>
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
      <table class="wardrobe-editor-table">
        <thead>
          <tr>
            <th>名称</th>
            <th>类型</th>
            <th>状态</th>
            <th>位置</th>
            <th>颜色</th>
            <th>季节</th>
            <th>购入时间</th>
            <th>价格</th>
            <th>品牌</th>
            <th>分类说明</th>
            <th>状态标签</th>
            <th>频率</th>
            <th>最近穿着</th>
            <th>卡片标签</th>
            <th>备注</th>
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

function renderWardrobeListEditor() {
  const editor = ensureWardrobeListEditor();

  if (!editor) {
    return;
  }

  const items = loadCustomGarments();

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
      <table class="wardrobe-editor-table">
        <thead>
          <tr>
            <th>名称</th>
            <th>类型</th>
            <th>状态</th>
            <th>位置</th>
            <th>颜色</th>
            <th>季节</th>
            <th>购入时间</th>
            <th>价格</th>
            <th>品牌</th>
            <th>分类说明</th>
            <th>状态标签</th>
            <th>频率</th>
            <th>最近穿着</th>
            <th>卡片标签</th>
            <th>备注</th>
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
  document.body.classList.add("modal-open");
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
  document.body.classList.remove("modal-open");
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

function loadCustomGarments() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CUSTOM_GARMENTS_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.map(normalizeCustomGarment) : [];
  } catch {
    return [];
  }
}

function saveCustomGarments(items) {
  window.localStorage.setItem(CUSTOM_GARMENTS_KEY, JSON.stringify(items.map(normalizeCustomGarment)));
}

function buildCustomGarmentCardMarkup(item) {
  const ribbon = escapeHtml(item.location || "待整理");
  const name = escapeHtml(item.name || "未命名衣物");
  const category = escapeHtml(item.categoryText || "AI 导入");
  const status = escapeHtml(item.status || "待整理");
  const footer = escapeHtml(item.footer || "刚加入衣柜");
  const imageSource = item.imageUrl || item.imageDataUrl || "";
  const image = imageSource
    ? `<img class="garment-photo" src="${imageSource}" alt="${name}">`
    : `<div class="garment-figure ${getFigureClass(item.type)}"></div>`;

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
  const card = document.createElement("article");
  card.className = "garment-card custom-garment-card";
  card.tabIndex = 0;
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

  getGarmentCards().forEach((card) => {
    card.tabIndex = 0;
  });

  updateWardrobeSummaryCounts();
  syncWardrobeFilterCountLabels();
  refreshSearchEntries();
  renderWardrobeListEditor();
  applyWardrobeViewMode();
}

function addGarmentToWardrobe(item) {
  const allItems = loadCustomGarments();
  const existingIndex = allItems.findIndex((entry) => entry.id === item.id);

  if (existingIndex >= 0) {
    allItems[existingIndex] = item;
  } else {
    allItems.unshift(item);
  }

  saveCustomGarments(allItems);
  renderCustomGarments();
  filterWardrobeCards();
  selectGarment(item.id);
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

  saveCustomGarments(allItems);
  renderCustomGarments();
  filterWardrobeCards();
  selectGarment(id);
}

function removeGarmentFromWardrobe(id) {
  const remainingItems = loadCustomGarments().filter((entry) => entry.id !== id);
  saveCustomGarments(remainingItems);
  renderCustomGarments();
  filterWardrobeCards();

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
    const button = document.createElement("button");
    button.type = "button";
    button.className = "search-result";
    button.dataset.resultView = entry.view;
    button.dataset.resultType = entry.type;
    button.dataset.resultId = entry.id;
    button.innerHTML = `<strong>${entry.title}</strong><span>${entry.subtitle}</span>`;
    globalSearchResults.appendChild(button);
  });

  globalSearchResults.hidden = false;
}

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

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

seasonButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applySeason(button.dataset.season);
  });
});

if (wardrobeGrid) {
  wardrobeGrid.addEventListener("click", (event) => {
    const card = event.target.closest("[data-garment-id]");

    if (!card) {
      return;
    }

    selectGarment(card.dataset.garmentId);
  });

  wardrobeGrid.addEventListener("keydown", (event) => {
    const card = event.target.closest("[data-garment-id]");

    if (!card) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectGarment(card.dataset.garmentId);
    }
  });
}

normalizeWardrobeToolbar();
const wardrobeListEditor = ensureWardrobeListEditor();
const wardrobeFilterGroup = document.querySelector("[data-wardrobe-filter-group]");

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

window.addEventListener("message", (event) => {
  const payload = event.data;

  if (!payload || payload.type !== "ai-intake:add-garment") {
    return;
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

  if (addGarmentModal && !addGarmentModal.hidden) {
    const clickedBackdrop = target === addGarmentModal;
    const clickedInsidePanel = addGarmentModalPanel instanceof Element && addGarmentModalPanel.contains(target);

    if (clickedBackdrop && !clickedInsidePanel) {
      closeAddGarmentModal();
      return;
    }
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
});

window.addEventListener("load", () => {
  resetScrollPosition();
});

window.addEventListener("pageshow", () => {
  resetScrollPosition();
});

ensureAddViewNavigation();
ensureAddViewPage();
bindAddViewLink();
applyView(getViewFromHash());
applySeason("spring");
renderCustomGarments();
filterWardrobeCards();
updateStorageProgress();
syncEmbeddedIntakeState();
