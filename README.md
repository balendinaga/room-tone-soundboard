# Room Tone Soundboard

A mobile-first soundboard that lets you control audio playing through your computer from a phone or another device on the same local network. The interface supports English and Turkish.

## Features

- Play MP3 and WAV files through the host computer's audio output.
- Upload MP3, WAV, and MP4 files from the browser. MP4 uploads are converted to MP3 using their first audio stream.
- Trim audio visually with a waveform, draggable in/out points, and computer-output preview.
- Set an individual playback level, favorite sounds, and assign categories.
- Delete sounds with confirmation.
- Refresh the library automatically when files are added.
- Choose English or Turkish; the language preference is saved in the browser.

## Requirements

- Node.js 20 or newer
- npm
- Windows is required for computer-output playback. FFmpeg is installed locally by `ffmpeg-static` for MP4 conversion and trimming.

## Run

```sh
npm install
npm start
```

Open `http://localhost:3000` on the host computer. To use a phone, find the host computer's local IPv4 address and open `http://<computer-ip>:3000` on a device connected to the same trusted Wi-Fi network.

On Windows, `Start-Soundboard.vbs` can start the server in the background and open the interface. Node.js must be available on `PATH`.

Run the syntax checks with:

```sh
npm run check
```

## Audio files and settings

Uploaded audio and MP4-derived MP3 files are stored in `sounds/`. The app creates `data/library.json` for categories, favorites, display names, and per-sound levels. These runtime files are intentionally excluded from Git. Back up the folders locally if you need to preserve your library.

The uploader accepts up to 10 files per request, with a 200 MB per-file limit. MP4 files without a readable audio stream cannot be imported.

## Network security

This app is designed for a trusted local network and does not include authentication. Anyone who can reach the server can play, upload, trim, and delete sounds. Do not expose its port to the public internet or configure router port forwarding. Use it only on a network whose users you trust.

## Audio and third-party software

Only add audio that you own or are licensed to use. Audio files are not included in this repository. FFmpeg and npm dependencies are installed separately and remain subject to their respective licenses.

## License

The project source is available under the MIT License. See [LICENSE](LICENSE).
