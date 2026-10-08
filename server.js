const express = require('express');
const fs = require('node:fs/promises');
const path = require('node:path');
const { spawn } = require('node:child_process');
const ffmpegPath = require('ffmpeg-static');
const multer = require('multer');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';
const SOUNDS_DIR = path.join(__dirname, 'sounds');
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = path.join(__dirname, 'data');
const LIBRARY_FILE = path.join(DATA_DIR, 'library.json');
const AUDIO_EXTENSIONS = new Set(['.mp3', '.wav']);
const UPLOAD_EXTENSIONS = new Set([...AUDIO_EXTENSIONS, '.mp4']);
const UPLOAD_TEMP_DIR = path.join(DATA_DIR, 'uploads');
let currentPlayback = null;
let uploadSequence = 0;

const upload = multer({
  storage: multer.diskStorage({
    destination: async (request, file, callback) => {
      try {
        await fs.mkdir(UPLOAD_TEMP_DIR, { recursive: true });
        callback(null, UPLOAD_TEMP_DIR);
      } catch (error) {
        callback(error);
      }
    },
    filename: (request, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      const baseName = safeAudioBaseName(file.originalname);
      callback(null, `${baseName}-${Date.now()}-${uploadSequence++}${extension}`);
    },
  }),
  limits: { fileSize: 200 * 1024 * 1024, files: 10 },
  fileFilter: (request, file, callback) => {
    if (!UPLOAD_EXTENSIONS.has(path.extname(file.originalname).toLowerCase())) {
      callback(new Error('Yalnizca MP3, WAV ve MP4 dosyalari yuklenebilir.'));
      return;
    }
    callback(null, true);
  },
});

app.use(express.json({ limit: '10kb' }));
app.use(express.static(PUBLIC_DIR));

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

function safeAudioBaseName(filename) {
  return path.basename(filename, path.extname(filename))
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_')
    .replace(/^\.+/, '')
    .trim() || 'ses';
}

async function getUniqueSoundFilename(desiredFilename) {
  const extension = path.extname(desiredFilename).toLowerCase();
  const baseName = safeAudioBaseName(desiredFilename);
  let filename = `${baseName}${extension}`;
  let suffix = 1;

  while (await fileExists(path.join(SOUNDS_DIR, filename))) {
    filename = `${baseName}-${suffix}${extension}`;
    suffix += 1;
  }

  return filename;
}

async function readLibrary() {
  try {
    const stored = JSON.parse(await fs.readFile(LIBRARY_FILE, 'utf8'));
    return {
      categories: Array.isArray(stored.categories) ? stored.categories : [],
      sounds: stored.sounds && typeof stored.sounds === 'object' ? stored.sounds : {},
    };
  } catch (error) {
    if (error.code === 'ENOENT') return { categories: [], sounds: {} };
    throw error;
  }
}

async function writeLibrary(library) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const temporaryFile = `${LIBRARY_FILE}.tmp`;
  await fs.writeFile(temporaryFile, JSON.stringify(library, null, 2));
  await fs.rename(temporaryFile, LIBRARY_FILE);
}

function defaultSoundSettings(displayName = '') {
  return { displayName, category: '', favorite: false, volume: 1 };
}

function nextSoundDisplayName(library, filenames, baseName = 'Yeni Ses') {
  const occupied = new Set(filenames.map((filename) => {
    const displayName = library.sounds[filename]?.displayName || path.basename(filename, path.extname(filename));
    return displayName.trim().toLocaleLowerCase('tr');
  }));

  let suffix = 1;
  let displayName = baseName;
  while (occupied.has(displayName.toLocaleLowerCase('tr'))) {
    suffix += 1;
    displayName = `${baseName} ${suffix}`;
  }
  return displayName;
}

async function getSoundFiles() {
  const entries = await fs.readdir(SOUNDS_DIR, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && AUDIO_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => entry.name)
    .sort((first, second) => first.localeCompare(second, 'tr'));
}

function stopCurrentPlayback() {
  if (!currentPlayback) return false;

  const playback = currentPlayback;
  currentPlayback = null;
  playback.process.kill();
  return true;
}

function playOnWindows(filePath, startSeconds = 0, durationSeconds = null, volume = 1) {
  const encodedPath = Buffer.from(filePath, 'utf8').toString('base64');
  const script = [
    'Add-Type -AssemblyName presentationCore;',
    `$filePath = [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${encodedPath}'));`,
    '$player = New-Object System.Windows.Media.MediaPlayer;',
    '$player.Open([System.Uri]::new($filePath));',
    `$player.Volume = ${Math.max(0, Math.min(1, volume))};`,
    '$attempts = 0;',
    'while (-not $player.NaturalDuration.HasTimeSpan -and $attempts -lt 200) { Start-Sleep -Milliseconds 50; $attempts++ }',
    `$player.Position = [TimeSpan]::FromSeconds(${startSeconds});`,
    '$player.Play();',
    durationSeconds === null
      ? 'if ($player.NaturalDuration.HasTimeSpan) { Start-Sleep -Milliseconds ([Math]::Ceiling($player.NaturalDuration.TimeSpan.TotalMilliseconds)) }'
      : `Start-Sleep -Milliseconds ${Math.max(1, Math.ceil(durationSeconds * 1000))};`,
  ].join(' ');

  return spawn('powershell.exe', [
    '-NoProfile',
    '-NonInteractive',
    '-EncodedCommand',
    Buffer.from(script, 'utf16le').toString('base64'),
  ], { windowsHide: true, stdio: 'ignore' });
}

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    if (!ffmpegPath) {
      reject(new Error('FFmpeg kullanilamiyor. Bagimliliklari yeniden yukleyin.'));
      return;
    }

    const process = spawn(ffmpegPath, args, { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
    let stderr = '';
    process.stderr.setEncoding('utf8');
    process.stderr.on('data', (chunk) => { stderr += chunk; });
    process.once('error', reject);
    process.once('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(stderr.trim() || `FFmpeg islemi ${code} koduyla sonlandi.`));
    });
  });
}

app.get('/api/sounds', async (request, response) => {
  try {
    const [filenames, library] = await Promise.all([getSoundFiles(), readLibrary()]);
    const sounds = filenames.map((filename) => ({
      filename,
      ...defaultSoundSettings(path.basename(filename, path.extname(filename))),
      ...(library.sounds[filename] || {}),
    }));
    response.json({ sounds, categories: library.categories });
  } catch (error) {
    console.error('Ses klasoru okunamadi:', error);
    response.status(500).json({ error: 'Ses klasoru okunamadi.' });
  }
});

app.post('/api/categories', async (request, response) => {
  const name = typeof request.body?.name === 'string' ? request.body.name.trim() : '';
  if (!name || name.length > 24) {
    return response.status(400).json({ error: 'Kategori adi 1-24 karakter olmali.' });
  }

  try {
    const library = await readLibrary();
    const existing = library.categories.find((category) => category.toLocaleLowerCase('tr') === name.toLocaleLowerCase('tr'));
    if (existing) return response.status(409).json({ error: 'Bu kategori zaten var.' });
    library.categories.push(name);
    await writeLibrary(library);
    return response.status(201).json({ ok: true, categories: library.categories });
  } catch (error) {
    console.error('Kategori kaydedilemedi:', error);
    return response.status(500).json({ error: 'Kategori kaydedilemedi.' });
  }
});

app.patch('/api/sounds/:filename', async (request, response) => {
  const { filename } = request.params;
  const updates = request.body || {};
  if (path.basename(filename) !== filename) {
    return response.status(400).json({ error: 'Gecersiz dosya adi.' });
  }

  try {
    const filenames = await getSoundFiles();
    if (!filenames.includes(filename)) return response.status(404).json({ error: 'Ses dosyasi bulunamadi.' });

    const library = await readLibrary();
    const settings = { ...defaultSoundSettings(), ...(library.sounds[filename] || {}) };
    if (Object.hasOwn(updates, 'category')) {
      if (typeof updates.category !== 'string' ||
          (updates.category && !library.categories.includes(updates.category))) {
        return response.status(400).json({ error: 'Gecersiz kategori.' });
      }
      settings.category = updates.category;
    }
    if (Object.hasOwn(updates, 'favorite')) {
      if (typeof updates.favorite !== 'boolean') return response.status(400).json({ error: 'Favori degeri gecersiz.' });
      settings.favorite = updates.favorite;
    }
    if (Object.hasOwn(updates, 'volume')) {
      if (!Number.isFinite(updates.volume) || updates.volume < 0 || updates.volume > 1) {
        return response.status(400).json({ error: 'Ses seviyesi 0-100 araliginda olmali.' });
      }
      settings.volume = updates.volume;
    }
    if (Object.hasOwn(updates, 'displayName')) {
      if (typeof updates.displayName !== 'string' || !updates.displayName.trim() || updates.displayName.length > 60) {
        return response.status(400).json({ error: 'Ses adi 1-60 karakter olmali.' });
      }
      settings.displayName = updates.displayName.trim();
    }

    library.sounds[filename] = settings;
    await writeLibrary(library);
    return response.json({ ok: true, settings });
  } catch (error) {
    console.error('Ses ayarlari kaydedilemedi:', error);
    return response.status(500).json({ error: 'Ses ayarlari kaydedilemedi.' });
  }
});

app.delete('/api/sounds/:filename', async (request, response) => {
  const { filename } = request.params;
  if (path.basename(filename) !== filename) {
    return response.status(400).json({ error: 'Gecersiz dosya adi.' });
  }

  try {
    const soundFiles = await getSoundFiles();
    if (!soundFiles.includes(filename)) {
      return response.status(404).json({ error: 'Ses dosyasi bulunamadi.' });
    }

    if (currentPlayback?.filename === filename) stopCurrentPlayback();
    const library = await readLibrary();
    await fs.rm(path.join(SOUNDS_DIR, filename));
    delete library.sounds[filename];
    await writeLibrary(library);
    return response.json({ ok: true, filename });
  } catch (error) {
    console.error('Ses silinemedi:', error);
    return response.status(500).json({ error: 'Ses silinemedi.' });
  }
});

app.post('/api/upload', (request, response, next) => {
  upload.array('files', 20)(request, response, (error) => {
    if (error) {
      const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
      response.status(status).json({ error: error.message });
      return;
    }
    next();
  });
}, async (request, response) => {
  if (!request.files?.length) return response.status(400).json({ error: 'Yuklenecek MP3, WAV veya MP4 dosyasi secin.' });

  try {
    const library = await readLibrary();
    const existingSoundFiles = await getSoundFiles();
    const requestedDisplayName = typeof request.body?.displayNameBase === 'string'
      ? request.body.displayNameBase.trim().slice(0, 40)
      : 'Yeni Ses';
    const displayNameBase = requestedDisplayName || 'Yeni Ses';
    const addedFiles = [];
    const convertedFiles = [];
    const errors = [];

    for (const file of request.files) {
      const extension = path.extname(file.originalname).toLowerCase();
      let outputFilename;

      try {
        if (extension === '.mp4') {
          outputFilename = await getUniqueSoundFilename(`${safeAudioBaseName(file.originalname)}.mp3`);
          const outputPath = path.join(SOUNDS_DIR, outputFilename);
          try {
            await runFfmpeg([
              '-hide_banner', '-loglevel', 'error',
              '-i', file.path,
              '-map', '0:a:0', '-vn',
              '-c:a', 'libmp3lame', '-q:a', '2',
              outputPath,
            ]);
          } catch (error) {
            await fs.rm(outputPath, { force: true });
            throw error;
          }
          convertedFiles.push(outputFilename);
        } else {
          outputFilename = await getUniqueSoundFilename(file.originalname);
          await fs.rename(file.path, path.join(SOUNDS_DIR, outputFilename));
        }

        library.sounds[outputFilename] = defaultSoundSettings(nextSoundDisplayName(library, existingSoundFiles, displayNameBase));
        addedFiles.push(outputFilename);
        existingSoundFiles.push(outputFilename);
      } catch (error) {
        const message = extension === '.mp4'
          ? 'Video MP3e donusturulemedi; dosyada okunabilir bir ses akisi olmayabilir.'
          : 'Ses dosyasi kaydedilemedi.';
        errors.push(`${file.originalname}: ${message}`);
        console.error(`Dosya yuklenemedi (${file.originalname}):`, error);
      } finally {
        await fs.rm(file.path, { force: true });
      }
    }

    if (!addedFiles.length) {
      return response.status(422).json({ error: errors.join(' ') || 'Dosyalar yuklenemedi.' });
    }

    await writeLibrary(library);
    return response.status(201).json({
      ok: true,
      files: addedFiles,
      converted: convertedFiles.length,
      errors,
    });
  } catch (error) {
    console.error('Sesler kaydedilemedi:', error);
    return response.status(500).json({ error: 'Yuklenen sesler kaydedilemedi.' });
  }
});

app.get('/api/sounds/:filename/audio', async (request, response) => {
  const { filename } = request.params;
  if (path.basename(filename) !== filename) {
    return response.status(400).json({ error: 'Gecersiz dosya adi.' });
  }

  try {
    const soundFiles = await getSoundFiles();
    if (!soundFiles.includes(filename)) {
      return response.status(404).json({ error: 'Ses dosyasi bulunamadi.' });
    }

    response.type(path.extname(filename).toLowerCase() === '.mp3' ? 'audio/mpeg' : 'audio/wav');
    return response.sendFile(path.join(SOUNDS_DIR, filename));
  } catch (error) {
    console.error('Ses onizlemesi acilamadi:', error);
    return response.status(500).json({ error: 'Ses onizlemesi acilamadi.' });
  }
});

app.get('/api/playback', (request, response) => {
  response.json({
    filename: currentPlayback?.filename || null,
    preview: currentPlayback?.preview || false,
  });
});

app.post('/api/play', async (request, response) => {
  const filename = request.body?.filename;

  if (typeof filename !== 'string' || path.basename(filename) !== filename) {
    return response.status(400).json({ error: 'Gecersiz dosya adi.' });
  }

  try {
    const soundFiles = await getSoundFiles();
    if (!soundFiles.includes(filename)) {
      return response.status(404).json({ error: 'Ses dosyasi bulunamadi.' });
    }

    if (currentPlayback?.filename === filename) {
      stopCurrentPlayback();
      return response.json({ ok: true, filename, playing: false });
    }

    stopCurrentPlayback();
    const library = await readLibrary();
    const settings = { ...defaultSoundSettings(), ...(library.sounds[filename] || {}) };
    const playbackProcess = playOnWindows(path.join(SOUNDS_DIR, filename), 0, null, settings.volume);
    const playback = { filename, process: playbackProcess, preview: false };
    currentPlayback = playback;
    playbackProcess.once('error', (error) => {
      console.error('Ses calma sureci baslatilamadi:', error);
      if (currentPlayback === playback) currentPlayback = null;
    });
    playbackProcess.once('exit', () => {
      if (currentPlayback === playback) currentPlayback = null;
    });
    return response.json({ ok: true, filename, playing: true });
  } catch (error) {
    console.error('Ses calinamadi:', error);
    return response.status(500).json({ error: 'Ses calinamadi. Dosya bicimini ve bilgisayar ses cikisini kontrol edin.' });
  }
});

app.post('/api/preview', async (request, response) => {
  const { filename } = request.body || {};
  const startSeconds = Number(request.body?.startSeconds);
  const endSeconds = Number(request.body?.endSeconds);

  if (typeof filename !== 'string' || path.basename(filename) !== filename ||
      !Number.isFinite(startSeconds) || !Number.isFinite(endSeconds) ||
      startSeconds < 0 || endSeconds <= startSeconds) {
    return response.status(400).json({ error: 'Onizleme araligi gecersiz.' });
  }

  try {
    const soundFiles = await getSoundFiles();
    if (!soundFiles.includes(filename)) {
      return response.status(404).json({ error: 'Ses dosyasi bulunamadi.' });
    }

    if (currentPlayback?.filename === filename && currentPlayback.preview) {
      stopCurrentPlayback();
      return response.json({ ok: true, filename, playing: false });
    }

    const library = await readLibrary();
    const settings = { ...defaultSoundSettings(), ...(library.sounds[filename] || {}) };
    stopCurrentPlayback();
    const playbackProcess = playOnWindows(
      path.join(SOUNDS_DIR, filename),
      startSeconds,
      endSeconds - startSeconds,
      settings.volume,
    );
    const playback = { filename, process: playbackProcess, preview: true };
    currentPlayback = playback;
    playbackProcess.once('error', (error) => {
      console.error('Onizleme sureci baslatilamadi:', error);
      if (currentPlayback === playback) currentPlayback = null;
    });
    playbackProcess.once('exit', () => {
      if (currentPlayback === playback) currentPlayback = null;
    });
    return response.json({ ok: true, filename, playing: true });
  } catch (error) {
    console.error('Ses onizlemesi calinamadi:', error);
    return response.status(500).json({ error: 'Ses onizlemesi calinamadi.' });
  }
});

app.post('/api/trim', async (request, response) => {
  const { filename, outputFilename } = request.body || {};
  const startSeconds = Number(request.body?.startSeconds);
  const endSeconds = Number(request.body?.endSeconds);

  if (typeof filename !== 'string' || path.basename(filename) !== filename ||
      typeof outputFilename !== 'string' || path.basename(outputFilename) !== outputFilename ||
      !outputFilename.trim() || !AUDIO_EXTENSIONS.has(path.extname(outputFilename).toLowerCase()) ||
      path.extname(outputFilename).toLowerCase() !== path.extname(filename).toLowerCase() ||
      !Number.isFinite(startSeconds) || !Number.isFinite(endSeconds) ||
      startSeconds < 0 || endSeconds <= startSeconds) {
    return response.status(400).json({ error: 'Dosya adi veya kesim araligi gecersiz.' });
  }

  try {
    const soundFiles = await getSoundFiles();
    if (!soundFiles.includes(filename)) {
      return response.status(404).json({ error: 'Kaynak ses dosyasi bulunamadi.' });
    }

    const outputPath = path.join(SOUNDS_DIR, outputFilename);
    try {
      await fs.access(outputPath);
      return response.status(409).json({ error: 'Bu isimde bir ses zaten var.' });
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }

    const extension = path.extname(filename).toLowerCase();
    const codecArgs = extension === '.mp3'
      ? ['-c:a', 'libmp3lame', '-q:a', '2']
      : ['-c:a', 'pcm_s16le'];

    await runFfmpeg([
      '-hide_banner', '-loglevel', 'error',
      '-ss', String(startSeconds),
      '-i', path.join(SOUNDS_DIR, filename),
      '-t', String(endSeconds - startSeconds),
      '-map', '0:a:0', '-vn',
      ...codecArgs,
      outputPath,
    ]);

    const library = await readLibrary();
    const displayName = path.basename(outputFilename, path.extname(outputFilename));
    library.sounds[outputFilename] = defaultSoundSettings(displayName);
    await writeLibrary(library);

    return response.status(201).json({ ok: true, filename: outputFilename });
  } catch (error) {
    console.error('Ses kirpilamadi:', error);
    return response.status(500).json({ error: 'Ses kirpilamadi. Dosyayi ve kesim araligini kontrol edin.' });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Soundboard hazir: http://localhost:${PORT}`);
  console.log('Telefonunuzdan bilgisayarin yerel IP adresini kullanin.');
});