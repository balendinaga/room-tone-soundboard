const soundGrid = document.querySelector('#sound-grid');
const soundCount = document.querySelector('#sound-count');
const deckIndex = document.querySelector('#deck-index');
const connection = document.querySelector('#connection');
const connectionLabel = document.querySelector('#connection-label');
const toast = document.querySelector('#toast');
const trimDialog = document.querySelector('#trim-dialog');
const trimForm = document.querySelector('#trim-form');
const trimSource = document.querySelector('#trim-source');
const trimStart = document.querySelector('#trim-start');
const trimEnd = document.querySelector('#trim-end');
const trimOutput = document.querySelector('#trim-output');
const trimSave = document.querySelector('#trim-save');
const trimPreview = document.querySelector('#trim-preview');
const trimReset = document.querySelector('#trim-reset');
const trimStatus = document.querySelector('#trim-status');
const waveformEditor = document.querySelector('#waveform-editor');
const waveformCanvas = document.querySelector('#waveform-canvas');
const waveformSelection = document.querySelector('#trim-selection');
const waveformMaskStart = document.querySelector('#waveform-mask-start');
const waveformMaskEnd = document.querySelector('#waveform-mask-end');
const waveformPlayhead = document.querySelector('#waveform-playhead');
const trimStartLabel = document.querySelector('#trim-start-label');
const trimEndLabel = document.querySelector('#trim-end-label');
const trimPositionLabel = document.querySelector('#trim-position-label');
const categoryFilter = document.querySelector('#category-filter');
const favoritesFilter = document.querySelector('#favorites-filter');
const uploadInput = document.querySelector('#upload-input');
const uploadTrigger = document.querySelector('#upload-trigger');
const categoryDialog = document.querySelector('#category-dialog');
const categoryForm = document.querySelector('#category-form');
const categoryName = document.querySelector('#category-name');
const languageSelect = document.querySelector('#language-select');

const translations = {
  en: {
    languageLabel: 'Language', homeLink: 'Room Tone home', pageTitle: 'Soundboard', sounds: 'SOUNDS', loaded: 'LOADED', archive: 'LIBRARY',
    categoryFilter: 'Filter by category', soundCategory: 'Category for {name}', serverOnline: 'Server online', offline: 'Offline', newSound: 'New Sound',
    localAudioDeck: 'LOCAL AUDIO DECK', live: 'LIVE', localNetworkSystem: 'LOCAL NETWORK SOUND SYSTEM',
    audioEditor: 'AUDIO EDITOR', soundButtons: 'Sound buttons', categoryDialogTitle: 'Add category',
    viewLabel: 'VIEW', allSounds: 'All sounds', favorites: 'Favorites', addCategory: 'Category', uploadSounds: 'Upload sounds',
    loadingSounds: 'Loading sounds...', hostOutput: 'HOST OUTPUT', lanReady: 'LAN / READY', liveLibrary: 'LIBRARY UPDATES LIVE',
    trimTitle: 'Trim sound', closeDialog: 'Close dialog', waveformLabel: 'Waveform and trim selection',
    trimStartHandle: 'Drag trim start', trimEndHandle: 'Drag trim end', previewPlay: 'Play', previewPause: 'Pause',
    previewStop: 'Stop preview', resetSelection: 'Reset selection', loadingSound: 'Loading audio...',
    readyToPreview: 'Adjust the handles and preview your selection.', startSeconds: 'Start (sec)', endSeconds: 'End (sec)',
    outputFilename: 'Output filename', originalPreserved: 'The original stays untouched; the trimmed audio is saved as a new file.',
    cancel: 'Cancel', saveAsNewSound: 'Save as new sound', saving: 'Saving...', add: 'Add', categoryName: 'Category name',
    uncategorized: 'Uncategorized', playSound: 'Play {name} on the computer', trimSound: 'Trim {name}',
    deleteSound: 'Delete {name}', addFavorite: 'Add to favorites', removeFavorite: 'Remove from favorites',
    decreaseVolume: 'Decrease volume', increaseVolume: 'Increase volume', soundVolume: '{name} volume',
    soundsEmpty: 'No sounds yet. Use Upload sounds to add files.', noFilterSounds: 'No sounds match this filter.',
    loadingError: 'Could not load the sound list.', noServer: 'Could not connect to the server. Retrying...',
    playError: 'Could not play the sound.', deleteConfirm: 'Permanently delete "{name}"?', deleteSuccess: 'Deleted {name}.',
    deleteError: 'Could not delete the sound.', settingsError: 'Could not save sound settings.', categoryError: 'Could not add category.',
    categoryAdded: 'Category added: {name}', uploadError: 'Could not upload files.', uploading: 'Uploading...',
    uploadPartial: 'Added {added} sound(s); {failed} file(s) could not be converted.',
    uploadConverted: 'Converted {count} MP4 video(s) to MP3 and added them.', uploadSuccess: 'Added {count} sound(s).',
    invalidFilename: 'Invalid filename.', invalidCategory: 'Invalid category.', invalidFavorite: 'Invalid favorite value.',
    invalidVolume: 'Volume must be between 0 and 100%.', invalidDisplayName: 'Sound name must be 1-60 characters.',
    invalidCategoryName: 'Category name must be 1-24 characters.', duplicateCategory: 'That category already exists.',
    unsupportedFiles: 'Only MP3, WAV and MP4 files are supported.', selectFiles: 'Select MP3, WAV or MP4 files to upload.',
    duplicateFilename: 'A sound with that filename already exists.', soundNotFound: 'Sound file not found.',
    invalidTrim: 'Invalid filename or trim range.',
    trimSuffix: 'trimmed', trimPreviewError: 'Could not start the preview. Try again.',
    trimOpenError: 'Could not load the audio preview.', noAudioContext: 'This browser does not support waveform preview.',
    durationError: 'Could not read the audio duration.', trimSaveError: 'Could not trim the sound.',
    trimSaved: 'Saved: {filename}',
  },
  tr: {
    languageLabel: 'Dil', homeLink: 'Room Tone ana sayfa', pageTitle: 'Ses paneli', sounds: 'SES', loaded: 'YUKLU', archive: 'ARSIV',
    categoryFilter: 'Kategoriye gore filtrele', soundCategory: '{name} kategorisi', serverOnline: 'Sunucu aktif', offline: 'Baglanti yok', newSound: 'Yeni Ses',
    localAudioDeck: 'YEREL SES PANELI', live: 'CANLI', localNetworkSystem: 'YEREL AG SES SISTEMI',
    audioEditor: 'SES DUZENLEYICI', soundButtons: 'Ses butonlari', categoryDialogTitle: 'Kategori ekle',
    viewLabel: 'GORUNUM', allSounds: 'Tum sesler', favorites: 'Favoriler', addCategory: 'Kategori', uploadSounds: 'Ses yukle',
    loadingSounds: 'Sesler yukleniyor...', hostOutput: 'BILGISAYAR SESI', lanReady: 'LAN / HAZIR', liveLibrary: 'SES LISTESI CANLI GUNCELLENIR',
    trimTitle: 'Sesi kirp', closeDialog: 'Pencereyi kapat', waveformLabel: 'Ses dalga bicimi ve kirpma secimi',
    trimStartHandle: 'Kesit baslangicini surukle', trimEndHandle: 'Kesit bitisini surukle', previewPlay: 'Oynat', previewPause: 'Duraklat',
    previewStop: 'Onizlemeyi durdur', resetSelection: 'Secimi sifirla', loadingSound: 'Ses yukleniyor...',
    readyToPreview: 'Tutamaclari ayarlayip secimi dinleyin.', startSeconds: 'Baslangic (sn)', endSeconds: 'Bitis (sn)',
    outputFilename: 'Cikti dosya adi', originalPreserved: 'Orijinal korunur; kirpilmis ses yeni dosya olarak kaydedilir.',
    cancel: 'Vazgec', saveAsNewSound: 'Yeni ses olarak kaydet', saving: 'Kaydediliyor...', add: 'Ekle', categoryName: 'Kategori adi',
    uncategorized: 'Kategorisiz', playSound: '{name} sesini bilgisayarda cal', trimSound: '{name} sesini kirp',
    deleteSound: '{name} sesini sil', addFavorite: 'Favorilere ekle', removeFavorite: 'Favorilerden cikar',
    decreaseVolume: 'Sesi azalt', increaseVolume: 'Sesi artir', soundVolume: '{name} ses seviyesi',
    soundsEmpty: 'Henuz ses yok. Dosya eklemek icin Ses yukle dugmesini kullanin.', noFilterSounds: 'Bu filtrede ses bulunamadi.',
    loadingError: 'Ses listesi yuklenemedi.', noServer: 'Sunucuya baglanilamadi. Tekrar deneniyor...',
    playError: 'Ses calinamadi.', deleteConfirm: '"{name}" sesi kalici olarak silinsin mi?', deleteSuccess: '{name} silindi.',
    deleteError: 'Ses silinemedi.', settingsError: 'Ses ayarlari kaydedilemedi.', categoryError: 'Kategori eklenemedi.',
    categoryAdded: 'Kategori eklendi: {name}', uploadError: 'Dosyalar yuklenemedi.', uploading: 'Yukleniyor...',
    uploadPartial: '{added} ses eklendi; {failed} dosya donusturulemedi.',
    uploadConverted: '{count} MP4 video MP3e donusturulup eklendi.', uploadSuccess: '{count} ses eklendi.',
    invalidFilename: 'Gecersiz dosya adi.', invalidCategory: 'Gecersiz kategori.', invalidFavorite: 'Favori degeri gecersiz.',
    invalidVolume: 'Ses seviyesi 0-100 araliginda olmali.', invalidDisplayName: 'Ses adi 1-60 karakter olmali.',
    invalidCategoryName: 'Kategori adi 1-24 karakter olmali.', duplicateCategory: 'Bu kategori zaten var.',
    unsupportedFiles: 'Yalnizca MP3, WAV ve MP4 dosyalari yuklenebilir.', selectFiles: 'Yuklenecek MP3, WAV veya MP4 dosyasi secin.',
    duplicateFilename: 'Bu isimde bir ses zaten var.', soundNotFound: 'Ses dosyasi bulunamadi.',
    invalidTrim: 'Dosya adi veya kesim araligi gecersiz.',
    trimSuffix: 'kirpilmis', trimPreviewError: 'Onizleme baslatilamadi. Tekrar deneyin.',
    trimOpenError: 'Ses onizlemesi yuklenemedi.', noAudioContext: 'Bu tarayici dalga bicimi onizlemesini desteklemiyor.',
    durationError: 'Sesin suresi okunamadi.', trimSaveError: 'Ses kirpilamadi.',
    trimSaved: 'Kaydedildi: {filename}',
  },
};

let toastTimer;
let currentSounds = [];
let currentCategories = [];
let activeFilename = null;
let trimFilename = null;
let trimDuration = 0;
let decodedAudio = null;
let draggedHandle = null;
let trimPreviewPlaying = false;
let trimPreviewStart = 0;
let trimPreviewStartedAt = 0;
let trimPreviewTimer = null;
let favoritesOnly = false;
let categoryChoice = '';
const settingsTimers = new Map();
const savedLanguage = localStorage.getItem('soundboard-language');
let currentLanguage = savedLanguage || (navigator.language.toLowerCase().startsWith('tr') ? 'tr' : 'en');
const serverErrorKeys = {
  'Gecersiz dosya adi.': 'invalidFilename',
  'Gecersiz kategori.': 'invalidCategory',
  'Favori degeri gecersiz.': 'invalidFavorite',
  'Ses seviyesi 0-100 araliginda olmali.': 'invalidVolume',
  'Ses adi 1-60 karakter olmali.': 'invalidDisplayName',
  'Kategori adi 1-24 karakter olmali.': 'invalidCategoryName',
  'Bu kategori zaten var.': 'duplicateCategory',
  'Yalnizca MP3, WAV ve MP4 dosyalari yuklenebilir.': 'unsupportedFiles',
  'Yuklenecek MP3, WAV veya MP4 dosyasi secin.': 'selectFiles',
  'Bu isimde bir ses zaten var.': 'duplicateFilename',
  'Ses dosyasi bulunamadi.': 'soundNotFound',
  'Kaynak ses dosyasi bulunamadi.': 'soundNotFound',
  'Dosya adi veya kesim araligi gecersiz.': 'invalidTrim',
};

function t(key, values = {}) {
  const dictionary = translations[currentLanguage] || translations.en;
  const message = dictionary[key] || translations.en[key] || key;
  return message.replace(/\{(\w+)\}/g, (match, name) => values[name] ?? match);
}

function apiError(result, fallback) {
  const key = serverErrorKeys[result?.error];
  return key ? t(key) : fallback;
}

function applyLanguage(language) {
  currentLanguage = translations[language] ? language : 'en';
  localStorage.setItem('soundboard-language', currentLanguage);
  document.documentElement.lang = currentLanguage;
  languageSelect.value = currentLanguage;

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
    element.setAttribute('aria-label', t(element.dataset.i18nAria));
  });
  if (trimDialog.open) {
    trimSave.textContent = t('saveAsNewSound');
    if (!trimPreviewPlaying) setTrimPreviewButton('previewPlay', '&#9654;');
  }
  renderSounds(currentSounds, currentCategories, true);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3000);
}

function setConnection(online) {
  connection.classList.toggle('is-online', online);
  connection.classList.toggle('is-offline', !online);
  connectionLabel.textContent = online ? t('serverOnline') : t('offline');
}

function renderSounds(sounds, categories = currentCategories, force = false) {
  const updated = JSON.stringify(sounds) !== JSON.stringify(currentSounds);
  currentSounds = sounds;
  currentCategories = categories;
  updateCategoryOptions();
  soundCount.textContent = String(sounds.length).padStart(2, '0');
  soundGrid.setAttribute('aria-busy', 'false');

  if (!updated && !force && soundGrid.querySelector('.sound-pad')) return;
  soundGrid.replaceChildren();

  const visibleSounds = sounds.filter((sound) =>
    (!categoryChoice || sound.category === categoryChoice) && (!favoritesOnly || sound.favorite));
  deckIndex.textContent = String(visibleSounds.length).padStart(2, '0');

  if (visibleSounds.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = sounds.length === 0 ? t('soundsEmpty') : t('noFilterSounds');
    soundGrid.append(empty);
    return;
  }

  visibleSounds.forEach((sound, index) => {
    const { filename } = sound;
    const item = document.createElement('div');
    const button = document.createElement('button');
    const tools = document.createElement('div');
    const favoriteButton = document.createElement('button');
    const categorySelect = document.createElement('select');
    const trimButton = document.createElement('button');
    const deleteButton = document.createElement('button');
    const volumeControls = document.createElement('div');
    const volumeDown = document.createElement('button');
    const volumeRange = document.createElement('input');
    const volumeUp = document.createElement('button');
    const volumeValue = document.createElement('span');
    const top = document.createElement('span');
    const number = document.createElement('span');
    const symbol = document.createElement('span');
    const name = document.createElement('span');
    const bottom = document.createElement('span');
    const type = document.createElement('span');

    button.type = 'button';
    button.className = 'sound-pad';
    if (filename === activeFilename) button.classList.add('is-playing');
    button.dataset.filename = filename;
    button.setAttribute('aria-label', t('playSound', { name: sound.displayName || filename }));
    top.className = 'pad-top';
    number.className = 'pad-number';
    number.textContent = String(index + 1).padStart(2, '0');
    symbol.className = 'pad-symbol';
    symbol.setAttribute('aria-hidden', 'true');
    symbol.textContent = '\u25b6';
    name.className = 'pad-name';
    name.textContent = sound.displayName || filename.replace(/\.[^.]+$/, '');
    bottom.className = 'pad-bottom';
    type.className = 'pad-type';
    type.textContent = filename.split('.').pop().toUpperCase();
    item.className = 'sound-item';
    item.dataset.filename = filename;
    tools.className = 'sound-card-tools';
    favoriteButton.type = 'button';
    favoriteButton.className = 'favorite-toggle';
    favoriteButton.dataset.action = 'favorite';
    favoriteButton.setAttribute('aria-pressed', String(Boolean(sound.favorite)));
    favoriteButton.setAttribute('aria-label', sound.favorite ? t('removeFavorite') : t('addFavorite'));
    favoriteButton.innerHTML = sound.favorite ? '&#9733;' : '&#9734;';
    categorySelect.className = 'sound-category';
    categorySelect.dataset.action = 'category';
    categorySelect.setAttribute('aria-label', t('soundCategory', { name: sound.displayName || filename }));
    const uncategorized = document.createElement('option');
    uncategorized.value = '';
    uncategorized.textContent = t('uncategorized');
    categorySelect.append(uncategorized);
    currentCategories.forEach((category) => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categorySelect.append(option);
    });
    categorySelect.value = sound.category || '';
    trimButton.type = 'button';
    trimButton.className = 'trim-trigger';
    trimButton.dataset.action = 'trim';
    trimButton.dataset.filename = filename;
    trimButton.textContent = currentLanguage === 'tr' ? 'Kirp' : 'Trim';
    trimButton.setAttribute('aria-label', t('trimSound', { name: sound.displayName || filename }));
    deleteButton.type = 'button';
    deleteButton.className = 'delete-sound';
    deleteButton.dataset.action = 'delete';
    deleteButton.dataset.filename = filename;
    deleteButton.textContent = currentLanguage === 'tr' ? 'Sil' : 'Delete';
    deleteButton.setAttribute('aria-label', t('deleteSound', { name: sound.displayName || filename }));
    volumeControls.className = 'volume-controls';
    volumeDown.type = 'button';
    volumeDown.className = 'volume-step';
    volumeDown.dataset.action = 'volume-step';
    volumeDown.dataset.step = '-1';
    volumeDown.setAttribute('aria-label', t('decreaseVolume'));
    volumeDown.textContent = '\u2212';
    volumeRange.type = 'range';
    volumeRange.className = 'volume-range';
    volumeRange.dataset.action = 'volume';
    volumeRange.min = '0';
    volumeRange.max = '100';
    volumeRange.step = '5';
    volumeRange.value = String(Math.round((sound.volume ?? 1) * 100));
    volumeRange.setAttribute('aria-label', t('soundVolume', { name: sound.displayName || filename }));
    volumeUp.type = 'button';
    volumeUp.className = 'volume-step';
    volumeUp.dataset.action = 'volume-step';
    volumeUp.dataset.step = '1';
    volumeUp.setAttribute('aria-label', t('increaseVolume'));
    volumeUp.textContent = '+';
    volumeValue.className = 'volume-value';
    volumeValue.textContent = `${volumeRange.value}%`;

    top.append(number, symbol);
    bottom.append(type);
    button.append(top, name, bottom);
    favoriteButton.dataset.filename = filename;
    categorySelect.dataset.filename = filename;
    trimButton.dataset.filename = filename;
    volumeRange.dataset.filename = filename;
    volumeDown.dataset.filename = filename;
    volumeUp.dataset.filename = filename;
    tools.append(favoriteButton, categorySelect, trimButton, deleteButton);
    volumeControls.append(volumeDown, volumeRange, volumeUp, volumeValue);
    item.append(button, tools, volumeControls);
    soundGrid.append(item);
  });
}

function updateCategoryOptions() {
  const previousValue = categoryChoice;
  categoryFilter.replaceChildren();
  const allOption = document.createElement('option');
  allOption.value = '';
  allOption.textContent = t('allSounds');
  categoryFilter.append(allOption);
  currentCategories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.append(option);
  });
  categoryChoice = currentCategories.includes(previousValue) ? previousValue : '';
  categoryFilter.value = categoryChoice;
}

async function loadSounds() {
  try {
    const response = await fetch('/api/sounds', { cache: 'no-store' });
    if (!response.ok) throw new Error(t('loadingError'));
    const data = await response.json();
    renderSounds(data.sounds, data.categories);
    setConnection(true);
  } catch (error) {
    setConnection(false);
    soundGrid.setAttribute('aria-busy', 'false');
    if (currentSounds.length === 0) {
      soundGrid.innerHTML = `<p class="empty-state">${t('noServer')}</p>`;
    }
  }
}

soundGrid.addEventListener('click', async (event) => {
  const actionButton = event.target.closest('[data-action]');
  if (actionButton?.dataset.action === 'trim') {
    openTrimDialog(actionButton.dataset.filename);
    return;
  }

  if (actionButton?.dataset.action === 'delete') {
    await deleteSound(actionButton.dataset.filename);
    return;
  }

  if (actionButton?.dataset.action === 'favorite') {
    const sound = currentSounds.find((entry) => entry.filename === actionButton.dataset.filename);
    if (sound) await saveSoundSettings(sound.filename, { favorite: !sound.favorite });
    return;
  }

  if (actionButton?.dataset.action === 'volume-step') {
    const item = actionButton.closest('.sound-item');
    const range = item.querySelector('.volume-range');
    range.value = String(Math.max(0, Math.min(100, Number(range.value) + Number(actionButton.dataset.step) * 5)));
    item.querySelector('.volume-value').textContent = `${range.value}%`;
    await saveSoundSettings(range.dataset.filename, { volume: Number(range.value) / 100 });
    return;
  }

  const button = event.target.closest('.sound-pad');
  if (!button || button.disabled) return;

  try {
    const response = await fetch('/api/play', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: button.dataset.filename }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(apiError(result, t('playError')));
    activeFilename = result.playing ? result.filename : null;
    soundGrid.querySelectorAll('.sound-pad').forEach((pad) => {
      pad.classList.toggle('is-playing', pad.dataset.filename === activeFilename);
    });
  } catch (error) {
    showToast(error.message || t('playError'));
  }
});

async function deleteSound(filename) {
  const sound = currentSounds.find((entry) => entry.filename === filename);
  const displayName = sound?.displayName || filename;
  if (!window.confirm(t('deleteConfirm', { name: displayName }))) return;

  try {
    const response = await fetch(`/api/sounds/${encodeURIComponent(filename)}`, { method: 'DELETE' });
    const result = await response.json();
    if (!response.ok) throw new Error(apiError(result, t('deleteError')));
    await loadSounds();
    showToast(t('deleteSuccess', { name: displayName }));
  } catch (error) {
    showToast(error.message || t('deleteError'));
  }
}

soundGrid.addEventListener('change', async (event) => {
  const control = event.target.closest('[data-action]');
  if (!control) return;
  if (control.dataset.action === 'category') {
    await saveSoundSettings(control.dataset.filename, { category: control.value });
  }
  if (control.dataset.action === 'volume') {
    await saveSoundSettings(control.dataset.filename, { volume: Number(control.value) / 100 });
  }
});

soundGrid.addEventListener('input', (event) => {
  if (event.target.matches('.volume-range')) {
    event.target.closest('.volume-controls').querySelector('.volume-value').textContent = `${event.target.value}%`;
  }
});

async function saveSoundSettings(filename, updates) {
  try {
    const response = await fetch(`/api/sounds/${encodeURIComponent(filename)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(apiError(result, t('settingsError')));
    currentSounds = currentSounds.map((sound) => sound.filename === filename
      ? { ...sound, ...result.settings }
      : sound);
    renderSounds(currentSounds, currentCategories, true);
  } catch (error) {
    showToast(error.message || t('settingsError'));
    await loadSounds();
  }
}

categoryFilter.addEventListener('change', () => {
  categoryChoice = categoryFilter.value;
  renderSounds(currentSounds, currentCategories, true);
});

favoritesFilter.addEventListener('click', () => {
  favoritesOnly = !favoritesOnly;
  favoritesFilter.setAttribute('aria-pressed', String(favoritesOnly));
  renderSounds(currentSounds, currentCategories, true);
});

document.querySelector('#add-category').addEventListener('click', () => {
  categoryForm.reset();
  categoryDialog.showModal();
  categoryName.focus();
});

document.querySelector('#category-cancel').addEventListener('click', () => categoryDialog.close());
categoryForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = categoryName.value.trim();
  try {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(apiError(result, t('categoryError')));
    categoryDialog.close();
    currentCategories = result.categories;
    await loadSounds();
    showToast(t('categoryAdded', { name }));
  } catch (error) {
    showToast(error.message || t('categoryError'));
  }
});

uploadTrigger.addEventListener('click', () => uploadInput.click());
uploadInput.addEventListener('change', async () => {
  const files = Array.from(uploadInput.files || []);
  if (!files.length) return;

  const formData = new FormData();
  formData.append('displayNameBase', t('newSound'));
  files.forEach((file) => formData.append('files', file));
  uploadTrigger.disabled = true;
  uploadTrigger.querySelector('[data-i18n]').textContent = t('uploading');
  try {
    const response = await fetch('/api/upload', { method: 'POST', body: formData });
    const result = await response.json();
    if (!response.ok) throw new Error(apiError(result, t('uploadError')));
    categoryChoice = '';
    favoritesOnly = false;
    categoryFilter.value = '';
    favoritesFilter.setAttribute('aria-pressed', 'false');
    await loadSounds();
    const message = result.errors?.length
      ? t('uploadPartial', { added: result.files.length, failed: result.errors.length })
      : result.converted
        ? t('uploadConverted', { count: result.converted })
        : t('uploadSuccess', { count: result.files.length });
    showToast(message);
  } catch (error) {
    showToast(error.message || t('uploadError'));
  } finally {
    uploadTrigger.disabled = false;
    uploadTrigger.innerHTML = `<span aria-hidden="true">&#8593;</span> <span data-i18n="uploadSounds">${t('uploadSounds')}</span>`;
    uploadInput.value = '';
  }
});

async function openTrimDialog(filename) {
  const extension = filename.match(/\.[^.]+$/)?.[0] || '';
  const baseName = filename.slice(0, -extension.length);
  trimFilename = filename;
  trimSource.textContent = filename;
  trimStart.value = '0';
  trimEnd.value = '10';
  trimOutput.value = `${baseName}-${t('trimSuffix')}${extension}`;
  trimSave.disabled = true;
  trimPreview.disabled = true;
  trimReset.disabled = true;
  trimSave.textContent = t('saveAsNewSound');
  trimStatus.textContent = t('loadingSound');
  trimDialog.showModal();
  setTrimPreviewButton('previewPlay', '&#9654;');
  trimDuration = 0;
  decodedAudio = null;
  trimPreviewPlaying = false;
  trimPreviewStart = 0;
  clearInterval(trimPreviewTimer);

  try {
    const response = await fetch(`/api/sounds/${encodeURIComponent(filename)}/audio`);
    if (!response.ok) throw new Error(t('trimOpenError'));
    const audioData = await response.arrayBuffer();

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) throw new Error(t('noAudioContext'));
    const audioContext = new AudioContextClass();
    try {
      decodedAudio = await audioContext.decodeAudioData(audioData.slice(0));
    } finally {
      await audioContext.close();
    }

    trimDuration = decodedAudio.duration;
    if (!Number.isFinite(trimDuration) || trimDuration <= 0) throw new Error(t('durationError'));
    trimStart.max = String(trimDuration);
    trimEnd.max = String(trimDuration);
    trimEnd.value = String(Math.min(10, trimDuration));
    trimPreviewStart = 0;
    trimSave.disabled = false;
    trimPreview.disabled = false;
    trimReset.disabled = false;
    trimStatus.textContent = t('readyToPreview');
    updateTrimView();
    requestAnimationFrame(drawWaveform);
  } catch (error) {
    trimStatus.textContent = error.message || t('trimOpenError');
    showToast(trimStatus.textContent);
  }
}

function setTrimPreviewButton(key, icon) {
  trimPreview.innerHTML = `<span aria-hidden="true">${icon}</span> <span data-i18n="${key}">${t(key)}</span>`;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const remaining = (seconds % 60).toFixed(1).padStart(4, '0');
  return `${minutes}:${remaining}`;
}

function drawWaveform() {
  if (!decodedAudio) return;
  const bounds = waveformEditor.getBoundingClientRect();
  if (!bounds.width || !bounds.height) return;

  const pixelRatio = window.devicePixelRatio || 1;
  waveformCanvas.width = Math.round(bounds.width * pixelRatio);
  waveformCanvas.height = Math.round(bounds.height * pixelRatio);
  const context = waveformCanvas.getContext('2d');
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.clearRect(0, 0, bounds.width, bounds.height);

  const channels = Array.from({ length: decodedAudio.numberOfChannels }, (_, index) => decodedAudio.getChannelData(index));
  const columns = Math.max(1, Math.floor(bounds.width / 3));
  const samplesPerColumn = Math.max(1, Math.floor(decodedAudio.length / columns));
  const center = bounds.height / 2;
  const amplitude = bounds.height * 0.43;
  context.beginPath();
  context.strokeStyle = '#46e0ad';
  context.lineWidth = 1.5;

  for (let column = 0; column < columns; column += 1) {
    const sampleStart = column * samplesPerColumn;
    const sampleEnd = Math.min(decodedAudio.length, sampleStart + samplesPerColumn);
    let peak = 0;
    for (const channel of channels) {
      for (let sample = sampleStart; sample < sampleEnd; sample += 1) {
        peak = Math.max(peak, Math.abs(channel[sample]));
      }
    }
    const height = Math.max(1, peak * amplitude);
    const x = (column / columns) * bounds.width;
    context.moveTo(x, center - height);
    context.lineTo(x, center + height);
  }
  context.stroke();
}

function updateTrimView() {
  if (!trimDuration) return;
  const start = Math.max(0, Math.min(trimDuration, Number(trimStart.value) || 0));
  const end = Math.max(start, Math.min(trimDuration, Number(trimEnd.value) || 0));
  const playheadTime = trimPreviewPlaying
    ? Math.min(end, trimPreviewStart + ((performance.now() - trimPreviewStartedAt) / 1000))
    : Math.max(start, Math.min(end, trimPreviewStart));
  const startPercent = (start / trimDuration) * 100;
  const endPercent = (end / trimDuration) * 100;

  waveformSelection.style.left = `${startPercent}%`;
  waveformSelection.style.width = `${endPercent - startPercent}%`;
  waveformMaskStart.style.width = `${startPercent}%`;
  waveformMaskEnd.style.left = `${endPercent}%`;
  waveformMaskEnd.style.width = `${100 - endPercent}%`;
  waveformPlayhead.style.left = `${(playheadTime / trimDuration) * 100}%`;
  trimStartLabel.textContent = formatTime(start);
  trimEndLabel.textContent = formatTime(trimDuration);
  trimPositionLabel.textContent = formatTime(playheadTime);
}

function updateSelectionFromPointer(event) {
  if (!draggedHandle || !trimDuration) return;
  const bounds = waveformEditor.getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
  const selectedTime = ratio * trimDuration;
  const minimumGap = Math.min(0.1, trimDuration);

  if (draggedHandle === 'start') {
    trimStart.value = Math.min(selectedTime, Number(trimEnd.value) - minimumGap).toFixed(1);
  } else {
    trimEnd.value = Math.max(selectedTime, Number(trimStart.value) + minimumGap).toFixed(1);
  }
  updateTrimView();
}

function updateSelectionFromInputs(changedInput) {
  if (!trimDuration) return;
  const minimumGap = Math.min(0.1, trimDuration);
  let start = Math.max(0, Math.min(trimDuration, Number(trimStart.value) || 0));
  let end = Math.max(0, Math.min(trimDuration, Number(trimEnd.value) || 0));

  if (changedInput === trimStart && start >= end - minimumGap) end = Math.min(trimDuration, start + minimumGap);
  if (changedInput === trimEnd && end <= start + minimumGap) start = Math.max(0, end - minimumGap);
  trimStart.value = start.toFixed(1);
  trimEnd.value = end.toFixed(1);
  updateTrimView();
}

async function toggleTrimPreview() {
  if (!trimDuration) return;
  const start = trimPreviewPlaying
    ? Number(trimStart.value)
    : Math.max(Number(trimStart.value), Math.min(Number(trimEnd.value), trimPreviewStart));
  const end = Number(trimEnd.value);

  try {
    const response = await fetch('/api/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: trimFilename, startSeconds: start, endSeconds: end }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(apiError(result, t('trimPreviewError')));
    trimPreviewPlaying = result.playing;
    if (trimPreviewPlaying) {
      trimPreviewStart = start;
      trimPreviewStartedAt = performance.now();
      setTrimPreviewButton('previewStop', '&#9632;');
      clearInterval(trimPreviewTimer);
      trimPreviewTimer = setInterval(() => {
        if ((performance.now() - trimPreviewStartedAt) / 1000 >= end - trimPreviewStart) {
          trimPreviewPlaying = false;
          trimPreviewStart = Number(trimStart.value);
          clearInterval(trimPreviewTimer);
          setTrimPreviewButton('previewPlay', '&#9654;');
        }
        updateTrimView();
      }, 80);
    } else {
      trimPreviewStart = Number(trimStart.value);
      clearInterval(trimPreviewTimer);
      setTrimPreviewButton('previewPlay', '&#9654;');
    }
    updateTrimView();
  } catch (error) {
    showToast(error.message || t('trimPreviewError'));
    setTrimPreviewButton('previewPlay', '&#9654;');
  }
}

function resetTrimSelection() {
  trimStart.value = '0';
  trimEnd.value = String(Math.min(trimDuration, 10));
  trimPreviewStart = 0;
  setTrimPreviewButton('previewPlay', '&#9654;');
  updateTrimView();
}

async function saveTrimmedSound() {
  if (!trimForm.reportValidity()) return;

  trimSave.disabled = true;
  trimSave.textContent = t('saving');
  try {
    const response = await fetch('/api/trim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: trimSource.textContent,
        startSeconds: Number(trimStart.value),
        endSeconds: Number(trimEnd.value),
        outputFilename: trimOutput.value.trim(),
      }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(apiError(result, t('trimSaveError')));
    trimDialog.close();
    showToast(t('trimSaved', { filename: result.filename }));
    await loadSounds();
  } catch (error) {
    showToast(error.message || t('trimSaveError'));
  } finally {
    trimSave.disabled = false;
    trimSave.textContent = t('saveAsNewSound');
  }
}

document.querySelector('#trim-close').addEventListener('click', () => trimDialog.close());
document.querySelector('#trim-cancel').addEventListener('click', () => trimDialog.close());
trimSave.addEventListener('click', saveTrimmedSound);
trimPreview.addEventListener('click', toggleTrimPreview);
trimReset.addEventListener('click', resetTrimSelection);
trimStart.addEventListener('input', () => updateSelectionFromInputs(trimStart));
trimEnd.addEventListener('input', () => updateSelectionFromInputs(trimEnd));
trimForm.addEventListener('submit', (event) => {
  event.preventDefault();
  saveTrimmedSound();
});

waveformEditor.addEventListener('pointerdown', (event) => {
  const handle = event.target.closest('.wave-handle');
  if (handle) {
    draggedHandle = handle.dataset.handle;
    handle.setPointerCapture(event.pointerId);
    updateSelectionFromPointer(event);
    return;
  }

  if (trimDuration) {
    const bounds = waveformEditor.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const start = Number(trimStart.value);
    const end = Number(trimEnd.value);
    trimPreviewStart = Math.max(start, Math.min(end, ratio * trimDuration));
    updateTrimView();
  }
});
waveformEditor.addEventListener('pointermove', updateSelectionFromPointer);
waveformEditor.addEventListener('pointerup', () => { draggedHandle = null; });
waveformEditor.addEventListener('pointercancel', () => { draggedHandle = null; });
trimDialog.addEventListener('close', () => {
  clearInterval(trimPreviewTimer);
  trimPreviewPlaying = false;
  decodedAudio = null;
});
window.addEventListener('resize', drawWaveform);
languageSelect.addEventListener('change', () => applyLanguage(languageSelect.value));

async function syncPlayback() {
  try {
    const response = await fetch('/api/playback', { cache: 'no-store' });
    if (!response.ok) return;
    const data = await response.json();
    if (data.filename !== activeFilename) {
      activeFilename = data.filename;
      soundGrid.querySelectorAll('.sound-pad').forEach((pad) => {
        pad.classList.toggle('is-playing', pad.dataset.filename === activeFilename);
      });
    }
  } catch (error) {
    // Playback status will be retried on the next poll.
  }
}

applyLanguage(currentLanguage);
loadSounds();
setInterval(loadSounds, 3000);
setInterval(syncPlayback, 1000);