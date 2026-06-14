const I18N = {
  ru: {
    /* head */
    pageTitle:       "D&D трекер инициативы — генератор карточек для печати",
    metaDescription: "Бесплатный онлайн-генератор карточек инициативы D&D: загрузите портрет, укажите имя, КД и скорость, выберите размер карточки и скачайте PDF для печати.",

    /* hero */
    heroTitle:    "D&D трекер инициативы",
    heroSubtitle: "Загрузите портрет, введите имя, КД и скорость — получите двусторонние карточки для физического трекера инициативы в виде PDF для печати и сгиба.",
    noscript:     "Для работы генератора нужен JavaScript. Включите его в браузере, чтобы создать и скачать карточки.",

    /* form */
    sectionCharacter:  "Данные персонажа",
    labelPortrait:     "Портрет персонажа",
    hintCrop:          "После выбора фото выделите область, которая попадёт на карточку.",
    imagePreviewAlt:   "Предпросмотр портрета персонажа",
    labelName:         "Имя",
    placeholderName:   "Например, Иваныч",
    labelAC:           "КД",
    labelSpeed:        "Скорость",
    labelCardWidth:    "Ширина карточки (мм)",
    labelMasterOnly:   "Имя, КД и скорость только на одной стороне",
    hintMasterOnly:    "Когда включено, вторая сторона остаётся пустой для ручного заполнения.",
    labelHolderGap:    "Добавить пустой край снизу для держателя",
    hintHolderGap:     "Добавляет поле для вставки в подставку-держатель.",
    labelHolderSize:   "Размер поля для держателя (мм)",
    easterEgg:         "✦ Золотая легендарная карта! ✦",
    editBannerPrefix:  "Редактирование:",
    btnAdd:            "Добавить в лист",
    btnClear:          "Сбросить форму",
    btnCancel:         "Отмена",
    hintEmptyFields:   "Пустое имя оставит линию для ручного вписывания. Незаполненные КД и скорость сохранят иконки пустыми.",
    sectionList:       "Карточки в листе",

    /* preview / print */
    sectionPreview:    "Превью карточки",
    sectionPrint:      "Печать",
    printHint:         "Для сохранения реального размера при печати выбирайте режим «Реальный размер» или «100%» в Adobe Acrobat или другом просмотрщике PDF.",
    btnDownload:       "Скачать PDF лист",

    /* lang toggle */
    langToggleLabel:   "EN",
    langToggleTitle:   "Switch to English",

    /* JS strings (used in script.js) */
    js: {
      cardSizeHint:    (h, gap, total) => `Высота карточки: ${h} мм, с держателем (${gap} мм): ${total} мм.`,
      emptyList:       "Пока нет карточек в листе.",
      noCards:         "Добавьте хотя бы одну карточку в лист.",
      photoPlaceholder:"Фото персонажа",
      nameEmpty:       "____________________",
      unnamed:         "Без имени",
      emptyFields:     "пустые поля",
      badgeEditing:    "редактируется",
      editingPrefix:   "Редактирование: ",
      btnSave:         "Сохранить изменения",
      btnAdd:          "Добавить в лист",
      labelDash:       "—",
      mmSuffix:        " мм",
      holderSuffix:    (gap) => ` · держатель ${gap} мм`,
      oneSide:         " · одна сторона",
    },
  },

  en: {
    /* head */
    pageTitle:       "D&D Initiative Tracker — printable card generator",
    metaDescription: "Free online D&D initiative card generator: upload a portrait, enter name, AC and speed, choose card size and download a print-ready PDF.",

    /* hero */
    heroTitle:    "D&D Initiative Tracker",
    heroSubtitle: "Upload a portrait, enter name, AC and speed — get double-sided initiative cards as a print-and-fold PDF.",
    noscript:     "JavaScript is required to use the generator. Please enable it in your browser.",

    /* form */
    sectionCharacter:  "Character data",
    labelPortrait:     "Character portrait",
    hintCrop:          "After selecting a photo, crop the area that will appear on the card.",
    imagePreviewAlt:   "Character portrait preview",
    labelName:         "Name",
    placeholderName:   "e.g. Gandalf",
    labelAC:           "AC",
    labelSpeed:        "Speed",
    labelCardWidth:    "Card width (mm)",
    labelMasterOnly:   "Name, AC and speed on one side only",
    hintMasterOnly:    "When enabled, the back side stays blank for handwriting.",
    labelHolderGap:    "Add blank bottom margin for a card holder",
    hintHolderGap:     "Adds a tab for inserting into a physical card holder stand.",
    labelHolderSize:   "Holder margin size (mm)",
    easterEgg:         "✦ Golden Legendary Card! ✦",
    editBannerPrefix:  "Editing:",
    btnAdd:            "Add to sheet",
    btnClear:          "Reset form",
    btnCancel:         "Cancel",
    hintEmptyFields:   "Empty name leaves a line for handwriting. Empty AC and speed keep the icons without values.",
    sectionList:       "Cards in sheet",

    /* preview / print */
    sectionPreview:    "Card preview",
    sectionPrint:      "Print",
    printHint:         "To preserve actual size when printing, choose \"Actual size\" or \"100%\" in Adobe Acrobat or your PDF viewer.",
    btnDownload:       "Download PDF sheet",

    /* lang toggle */
    langToggleLabel:   "RU",
    langToggleTitle:   "Переключить на русский",

    /* JS strings */
    js: {
      cardSizeHint:    (h, gap, total) => `Card height: ${h} mm, with holder (${gap} mm): ${total} mm.`,
      emptyList:       "No cards in sheet yet.",
      noCards:         "Add at least one card to the sheet.",
      photoPlaceholder:"Character photo",
      nameEmpty:       "____________________",
      unnamed:         "Unnamed",
      emptyFields:     "empty fields",
      badgeEditing:    "editing",
      editingPrefix:   "Editing: ",
      btnSave:         "Save changes",
      btnAdd:          "Add to sheet",
      labelDash:       "—",
      mmSuffix:        " mm",
      holderSuffix:    (gap) => ` · holder ${gap} mm`,
      oneSide:         " · one side",
    },
  },
};

window.I18N = I18N;
