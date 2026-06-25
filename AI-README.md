# PixelPulse AI Video Generator

A small web project that turns text prompts into a preview video workflow. This demo page is built with HTML, CSS, and JavaScript, and supports both a local demo mode and real API-driven video generation.

## Project structure

- `AI.html` — main UI page for the generator
- `AI.css` — layout, theming, responsive styling
- `AI.js` — interactive form handling, endpoint requests, demo behavior

## How it works

1. The user enters a video prompt, selects duration, and chooses a style.
2. An optional AI endpoint and API key can be provided.
3. When `Generate video` is clicked:
   - if no endpoint is provided, the app stays in demo mode and shows a placeholder message
   - if an endpoint is configured, it sends a `POST` request with prompt data
4. The project supports responses containing either:
   - `videoUrl` — a remote video URL
   - `videoBase64` — a base64-encoded MP4 payload
5. The video is then shown in the preview player with status feedback.

## Coding keypoints

- `AI.html` stores the UI structure and links to `AI.css` and `AI.js`
- `AI.css` contains all visual styling, including dark theme, responsive layout, and button states
- `AI.js` handles:
  - form validation and user feedback
  - fetch requests to the configured endpoint
  - response parsing and video playback logic
  - error handling and status updates

## Usage

1. Open `AI.html` in a browser.
2. Enter a text prompt and choose duration/style.
3. Optionally paste an AI endpoint URL and API key.
4. Click `Generate video`.
5. Preview the video in the built-in player.

## Notes

- This project is designed for local use in a browser.
- If no AI endpoint is provided, the page acts as a demo interface only.
- The `AI.css` file keeps all design rules separate from markup.
- The `AI.js` file keeps behavior separate from the page layout.

## Optional improvements

- Add a real AI endpoint for video rendering.
- Enable direct download of generated clips.
- Add more prompt presets or advanced styling options.
