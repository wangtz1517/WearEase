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
const viewPanels = document.querySelectorAll(".page-view");
const toggleGroups = document.querySelectorAll("[data-toggle-group]");
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
const garmentCards = document.querySelectorAll("[data-garment-id]");
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
let lastAddGarmentTrigger = null;
const savedOutfits = new Set(
  Array.from(favoriteButtons)
    .filter((button) => button.classList.contains("is-saved"))
    .map((button) => button.dataset.outfitId)
);

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

  viewPanels.forEach((panel) => {
    const isActive = panel.dataset.view === resolvedView;
    panel.classList.toggle("is-active", isActive);
    panel.setAttribute("aria-hidden", String(!isActive));
  });

  navLinks.forEach((link) => {
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
  return Array.from(garmentCards).find((card) => card.dataset.garmentId === id);
}

function filterWardrobeCards() {
  const keyword = wardrobeSearchInput ? wardrobeSearchInput.value.trim().toLowerCase() : "";
  let firstVisibleCard = null;

  garmentCards.forEach((card) => {
    const typeMatch = currentWardrobeFilter === "all" || card.dataset.garmentType === currentWardrobeFilter;
    const stateMatch = currentWardrobeState === "all" || card.dataset.garmentState === currentWardrobeState;
    const searchableText = [
      card.dataset.garmentName,
      card.dataset.garmentCategory,
      card.dataset.garmentLocation,
      card.dataset.garmentStatus,
      card.dataset.garmentSeasons
    ].join(" ").toLowerCase();
    const keywordMatch = keyword === "" || searchableText.includes(keyword);
    const isVisible = typeMatch && stateMatch && keywordMatch;

    card.hidden = !isVisible;

    if (isVisible && !firstVisibleCard) {
      firstVisibleCard = card;
    }
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

function closeAddGarmentModal() {
  if (!addGarmentModal) {
    return;
  }

  const restoreFocusTarget = lastAddGarmentTrigger;

  addGarmentModal.classList.remove("is-open");
  addGarmentModal.hidden = true;
  addGarmentModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
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

  garmentCards.forEach((item) => item.classList.remove("active-card"));
  card.classList.add("active-card");

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
  const garmentEntries = Array.from(garmentCards).map((card) => ({
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
      card.dataset.garmentSeasons
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

const searchEntries = buildSearchEntries();

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

garmentCards.forEach((card) => {
  card.tabIndex = 0;

  card.addEventListener("click", () => {
    selectGarment(card.dataset.garmentId);
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectGarment(card.dataset.garmentId);
    }
  });
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

document.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  const openModalTrigger = target.closest("[data-open-add-modal]");
  if (openModalTrigger) {
    event.preventDefault();
    openAddGarmentModal(openModalTrigger);
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

applyView(getViewFromHash());
applySeason("spring");
selectGarment("oxford-blue-shirt");
filterWardrobeCards();
updateStorageProgress();
