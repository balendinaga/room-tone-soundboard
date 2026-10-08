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

## Discord and SteelSeries Sonar

Sonar is optional. The soundboard always plays audio through the host computer. To also send soundboard audio to a Discord or in-game voice chat, route it through Sonar's virtual Stream Mix:

1. Install SteelSeries GG and enable Sonar.
2. In Sonar, set **Personal Mix** to your physical headphones and select your real microphone as **Mic Input**.
3. Add an **Aux** channel. Route Aux to both **Personal Mix** (so you can hear it) and **Stream Mix** (so voice chat can hear it). Route your microphone to Stream Mix as well.
4. In Windows **Settings → System → Sound → Volume mixer**, play a sound once and set the output for **Windows PowerShell** (or `powershell.exe`, if that is how it appears) to **SteelSeries Sonar - Aux**. This app uses a PowerShell audio process for host playback. This per-app setting leaves the normal Windows output device unchanged.
5. In Discord or the game's voice settings, choose **SteelSeries Sonar - Stream** as the input device. Keep the output device set to your physical headphones.

### Troubleshooting voice-chat audio

- **You hear the effect, but others do not:** confirm the PowerShell app is routed to Sonar Aux, and that Aux is routed to Stream Mix. Check that the Stream Mix level meter moves while the sound plays.
- **Others hear your microphone but not effects:** the microphone route is working; check the PowerShell per-app output and Aux-to-Stream Mix route.
- **Effects work but your voice does not:** select the real microphone in Sonar's Mic Input and route the Mic channel to Stream Mix. Discord's input should remain **SteelSeries Sonar - Stream**.
- **Discord detects the device but effects are very quiet or missing:** temporarily turn off Discord noise suppression/Krisp and test again; voice filters can suppress short effects.
- **You hear echo:** keep Discord's output on your physical headphones. Do not route Discord's chat output back into Stream Mix; use headphones instead of speakers.
- **You cannot hear the effects locally:** check that the Sonar Aux channel is routed to Personal Mix and that its level is up.

## Audio files and settings

Uploaded audio and MP4-derived MP3 files are stored in `sounds/`. The app creates `data/library.json` for categories, favorites, display names, and per-sound levels. These runtime files are intentionally excluded from Git. Back up the folders locally if you need to preserve your library.

The uploader accepts up to 10 files per request, with a 200 MB per-file limit. MP4 files without a readable audio stream cannot be imported.

## Network security

This app is designed for a trusted local network and does not include authentication. Anyone who can reach the server can play, upload, trim, and delete sounds. Do not expose its port to the public internet or configure router port forwarding. Use it only on a network whose users you trust.

## Audio and third-party software

Only add audio that you own or are licensed to use. Audio files are not included in this repository. FFmpeg and npm dependencies are installed separately and remain subject to their respective licenses.

## License

The project source is available under the MIT License. See [LICENSE](LICENSE).
