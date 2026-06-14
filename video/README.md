# Contrarian — demo video

A ~2:10 narrated product demo, built with [Remotion](https://remotion.dev).
Voiceover is generated locally with the macOS `say` command (voice **Daniel**, en_GB).

**Output:** [`out/contrarian-demo.mp4`](out/contrarian-demo.mp4) — 1920×1080, h264 + AAC.

## Regenerate from scratch

```bash
cd video
npm install

# 1. Capture real product screenshots (needs the app running — see note below)
BASE_URL=http://localhost:3000 npm run capture

# 2. Generate the Daniel voiceover (.aiff -> .wav) + measure clip durations
npm run audio

# 3. Copy fresh assets into public/ (Remotion serves from public/)
cp assets/shots/*.png public/shots/ && cp assets/audio/*.wav public/audio/

# 4. Preview or render
npm run studio                 # interactive preview
npm run render                 # -> out/contrarian-demo.mp4
```

> The capture step points at the Next.js dev server. Start it first
> (`npm run dev` in the repo root) and pass its port via `BASE_URL`.

## How it's wired

- **Narration** — `generate-audio.mjs` runs `say -v Daniel`, converts AIFF→WAV with
  macOS `afconvert`, measures each clip with `afinfo`, and writes
  `src/durations.json`. The timeline (`src/timeline.ts`) sizes each scene from
  those real clip durations, so the visuals stay in sync with the voice.
- **Footage** — `capture.mjs` drives the live app with headless Chrome
  (`puppeteer-core`) and saves screenshots to `assets/shots/`.
- **Scenes** — `src/scenes.tsx` (8 scenes: hook → status quo → brand → describe
  intent → four lenses → verdict → decision → outro). `src/DemoVideo.tsx`
  sequences them and attaches each scene's audio.
- **Fonts** — Geist / Geist Mono are bundled locally in `public/fonts` and loaded
  by `<FontLoader/>` (in `src/lib.tsx`). We deliberately avoid `@remotion/google-fonts`
  because fetching gstatic at render time is unreliable on this machine.

No system `ffmpeg` is required — Remotion ships its own.
