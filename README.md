# Convert to Shorts

Free, private YouTube Shorts converter that runs entirely in your browser.
No upload. No account. No watermark.

🔗 Live at converttoshorts.com

## Features
- Convert horizontal video to 9:16 YouTube Shorts format
- Trim clips from longer videos (up to 10 minutes)
- Draggable crop window
- Blur letterbox style
- Text overlays
- Auto captions powered by Whisper AI (runs locally, no API cost)
- Multilingual UI (English, Hindi, Spanish)
- Works offline after first load

## Tech stack
- React + TypeScript + Vite
- Tailwind CSS v4
- ffmpeg.wasm — video processing in the browser
- Transformers.js + Whisper tiny — in-browser speech recognition
- react-i18next — multilingual support

## Development

npm install
npm run dev

## Deployment
Deployed on Vercel. Requires these headers for SharedArrayBuffer support:
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp

## License
MIT