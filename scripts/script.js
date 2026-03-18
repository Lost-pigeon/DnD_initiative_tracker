window.addEventListener("DOMContentLoaded", () => {
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
      name: "____________________",
      photo: "Фото персонажа",
      emptyList: "Пока нет карточек в листе.",
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
    easterEggName: "Иваныч",
  };

  let cropper = null;
  let cards = [];
  let currentPreviewPhotoDataUrl = "";

  init();

  function init() {
    syncCardWidthInput();
    syncHolderGapSizeInput();
    bindEvents();
    updatePreview();
    renderCardsList();
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
    DOM.addCardBtn.addEventListener("click", handleAddCard);
    DOM.clearFormBtn.addEventListener("click", handleClearForm);
    DOM.downloadPdfBtn.addEventListener("click", handleDownloadPdf);
  }

  function handleCardWidthInput() {
    updatePreview();
  }

  function normalizeCardWidthInput() {
    syncCardWidthInput();
    updatePreview();
  }

  function handleHolderGapToggle() {
    updateHolderGapSizeState();
    updatePreview();
  }

  function handleHolderGapSizeInput() {
    updatePreview();
  }

  function normalizeHolderGapSizeInput() {
    syncHolderGapSizeInput();
    updatePreview();
  }

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
      nameEmptyPaddingLeftPx:
        CONFIG.card.baseNameEmptyPaddingLeftPx * scale,
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

  function applyCardMetricsToElement(element, card = {}) {
    const metrics = getCardMetrics(card);

    element.style.setProperty("--card-width", formatMillimeters(metrics.widthMm));
    element.style.setProperty("--card-height", formatMillimeters(metrics.heightMm));
    element.style.setProperty(
      "--card-height-holder",
      formatMillimeters(metrics.heightWithHolderMm)
    );
    element.style.setProperty(
      "--card-cut-line-top",
      formatMillimeters(metrics.cutLineTopMm)
    );
    element.style.setProperty(
      "--card-cut-line-top-holder",
      formatMillimeters(metrics.cutLineTopWithHolderMm)
    );
    element.style.setProperty(
      "--card-half-content-height",
      formatMillimeters(metrics.halfContentHeightMm)
    );
    element.style.setProperty(
      "--card-gap-height",
      formatMillimeters(metrics.gapHeightMm)
    );
    element.style.setProperty(
      "--card-photo-font-size",
      formatPixels(metrics.photoFontSizePx)
    );
    element.style.setProperty(
      "--card-photo-padding",
      formatPixels(metrics.photoPaddingPx)
    );
    element.style.setProperty(
      "--card-name-min-height",
      formatPixels(metrics.nameMinHeightPx)
    );
    element.style.setProperty(
      "--card-name-font-size",
      formatPixels(metrics.nameFontSizePx)
    );
    element.style.setProperty(
      "--card-name-padding-top",
      formatPixels(metrics.namePaddingTopPx)
    );
    element.style.setProperty(
      "--card-name-padding-x",
      formatPixels(metrics.namePaddingXPx)
    );
    element.style.setProperty(
      "--card-name-padding-bottom",
      formatPixels(metrics.namePaddingBottomPx)
    );
    element.style.setProperty(
      "--card-name-empty-padding-left",
      formatPixels(metrics.nameEmptyPaddingLeftPx)
    );
    element.style.setProperty(
      "--card-stats-gap",
      formatPixels(metrics.statsGapPx)
    );
    element.style.setProperty(
      "--card-stats-padding-x",
      formatPixels(metrics.statsPaddingXPx)
    );
    element.style.setProperty(
      "--card-stats-padding-bottom",
      formatPixels(metrics.statsPaddingBottomPx)
    );
    element.style.setProperty(
      "--card-stat-size",
      formatMillimeters(metrics.statSizeMm)
    );
    element.style.setProperty(
      "--card-stat-offset",
      formatMillimeters(metrics.statOffsetMm)
    );
  }

  function updateCardSizeHint(card = {}) {
    const metrics = getCardMetrics(card);
    DOM.cardSizeHint.textContent = `Высота карточки: ${formatMetricNumber(
      metrics.heightMm
    )} мм, с держателем (${formatMetricNumber(
      metrics.holderGapMm
    )} мм): ${formatMetricNumber(
      metrics.heightWithHolderMm
    )} мм.`;
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

  function handleImageChange(event) {
    currentPreviewPhotoDataUrl = "";
    updatePreview();

    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      DOM.imagePreview.src = reader.result;

      if (cropper) {
        cropper.destroy();
      }

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
    // Keep preview and exported cards in sync with the current crop area.
    currentPreviewPhotoDataUrl = getCroppedPhotoDataUrl() || "";
    updatePreview();
  }

  function getPreviewCardData() {
    const { name, ac, speed, cardWidth, masterSideOnly, holderGap, holderGapSize } =
      getFormData();

    return {
      name,
      ac,
      speed,
      cardWidth,
      masterSideOnly,
      holderGap,
      holderGapSize,
      photoDataUrl: currentPreviewPhotoDataUrl,
    };
  }

  function toggleEasterEgg(name) {
    DOM.easterEgg.style.display =
      name === CONFIG.easterEggName ? "block" : "none";
  }

  function getCroppedPhotoDataUrl() {
    if (!cropper) return null;

    const canvas = cropper.getCroppedCanvas({
      width: CONFIG.croppedImageWidth,
      height: CONFIG.croppedImageHeight,
    });

    return canvas.toDataURL("image/png");
  }

  function buildCardPreviewClassName(card) {
    return `card-preview${card.holderGap ? " with-holder-gap" : ""}`;
  }

  function getRenderedCardWidth(card) {
    return getCardMetrics(card).widthMm;
  }

  function getRenderedCardHeight(card) {
    const metrics = getCardMetrics(card);

    return card.holderGap ? metrics.heightWithHolderMm : metrics.heightMm;
  }

  function handleAddCard() {
    const {
      name,
      ac,
      speed,
      cardWidth,
      masterSideOnly,
      holderGap,
      holderGapSize,
    } = getFormData();
    const photoDataUrl = currentPreviewPhotoDataUrl || getCroppedPhotoDataUrl();

    cards.push({
      name,
      ac,
      speed,
      cardWidth,
      masterSideOnly,
      holderGap,
      holderGapSize,
      photoDataUrl,
    });

    updatePreview();
    renderCardsList();
  }

  function renderCardsList() {
    DOM.cardsList.innerHTML = "";

    if (!cards.length) {
      DOM.cardsList.innerHTML = `
        <span style="font-size:12px;color:#6b7280;">
          ${CONFIG.placeholders.emptyList}
        </span>
      `;
      return;
    }

    cards.forEach((card, index) => {
      const row = document.createElement("div");
      row.className = "cards-list-item";

      const label = document.createElement("span");
      label.textContent = formatCardLabel(card);

      if (hasEmptyFields(card)) {
        const badge = document.createElement("span");
        badge.className = "mini-badge";
        badge.textContent = "есть пустые поля";
        label.appendChild(badge);
      }

      const removeBtn = document.createElement("button");
      removeBtn.className = "btn btn-ghost";
      removeBtn.style.padding = "4px 10px";
      removeBtn.style.fontSize = "11px";
      removeBtn.textContent = "Удалить";
      removeBtn.addEventListener("click", () => removeCard(index));

      row.append(label, removeBtn);
      DOM.cardsList.appendChild(row);
    });
  }

  function formatCardLabel(card) {
    const sideLabel = card.masterSideOnly ? " | одна сторона" : "";
    const sizeLabel = ` | ${formatMetricNumber(
      card.cardWidth ?? CONFIG.card.baseWidth
    )} мм`;
    const holderGapLabel = card.holderGap
      ? ` | держатель ${formatMetricNumber(
          card.holderGapSize ?? CONFIG.card.baseHolderGapMm
        )} мм`
      : "";

    return `${card.name || "Без имени"} | КД ${card.ac || "—"} | Скорость ${
      card.speed || "—"
    }${sizeLabel}${sideLabel}${holderGapLabel}`;
  }

  function hasEmptyFields(card) {
    return !card.name || !card.ac || !card.speed;
  }

  function removeCard(index) {
    cards.splice(index, 1);
    renderCardsList();
  }

  function handleClearForm() {
    DOM.nameInput.value = "";
    DOM.acInput.value = "";
    DOM.speedInput.value = "";
    DOM.cardWidthInput.value = CONFIG.card.baseWidth;
    DOM.masterSideOnlyInput.checked = false;
    DOM.holderGapInput.checked = false;
    DOM.holderGapSizeInput.value = CONFIG.card.baseHolderGapMm;

    updatePreview();

    if (cropper) {
      cropper.clear();
    }
  }

  async function handleDownloadPdf() {
    if (!cards.length) {
      alert("Добавьте хотя бы одну карточку в лист.");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: CONFIG.pdf.orientation,
      unit: CONFIG.pdf.unit,
      format: CONFIG.pdf.format,
    });

    const layout = getPageLayoutMetrics();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageRightLimit = pageWidth - layout.startX;
    const pageBottomLimit = pageHeight - layout.startY;

    let currentX = layout.startX;
    let currentY = layout.startY;
    let currentRowHeight = 0;

    for (let i = 0; i < cards.length; i++) {
      const cardWidth = getRenderedCardWidth(cards[i]);
      const cardHeight = getRenderedCardHeight(cards[i]);

      if (currentX > layout.startX && currentX + cardWidth > pageRightLimit) {
        currentX = layout.startX;
        currentY += currentRowHeight + layout.gapY;
        currentRowHeight = 0;
      }

      if (currentY > layout.startY && currentY + cardHeight > pageBottomLimit) {
        doc.addPage();
        currentX = layout.startX;
        currentY = layout.startY;
        currentRowHeight = 0;
      }

      const imgData = await renderCardToDataUrl(cards[i]);

      doc.addImage(
        imgData,
        "PNG",
        currentX,
        currentY,
        cardWidth,
        cardHeight
      );

      currentRowHeight = Math.max(currentRowHeight, cardHeight);
      currentX += cardWidth + layout.gapX;
    }

    doc.save(CONFIG.pdfFileName);
  }

  async function renderCardToDataUrl(card) {
    const temp = document.createElement("div");

    temp.className = `${buildCardPreviewClassName(card)} card-preview-export`;
    applyCardMetricsToElement(temp);
    temp.style.position = "fixed";
    temp.style.left = "-10000px";
    temp.style.top = "0";
    // Render off-screen so html2canvas captures the same markup as the live preview.
    temp.innerHTML = buildCardMarkup(card);

    document.body.appendChild(temp);

    const canvas = await html2canvas(temp, {
      backgroundColor: "#ffffff",
      scale: 2,
    });

    document.body.removeChild(temp);

    return canvas.toDataURL("image/png");
  }

  function buildCardMarkup(card) {
    const detailsOnlyOnOneSide = Boolean(card.masterSideOnly);
    const hiddenDetailsCard = detailsOnlyOnOneSide
      ? {
          // Leave the structure visible for handwriting while keeping entered values
          // only on the master's side of the card.
          ...card,
          name: "",
          ac: "",
          speed: "",
        }
      : card;

    return `
      <div class="card-cut-line"></div>
      <div class="card-half top">
        ${buildCardHalfMarkup(hiddenDetailsCard)}
      </div>
      <div class="card-half bottom">
        ${buildCardHalfMarkup(card)}
      </div>
    `;
  }

  function buildCardHalfMarkup(card) {
    const safeName = escapeHtml(card.name);
    const safePhotoUrl = escapeHtml(card.photoDataUrl || "");
    const photoMarkup = safePhotoUrl
      ? `<img src="${safePhotoUrl}" alt="Фото персонажа" />`
      : `<span class="card-photo-placeholder">${CONFIG.placeholders.photo}</span>`;

    return `
      <div class="card-half-content">
        <div class="card-photo">
          ${photoMarkup}
        </div>
        <div class="card-name${card.name ? "" : " empty"}">
          ${safeName || CONFIG.placeholders.name}
        </div>
        <div class="card-stats">
          ${buildStatMarkup("shield", card.ac, CONFIG.icons.ac)}
          ${buildStatMarkup("speed", card.speed, CONFIG.icons.speed)}
        </div>
      </div>
      ${
        // Extra tail is added without shrinking the content area of the card.
        card.holderGap
          ? `<div class="card-bottom-gap" aria-hidden="true"></div>`
          : ""
      }
    `;
  }

  function buildStatMarkup(className, value, iconSrc) {
    const hasValue = Boolean(value);

    return `
      <div class="${className}${hasValue ? "" : " stat-empty"}">
        ${
          // Empty stats keep the icon shape so the user can fill values by hand later.
          hasValue
            ? `<span>${escapeHtml(value)}</span>${iconSrc}`
            : `<span>${escapeHtml()}</span>${iconSrc}`
        }
      </div>
    `;
  }

  function clampNumber(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function formatMillimeters(value) {
    return `${Number.parseFloat(value.toFixed(2))}mm`;
  }

  function formatPixels(value) {
    return `${Number.parseFloat(value.toFixed(2))}px`;
  }

  function formatMetricNumber(value) {
    return String(Number.parseFloat(value.toFixed(2)));
  }

  function escapeHtml(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }
});
