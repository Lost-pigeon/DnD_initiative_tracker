window.addEventListener("DOMContentLoaded", () => {
  // ─────────────────────────────────────────────
  //  i18n engine
  // ─────────────────────────────────────────────

  const LANG_KEY = "dnd_lang";

  function detectLang() {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved) return saved;
    // Берём первый язык браузера, смотрим на префикс
    const browser = (navigator.languages?.[0] || navigator.language || "ru").toLowerCase();
    return browser.startsWith("ru") ? "ru" : "en";
  }

  let currentLang = detectLang();

  function t(key) {
    return window.I18N[currentLang][key] ?? window.I18N.ru[key] ?? key;
  }
  function tjs(key, ...args) {
    const fn = window.I18N[currentLang].js[key] ?? window.I18N.ru.js[key];
    return typeof fn === "function" ? fn(...args) : (fn ?? key);
  }

  function applyTranslations() {
    const lang = currentLang;
    document.documentElement.lang = lang;
    document.title = t("pageTitle");
    document.querySelector('meta[name="description"]')?.setAttribute("content", t("metaDescription"));

    // text content
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.dataset.i18n;
      const val = t(key);
      if (val !== undefined) el.textContent = val;
    });

    // attributes (data-i18n-attr="attrName:i18nKey,attrName2:i18nKey2")
    document.querySelectorAll("[data-i18n-attr]").forEach(el => {
      el.dataset.i18nAttr.split(",").forEach(pair => {
        const [attr, key] = pair.trim().split(":");
        const val = t(key.trim());
        if (val !== undefined) el.setAttribute(attr.trim(), val);
      });
    });

    // lang toggle button
    const btn = DOM.langToggle;
    if (btn) {
      btn.title = t("langToggleTitle");
      btn.setAttribute("aria-label", t("langToggleTitle"));
    }

    // re-render dynamic parts
    updatePreview();
    updateCardSizeHint();
    renderCardsList();
    syncEditModeUI();
  }

  function toggleLang() {
    currentLang = currentLang === "ru" ? "en" : "ru";
    localStorage.setItem(LANG_KEY, currentLang);
    applyTranslations();
  }

  const DOM = {
    imageInput: document.getElementById("imageInput"),
    imagePreview: document.getElementById("imagePreview"),
    nameInput: document.getElementById("nameInput"),
    acInput: document.getElementById("acInput"),
    speedInput: document.getElementById("speedInput"),
    cardWidthInput: document.getElementById("cardWidthInput"),
    cardSizeHint: document.getElementById("cardSizeHint"),
    masterSideOnlyInput: document.getElementById("masterSideOnlyInput"),
    holderGapInput: document.getElementById("holderGapInput"),
    holderGapSizeControl: document.getElementById("holderGapSizeControl"),
    holderGapSizeInput: document.getElementById("holderGapSizeInput"),
    addCardBtn: document.getElementById("addCardBtn"),
    clearFormBtn: document.getElementById("clearFormBtn"),
    cardsList: document.getElementById("cardsList"),
    downloadPdfBtn: document.getElementById("downloadPdfBtn"),
    easterEgg: document.getElementById("easterEgg"),
    cardPreview: document.getElementById("cardPreview"),
    formTitle: document.getElementById("form-title"),
    editBanner: document.getElementById("editBanner"),
    editBannerName: document.getElementById("editBannerName"),
    cancelEditBtn: document.getElementById("cancelEditBtn"),
    langToggle: document.getElementById("langToggle"),
  };

  const CONFIG = {
    cropAspectRatio: 35 / 40,
    croppedImageWidth: 350,
    croppedImageHeight: 400,
    pdfFileName: "dnd_cards.pdf",
    card: {
      baseWidth: 35,
      baseHeight: 120,
      baseCutLineTop: 60,
      baseHalfContentHeight: 60,
      baseHolderGapMm: 10,
      basePhotoFontSizePx: 10,
      basePhotoPaddingPx: 8,
      baseNameMinHeightPx: 14,
      baseNameFontSizePx: 14,
      baseNamePaddingTopPx: 2,
      baseNamePaddingXPx: 6,
      baseNamePaddingBottomPx: 1,
      baseNameEmptyPaddingLeftPx: 8,
      baseStatsGapPx: 10,
      baseStatsPaddingXPx: 8,
      baseStatsPaddingBottomPx: 6,
      baseStatSize: 12,
      baseStatOffset: -0.5,
      minWidth: 20,
      maxWidth: 50,
      step: 1,
      minHolderGapMm: 0,
      maxHolderGapMm: 30,
      holderGapStep: 1,
    },
    pdf: {
      orientation: "landscape",
      unit: "mm",
      format: "a4",
      startX: 2,
      startY: 2,
      gapX: 4,
      gapY: 4,
    },
    placeholders: {
      name:      () => tjs("nameEmpty"),
      photo:     () => tjs("photoPlaceholder"),
      emptyList: () => tjs("emptyList"),
    },
    icons: {
      ac: `
        <svg viewBox="0 0 512 512" aria-hidden="true" focusable="false">
          <path d="M202.182922,458.891754 C139.643829,421.766632 99.467316,368.142365 80.860298,298.339447 C75.441353,278.010651 72.752342,257.224396 72.712379,236.169357 C72.619720,187.347229 72.741943,138.524597 72.562012,89.702950 C72.544792,85.031189 73.967979,83.056190 78.465927,81.769997 C135.882355,65.351654 193.247803,48.754761 250.605942,32.133335 C254.064774,31.131018 257.279694,30.876293 260.816376,31.900331 C318.657593,48.648140 376.511963,65.351357 434.411285,81.896751 C438.812714,83.154510 440.033966,85.335152 440.021912,89.676849 C439.891479,136.665741 440.072968,183.655640 439.898102,230.644241 C439.659637,294.719788 420.202087,352.126404 378.955292,401.506226 C346.976868,439.790161 306.856750,466.288849 259.394867,481.691620 C256.952148,482.484375 254.872406,482.077911 252.622559,481.342010 C235.154419,475.628204 218.419662,468.272217 202.182922,458.891754 M315.604675,76.098251 C297.066040,70.751556 278.519379,65.432289 259.997681,60.027466 C257.335632,59.250648 254.874863,59.245289 252.188660,60.027908 C202.993744,74.360779 153.799255,88.696495 104.530891,102.773392 C100.181259,104.016159 99.247795,105.983055 99.259521,110.064667 C99.381065,152.392685 99.264153,194.721375 99.364037,237.049500 C99.412567,257.612061 102.157478,277.891296 108.066307,297.571259 C130.686478,372.910126 178.891266,424.757965 252.048859,453.533600 C255.232162,454.785706 258.025024,454.683594 261.170349,453.465942 C316.581360,432.013916 358.600800,395.338928 386.388031,342.766907 C403.539246,310.317719 412.678375,275.633606 412.843414,238.825027 C413.034698,196.164368 412.837677,153.501907 413.063049,110.841576 C413.090088,105.721794 411.404663,103.622498 406.550476,102.255135 C376.446533,93.775314 346.431793,84.978828 315.604675,76.098251 z"/>
        </svg>
      `,
      speed: `
        <svg viewBox="0 0 352 384" aria-hidden="true" focusable="false">
          <path d="M72.000038,295.760803 C132.322495,295.755249 192.144974,295.722015 251.967392,295.759155 C272.377258,295.771820 289.049042,308.172180 293.460876,328.075378 C298.148285,349.221588 288.437195,371.291931 264.479828,377.869629 C242.760162,383.833008 219.888474,371.696411 213.348633,350.813660 C211.868500,346.087372 211.553467,341.353394 211.343231,336.552063 C211.140747,331.927582 213.672989,328.817841 217.410980,329.082062 C221.736023,329.387848 223.190384,332.241943 223.365417,336.266632 C224.051300,352.036865 231.979263,362.829376 245.144470,366.105042 C261.246887,370.111542 277.542267,361.107605 281.486420,346.024506 C285.867157,329.271851 276.572601,313.385529 259.848389,308.907806 C256.553040,308.025513 253.231689,308.242859 249.917252,308.241547 C181.429703,308.214447 112.942139,308.219208 44.454586,308.216003 C42.788330,308.215942 41.119461,308.252899 39.456348,308.175293 C35.645260,307.997467 32.897945,306.274231 32.799011,302.231750 C32.693848,297.934723 35.461086,295.881897 39.507099,295.818604 C47.836857,295.688263 56.169876,295.766174 64.501556,295.759583 C66.834381,295.757751 69.167206,295.760223 72.000038,295.760803 z"/>
          <path d="M199.999969,111.256088 C176.505066,111.251968 153.510178,111.253662 130.515305,111.231079 C128.688843,111.229286 126.799095,111.325607 125.050194,110.908752 C121.995811,110.180748 120.049774,108.078461 120.031036,104.869797 C120.011703,101.558632 122.174095,99.676300 125.229187,99.073715 C127.163864,98.692116 129.208435,98.803329 131.203735,98.802780 C188.524323,98.787056 245.846664,98.536957 303.164337,98.943016 C318.917694,99.054626 332.036835,87.172943 334.118561,73.330391 C336.116119,60.047646 327.264252,44.798168 314.249908,41.354229 C292.940308,35.715145 274.770782,49.699745 275.210754,69.747963 C275.326691,75.030899 272.511505,78.234016 268.643707,78.065186 C265.150543,77.912712 262.879761,74.632370 262.758270,69.563141 C262.239990,47.935184 281.034180,28.557022 302.128601,27.502996 C327.905884,26.214985 346.662079,47.343628 346.425171,68.323662 C346.146606,92.991211 328.318909,111.185959 303.477264,111.235764 C269.151611,111.304588 234.825745,111.254738 199.999969,111.256088 z"/>
          <path d="M182.446487,88.921051 C174.010986,89.082512 166.020142,89.231453 158.029236,89.235641 C116.226410,89.257553 74.423561,89.243584 32.620728,89.237892 C30.789125,89.237640 28.944920,89.324921 27.128582,89.146935 C23.488379,88.790230 21.185123,86.677452 21.029455,83.058701 C20.865643,79.250626 23.407389,77.304161 26.940807,76.925308 C29.743120,76.624840 32.596050,76.764107 35.426517,76.763405 C82.725342,76.751640 130.024216,76.783295 177.322968,76.723389 C192.378006,76.704323 202.530930,68.931786 206.717270,54.556850 C210.988403,39.890766 202.128082,23.905758 187.536865,19.227924 C168.217636,13.034323 149.526016,26.932289 148.354813,47.279099 C148.307007,48.109421 148.348907,48.944508 148.325760,49.776730 C148.220657,53.558231 146.126144,55.895081 142.520798,55.971573 C138.815765,56.050186 136.963043,53.588070 136.657074,49.871490 C135.024521,30.041473 148.370636,11.605866 167.939667,6.736266 C189.962753,1.255992 213.050034,14.316305 218.170975,35.151779 C224.307556,60.119591 212.043472,81.642235 188.244720,87.648735 C186.472687,88.095970 184.676224,88.446342 182.446487,88.921051 z"/>
          <path d="M148.999969,286.231720 C109.866081,286.232239 71.232208,286.233185 32.598335,286.231537 C31.099802,286.231476 29.594110,286.295471 28.104136,286.175659 C24.289301,285.868835 21.801939,284.043274 21.723423,279.953857 C21.641226,275.672668 24.479841,274.251343 28.140720,273.823151 C29.127815,273.707703 30.136751,273.766388 31.135660,273.766357 C100.077133,273.763794 169.018600,273.763397 237.960068,273.762848 C238.126587,273.762848 238.293137,273.762726 238.459641,273.764496 C244.881653,273.832916 248.031219,275.896362 248.040192,280.040985 C248.049088,284.155701 244.877151,286.229004 238.424225,286.231171 C208.782806,286.241241 179.141388,286.233246 148.999969,286.231720 z"/>
          <path d="M88.997391,98.791489 C93.985855,98.803627 98.477219,98.732262 102.963448,98.852570 C106.953102,98.959557 109.934387,100.809898 109.906700,105.059898 C109.879242,109.275352 106.966682,111.212440 102.928108,111.216835 C76.159241,111.246002 49.390240,111.253670 22.621489,111.185753 C18.657303,111.175697 15.857677,109.376839 15.741642,104.971489 C15.639174,101.081139 18.199707,98.841942 23.155052,98.826157 C44.935871,98.756744 66.717026,98.793251 88.997391,98.791489 z"/>
        </svg>
      `,
    },
    easterEggNames: ["Иваныч", "Ivanich"],
  };

  let cropper = null;
  let cards = [];
  let currentPreviewPhotoDataUrl = "";
  // null = create mode; number = index of card being edited
  let editingIndex = null;

  init();

  // ─────────────────────────────────────────────
  //  Lazy-loading тяжёлых библиотек
  // ─────────────────────────────────────────────

  const CDN = {
    cropper:    "https://cdn.jsdelivr.net/npm/cropperjs@1.6.2/dist/cropper.min.js",
    html2canvas:"https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js",
    jspdf:      "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js",
  };

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  async function ensureCropper()     { await loadScript(CDN.cropper); }
  async function ensureHtml2canvas() { await loadScript(CDN.html2canvas); }
  async function ensureJsPdf()       { await loadScript(CDN.jspdf); }



  function init() {
    syncCardWidthInput();
    syncHolderGapSizeInput();
    bindEvents();
    applyTranslations();
  }

  function bindEvents() {
    DOM.imageInput.addEventListener("change", handleImageChange);
    DOM.nameInput.addEventListener("input", updatePreview);
    DOM.acInput.addEventListener("input", updatePreview);
    DOM.speedInput.addEventListener("input", updatePreview);
    DOM.cardWidthInput.addEventListener("input", handleCardWidthInput);
    DOM.cardWidthInput.addEventListener("blur", normalizeCardWidthInput);
    DOM.masterSideOnlyInput.addEventListener("change", updatePreview);
    DOM.holderGapInput.addEventListener("change", handleHolderGapToggle);
    DOM.holderGapSizeInput.addEventListener("input", handleHolderGapSizeInput);
    DOM.holderGapSizeInput.addEventListener("blur", normalizeHolderGapSizeInput);
    DOM.addCardBtn.addEventListener("click", handleAddOrSaveCard);
    DOM.clearFormBtn.addEventListener("click", handleClearForm);
    DOM.downloadPdfBtn.addEventListener("click", handleDownloadPdf);
    DOM.cancelEditBtn.addEventListener("click", cancelEdit);
    DOM.langToggle.addEventListener("click", toggleLang);
  }

  // ─────────────────────────────────────────────
  //  Edit mode
  // ─────────────────────────────────────────────

  function syncEditModeUI() {
    if (editingIndex !== null) {
      DOM.addCardBtn.textContent = tjs("btnSave");
      DOM.cancelEditBtn.hidden = false;
      DOM.editBanner.hidden = false;
    } else {
      DOM.addCardBtn.textContent = tjs("btnAdd");
      DOM.cancelEditBtn.hidden = true;
      DOM.editBanner.hidden = true;
    }
  }

  async function enterEditMode(index) {
    editingIndex = index;
    const card = cards[index];

    DOM.nameInput.value = card.name || "";
    DOM.acInput.value = card.ac || "";
    DOM.speedInput.value = card.speed || "";
    DOM.cardWidthInput.value = formatMetricNumber(card.cardWidth ?? CONFIG.card.baseWidth);
    DOM.masterSideOnlyInput.checked = Boolean(card.masterSideOnly);
    DOM.holderGapInput.checked = Boolean(card.holderGap);
    DOM.holderGapSizeInput.value = formatMetricNumber(card.holderGapSize ?? CONFIG.card.baseHolderGapMm);

    currentPreviewPhotoDataUrl = card.photoDataUrl || "";

    // Уничтожаем старый cropper
    if (cropper) {
      cropper.destroy();
      cropper = null;
    }
    DOM.imageInput.value = "";

    // Если у карточки есть фото — загружаем его обратно в cropper
    if (card.photoDataUrl) {
      await ensureCropper();
      DOM.imagePreview.src = card.photoDataUrl;
      // Ждём загрузки изображения перед инициализацией Cropper
      await new Promise(resolve => {
        if (DOM.imagePreview.complete) { resolve(); return; }
        DOM.imagePreview.onload = resolve;
      });
      cropper = new Cropper(DOM.imagePreview, {
        aspectRatio: CONFIG.cropAspectRatio,
        viewMode: 1,
        ready: refreshPreviewPhotoFromCropper,
        cropend: refreshPreviewPhotoFromCropper,
      });
    } else {
      DOM.imagePreview.src = "";
    }

    DOM.addCardBtn.classList.add("btn-editing");
    DOM.editBannerName.textContent = card.name || tjs("unnamed");
    syncEditModeUI();

    updateHolderGapSizeState();
    updatePreview();
    renderCardsList();

    DOM.formTitle.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function cancelEdit() {
    exitEditMode();
    handleClearForm();
  }

  function exitEditMode() {
    editingIndex = null;
    DOM.addCardBtn.classList.remove("btn-editing");
    syncEditModeUI();
    renderCardsList();
  }

  // ─────────────────────────────────────────────
  //  Card width / holder gap helpers
  // ─────────────────────────────────────────────

  function handleCardWidthInput() { updatePreview(); }
  function normalizeCardWidthInput() { syncCardWidthInput(); updatePreview(); }
  function handleHolderGapToggle() { updateHolderGapSizeState(); updatePreview(); }
  function handleHolderGapSizeInput() { updatePreview(); }
  function normalizeHolderGapSizeInput() { syncHolderGapSizeInput(); updatePreview(); }

  function syncCardWidthInput() {
    DOM.cardWidthInput.value = formatMetricNumber(getSelectedCardWidth());
  }

  function syncHolderGapSizeInput() {
    DOM.holderGapSizeInput.value = formatMetricNumber(getSelectedHolderGapSize());
  }

  function updateHolderGapSizeState() {
    const isEnabled = DOM.holderGapInput.checked;
    DOM.holderGapSizeControl.hidden = !isEnabled;
    DOM.holderGapSizeInput.disabled = !isEnabled;
  }

  function getSelectedCardWidth() {
    const rawValue = Number.parseFloat(DOM.cardWidthInput.value);
    return clampNumber(
      Number.isFinite(rawValue) ? rawValue : CONFIG.card.baseWidth,
      CONFIG.card.minWidth,
      CONFIG.card.maxWidth
    );
  }

  function getSelectedHolderGapSize() {
    const rawValue = Number.parseFloat(DOM.holderGapSizeInput.value);
    return clampNumber(
      Number.isFinite(rawValue) ? rawValue : CONFIG.card.baseHolderGapMm,
      CONFIG.card.minHolderGapMm,
      CONFIG.card.maxHolderGapMm
    );
  }

  // ─────────────────────────────────────────────
  //  Card metrics & PDF layout
  // ─────────────────────────────────────────────

  function getCardScale(cardWidth = getSelectedCardWidth()) {
    return cardWidth / CONFIG.card.baseWidth;
  }

  function getCardMetrics(card = {}) {
    const cardWidth = card.cardWidth ?? getSelectedCardWidth();
    const holderGapSize = card.holderGapSize ?? getSelectedHolderGapSize();
    const scale = getCardScale(cardWidth);
    const heightMm = CONFIG.card.baseHeight * scale;
    const cutLineTopMm = CONFIG.card.baseCutLineTop * scale;

    return {
      widthMm: cardWidth,
      heightMm,
      heightWithHolderMm: heightMm + holderGapSize * 2,
      cutLineTopMm,
      cutLineTopWithHolderMm: cutLineTopMm + holderGapSize,
      halfContentHeightMm: CONFIG.card.baseHalfContentHeight * scale,
      gapHeightMm: holderGapSize,
      holderGapMm: holderGapSize,
      photoFontSizePx: CONFIG.card.basePhotoFontSizePx * scale,
      photoPaddingPx: CONFIG.card.basePhotoPaddingPx * scale,
      nameMinHeightPx: CONFIG.card.baseNameMinHeightPx * scale,
      nameFontSizePx: CONFIG.card.baseNameFontSizePx * scale,
      namePaddingTopPx: CONFIG.card.baseNamePaddingTopPx * scale,
      namePaddingXPx: CONFIG.card.baseNamePaddingXPx * scale,
      namePaddingBottomPx: CONFIG.card.baseNamePaddingBottomPx * scale,
      nameEmptyPaddingLeftPx: CONFIG.card.baseNameEmptyPaddingLeftPx * scale,
      statsGapPx: CONFIG.card.baseStatsGapPx * scale,
      statsPaddingXPx: CONFIG.card.baseStatsPaddingXPx * scale,
      statsPaddingBottomPx: CONFIG.card.baseStatsPaddingBottomPx * scale,
      statSizeMm: CONFIG.card.baseStatSize * scale,
      statOffsetMm: CONFIG.card.baseStatOffset * scale,
    };
  }

  function getPageLayoutMetrics() {
    return {
      startX: CONFIG.pdf.startX,
      startY: CONFIG.pdf.startY,
      gapX: CONFIG.pdf.gapX,
      gapY: CONFIG.pdf.gapY,
    };
  }

  function createPdfRow() { return { cards: [], width: 0, height: 0 }; }
  function createPdfPage() { return { rows: [], contentHeight: 0 }; }

  function getCenteredOffset(containerSize, contentSize, minimumOffset) {
    return Math.max(minimumOffset, (containerSize - contentSize) / 2);
  }

  function commitPdfRow(page, row, layout) {
    if (!row.cards.length) return;
    if (page.rows.length) page.contentHeight += layout.gapY;
    page.rows.push(row);
    page.contentHeight += row.height;
  }

  function getProjectedPageHeight(page, nextRowHeight, layout) {
    return page.contentHeight + (page.rows.length ? layout.gapY : 0) + nextRowHeight;
  }

  function buildPdfPages(cardsToPlace, pageWidth, pageHeight, layout) {
    const pages = [];
    const maxContentWidth = Math.max(pageWidth - layout.startX * 2, 0);
    const maxContentHeight = Math.max(pageHeight - layout.startY * 2, 0);
    let currentPage = createPdfPage();
    let currentRow = createPdfRow();

    cardsToPlace.forEach((card) => {
      const cardEntry = {
        card,
        width: getRenderedCardWidth(card),
        height: getRenderedCardHeight(card),
      };
      const nextRowWidth = currentRow.cards.length
        ? currentRow.width + layout.gapX + cardEntry.width
        : cardEntry.width;
      const nextRowHeight = currentRow.cards.length
        ? Math.max(currentRow.height, cardEntry.height)
        : cardEntry.height;
      const fitsCurrentRowWidth = nextRowWidth <= maxContentWidth || !currentRow.cards.length;
      const fitsCurrentPageHeight =
        getProjectedPageHeight(currentPage, nextRowHeight, layout) <= maxContentHeight ||
        (!currentPage.rows.length && !currentRow.cards.length);

      if (fitsCurrentRowWidth && fitsCurrentPageHeight) {
        currentRow.cards.push(cardEntry);
        currentRow.width = nextRowWidth;
        currentRow.height = nextRowHeight;
        return;
      }

      commitPdfRow(currentPage, currentRow, layout);
      currentRow = createPdfRow();

      const fitsNextRowOnCurrentPage =
        getProjectedPageHeight(currentPage, cardEntry.height, layout) <= maxContentHeight ||
        !currentPage.rows.length;

      if (!fitsNextRowOnCurrentPage) {
        pages.push(currentPage);
        currentPage = createPdfPage();
      }

      currentRow.cards.push(cardEntry);
      currentRow.width = cardEntry.width;
      currentRow.height = cardEntry.height;
    });

    commitPdfRow(currentPage, currentRow, layout);
    if (currentPage.rows.length) pages.push(currentPage);
    return pages;
  }

  // ─────────────────────────────────────────────
  //  DOM / preview helpers
  // ─────────────────────────────────────────────

  function applyCardMetricsToElement(element, card = {}) {
    const metrics = getCardMetrics(card);
    element.style.setProperty("--card-width", formatMillimeters(metrics.widthMm));
    element.style.setProperty("--card-height", formatMillimeters(metrics.heightMm));
    element.style.setProperty("--card-height-holder", formatMillimeters(metrics.heightWithHolderMm));
    element.style.setProperty("--card-cut-line-top", formatMillimeters(metrics.cutLineTopMm));
    element.style.setProperty("--card-cut-line-top-holder", formatMillimeters(metrics.cutLineTopWithHolderMm));
    element.style.setProperty("--card-half-content-height", formatMillimeters(metrics.halfContentHeightMm));
    element.style.setProperty("--card-gap-height", formatMillimeters(metrics.gapHeightMm));
    element.style.setProperty("--card-photo-font-size", formatPixels(metrics.photoFontSizePx));
    element.style.setProperty("--card-photo-padding", formatPixels(metrics.photoPaddingPx));
    element.style.setProperty("--card-name-min-height", formatPixels(metrics.nameMinHeightPx));
    element.style.setProperty("--card-name-font-size", formatPixels(metrics.nameFontSizePx));
    element.style.setProperty("--card-name-padding-top", formatPixels(metrics.namePaddingTopPx));
    element.style.setProperty("--card-name-padding-x", formatPixels(metrics.namePaddingXPx));
    element.style.setProperty("--card-name-padding-bottom", formatPixels(metrics.namePaddingBottomPx));
    element.style.setProperty("--card-name-empty-padding-left", formatPixels(metrics.nameEmptyPaddingLeftPx));
    element.style.setProperty("--card-stats-gap", formatPixels(metrics.statsGapPx));
    element.style.setProperty("--card-stats-padding-x", formatPixels(metrics.statsPaddingXPx));
    element.style.setProperty("--card-stats-padding-bottom", formatPixels(metrics.statsPaddingBottomPx));
    element.style.setProperty("--card-stat-size", formatMillimeters(metrics.statSizeMm));
    element.style.setProperty("--card-stat-offset", formatMillimeters(metrics.statOffsetMm));
  }

  function updateCardSizeHint(card = {}) {
    const metrics = getCardMetrics(card);
    DOM.cardSizeHint.textContent = tjs(
      "cardSizeHint",
      formatMetricNumber(metrics.heightMm),
      formatMetricNumber(metrics.holderGapMm),
      formatMetricNumber(metrics.heightWithHolderMm)
    );
  }

  function getFormData() {
    return {
      name: DOM.nameInput.value.trim(),
      ac: DOM.acInput.value.trim(),
      speed: DOM.speedInput.value.trim(),
      cardWidth: getSelectedCardWidth(),
      masterSideOnly: DOM.masterSideOnlyInput.checked,
      holderGap: DOM.holderGapInput.checked,
      holderGapSize: getSelectedHolderGapSize(),
    };
  }

  async function handleImageChange(event) {
    currentPreviewPhotoDataUrl = "";
    updatePreview();

    const file = event.target.files?.[0];
    if (!file) return;

    await ensureCropper();

    const reader = new FileReader();
    reader.onload = () => {
      DOM.imagePreview.src = reader.result;
      if (cropper) cropper.destroy();
      cropper = new Cropper(DOM.imagePreview, {
        aspectRatio: CONFIG.cropAspectRatio,
        viewMode: 1,
        ready: refreshPreviewPhotoFromCropper,
        cropend: refreshPreviewPhotoFromCropper,
      });
    };
    reader.readAsDataURL(file);
  }

  function updatePreview() {
    const previewCard = getPreviewCardData();
    DOM.cardPreview.className = buildCardPreviewClassName(previewCard);
    applyCardMetricsToElement(DOM.cardPreview, previewCard);
    DOM.cardPreview.innerHTML = buildCardMarkup(previewCard);
    updateHolderGapSizeState();
    updateCardSizeHint(previewCard);
    toggleEasterEgg(previewCard.name);
  }

  function refreshPreviewPhotoFromCropper() {
    currentPreviewPhotoDataUrl = getCroppedPhotoDataUrl() || "";
    updatePreview();
  }

  function getPreviewCardData() {
    const { name, ac, speed, cardWidth, masterSideOnly, holderGap, holderGapSize } = getFormData();
    return { name, ac, speed, cardWidth, masterSideOnly, holderGap, holderGapSize, photoDataUrl: currentPreviewPhotoDataUrl };
  }

  function toggleEasterEgg(name) {
    DOM.easterEgg.style.display = CONFIG.easterEggNames.includes(name) ? "block" : "none";
  }

  function getCroppedPhotoDataUrl() {
    if (!cropper) return null;
    const canvas = cropper.getCroppedCanvas({ width: CONFIG.croppedImageWidth, height: CONFIG.croppedImageHeight });
    return canvas.toDataURL("image/png");
  }

  function buildCardPreviewClassName(card) {
    return `card-preview${card.holderGap ? " with-holder-gap" : ""}`;
  }

  function getRenderedCardWidth(card) { return getCardMetrics(card).widthMm; }
  function getRenderedCardHeight(card) {
    const metrics = getCardMetrics(card);
    return card.holderGap ? metrics.heightWithHolderMm : metrics.heightMm;
  }

  // ─────────────────────────────────────────────
  //  Add / Save card
  // ─────────────────────────────────────────────

  function handleAddOrSaveCard() {
    const { name, ac, speed, cardWidth, masterSideOnly, holderGap, holderGapSize } = getFormData();
    const photoDataUrl = currentPreviewPhotoDataUrl || getCroppedPhotoDataUrl() || "";

    const cardData = { name, ac, speed, cardWidth, masterSideOnly, holderGap, holderGapSize, photoDataUrl };

    if (editingIndex !== null) {
      // Overwrite the existing card in-place
      cards[editingIndex] = cardData;
      exitEditMode();
    } else {
      cards.push(cardData);
    }

    updatePreview();
    renderCardsList();
  }

  // ─────────────────────────────────────────────
  //  Cards list rendering
  // ─────────────────────────────────────────────

  function renderCardsList() {
    DOM.cardsList.innerHTML = "";

    if (!cards.length) {
      const empty = document.createElement("span");
      empty.className = "cards-list-empty";
      empty.textContent = tjs("emptyList");
      DOM.cardsList.appendChild(empty);
      return;
    }

    cards.forEach((card, index) => {
      const row = document.createElement("div");
      row.className = "cards-list-item" + (index === editingIndex ? " is-editing" : "");

      const thumb = document.createElement("div");
      thumb.className = "cards-list-thumb";
      if (card.photoDataUrl) {
        const img = document.createElement("img");
        img.src = card.photoDataUrl;
        img.alt = "";
        thumb.appendChild(img);
      } else {
        thumb.textContent = "?";
      }

      const label = document.createElement("span");
      label.className = "cards-list-label";
      label.textContent = formatCardLabel(card);

      if (hasEmptyFields(card)) {
        const badge = document.createElement("span");
        badge.className = "mini-badge";
        badge.textContent = tjs("emptyFields");
        label.appendChild(badge);
      }

      if (index === editingIndex) {
        const editingBadge = document.createElement("span");
        editingBadge.className = "mini-badge mini-badge-active";
        editingBadge.textContent = tjs("badgeEditing");
        label.appendChild(editingBadge);
      }

      const actions = document.createElement("div");
      actions.className = "cards-list-actions";

      const editBtn = document.createElement("button");
      editBtn.className = "btn btn-ghost btn-icon";
      editBtn.title = currentLang === "ru" ? "Редактировать" : "Edit";
      editBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
      editBtn.addEventListener("click", () => enterEditMode(index));

      const removeBtn = document.createElement("button");
      removeBtn.className = "btn btn-ghost btn-icon btn-icon-danger";
      removeBtn.title = currentLang === "ru" ? "Удалить" : "Delete";
      removeBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`;
      removeBtn.addEventListener("click", () => removeCard(index));

      actions.append(editBtn, removeBtn);
      row.append(thumb, label, actions);
      DOM.cardsList.appendChild(row);
    });
  }

  function formatCardLabel(card) {
    const dash = tjs("labelDash");
    const sideLabel = card.masterSideOnly ? tjs("oneSide") : "";
    const sizeLabel = ` · ${formatMetricNumber(card.cardWidth ?? CONFIG.card.baseWidth)}${tjs("mmSuffix")}`;
    const holderGapLabel = card.holderGap
      ? tjs("holderSuffix", formatMetricNumber(card.holderGapSize ?? CONFIG.card.baseHolderGapMm))
      : "";
    const unnamed = tjs("unnamed");
    return `${card.name || unnamed} · ${t("labelAC")} ${card.ac || dash} · ${t("labelSpeed")} ${card.speed || dash}${sizeLabel}${sideLabel}${holderGapLabel}`;
  }

  function hasEmptyFields(card) { return !card.name || !card.ac || !card.speed; }

  function removeCard(index) {
    // If we're editing the card that's being deleted, cancel edit mode first
    if (editingIndex === index) exitEditMode();
    // If deleted card is before the editing index, shift the index down
    else if (editingIndex !== null && index < editingIndex) editingIndex--;

    cards.splice(index, 1);
    renderCardsList();
  }

  // ─────────────────────────────────────────────
  //  Clear form
  // ─────────────────────────────────────────────

  function handleClearForm() {
    DOM.nameInput.value = "";
    DOM.acInput.value = "";
    DOM.speedInput.value = "";
    DOM.cardWidthInput.value = CONFIG.card.baseWidth;
    DOM.masterSideOnlyInput.checked = false;
    DOM.holderGapInput.checked = false;
    DOM.holderGapSizeInput.value = CONFIG.card.baseHolderGapMm;
    currentPreviewPhotoDataUrl = "";
    DOM.imageInput.value = "";

    if (cropper) {
      cropper.destroy();
      cropper = null;
    }
    DOM.imagePreview.src = "";

    updatePreview();
  }

  // ─────────────────────────────────────────────
  //  PDF export
  // ─────────────────────────────────────────────

  async function handleDownloadPdf() {
    if (!cards.length) {
      alert(tjs("noCards"));
      return;
    }

    await ensureHtml2canvas();
    await ensureJsPdf();

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: CONFIG.pdf.orientation,
      unit: CONFIG.pdf.unit,
      format: CONFIG.pdf.format,
    });

    const layout = getPageLayoutMetrics();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const pages = buildPdfPages(cards, pageWidth, pageHeight, layout);

    for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
      if (pageIndex > 0) doc.addPage();

      const page = pages[pageIndex];
      let currentY = getCenteredOffset(pageHeight, page.contentHeight, layout.startY);

      for (const row of page.rows) {
        let currentX = getCenteredOffset(pageWidth, row.width, layout.startX);

        for (const cardEntry of row.cards) {
          const imgData = await renderCardToDataUrl(cardEntry.card);
          doc.addImage(imgData, "PNG", currentX, currentY, cardEntry.width, cardEntry.height);
          currentX += cardEntry.width + layout.gapX;
        }

        currentY += row.height + layout.gapY;
      }
    }

    doc.save(CONFIG.pdfFileName);
  }

  async function renderCardToDataUrl(card) {
    await ensureHtml2canvas();
    const temp = document.createElement("div");
    temp.className = `${buildCardPreviewClassName(card)} card-preview-export`;
    applyCardMetricsToElement(temp, card);
    temp.style.position = "fixed";
    temp.style.left = "-10000px";
    temp.style.top = "0";
    temp.innerHTML = buildCardMarkup(card);

    document.body.appendChild(temp);
    const canvas = await html2canvas(temp, { backgroundColor: "#ffffff", scale: 2 });
    document.body.removeChild(temp);

    return canvas.toDataURL("image/png");
  }

  // ─────────────────────────────────────────────
  //  Card markup builders
  // ─────────────────────────────────────────────

  function buildCardMarkup(card) {
    const detailsOnlyOnOneSide = Boolean(card.masterSideOnly);
    const hiddenDetailsCard = detailsOnlyOnOneSide
      ? { ...card, name: "", ac: "", speed: "" }
      : card;

    return `
      <div class="card-cut-line"></div>
      <div class="card-half top">${buildCardHalfMarkup(hiddenDetailsCard)}</div>
      <div class="card-half bottom">${buildCardHalfMarkup(card)}</div>
    `;
  }

  function buildCardHalfMarkup(card) {
    const safeName = escapeHtml(card.name);
    const safePhotoUrl = escapeHtml(card.photoDataUrl || "");
    const photoMarkup = safePhotoUrl
      ? `<img src="${safePhotoUrl}" alt="Фото персонажа" />`
      : `<span class="card-photo-placeholder">${CONFIG.placeholders.photo()}</span>`;

    return `
      <div class="card-half-content">
        <div class="card-photo">${photoMarkup}</div>
        <div class="card-name${card.name ? "" : " empty"}">${safeName || CONFIG.placeholders.name()}</div>
        <div class="card-stats">
          ${buildStatMarkup("shield", card.ac, CONFIG.icons.ac)}
          ${buildStatMarkup("speed", card.speed, CONFIG.icons.speed)}
        </div>
      </div>
      ${card.holderGap ? `<div class="card-bottom-gap" aria-hidden="true"></div>` : ""}
    `;
  }

  function buildStatMarkup(className, value, iconSrc) {
    const hasValue = Boolean(value);
    return `
      <div class="${className}${hasValue ? "" : " stat-empty"}">
        ${hasValue
          ? `<span>${escapeHtml(value)}</span>${iconSrc}`
          : `<span></span>${iconSrc}`
        }
      </div>
    `;
  }

  // ─────────────────────────────────────────────
  //  Utilities
  // ─────────────────────────────────────────────

  function clampNumber(value, min, max) { return Math.min(Math.max(value, min), max); }
  function formatMillimeters(value) { return `${Number.parseFloat(value.toFixed(2))}mm`; }
  function formatPixels(value) { return `${Number.parseFloat(value.toFixed(2))}px`; }
  function formatMetricNumber(value) { return String(Number.parseFloat(value.toFixed(2))); }

  function escapeHtml(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }
});
