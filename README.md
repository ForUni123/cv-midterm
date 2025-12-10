# Rati Nabijashvili · CV

A minimal personal CV site with a chatbox that talks to Gemini through a Cloudflare Pages Function.

## Structure

- `index.html` – page layout and content
- `styles.css` – simple dark styling
- `script.js` – chatbox interactions and fetch
- `functions/api/chat.js` – Cloudflare Pages Function calling Gemini

## Local preview

You can open `index.html` directly in a browser for layout preview (chat calls will fail locally because `/api/chat` runs on Cloudflare).

## Deploy to Cloudflare Pages

1) Create a new Pages project and connect this repo.  
2) Build command: `npm run build` (or leave blank). Output folder: `/` (root).  
3) Ensure the `functions` folder is detected (Pages Functions enabled by default).

## Add Cloudflare Worker secret

In the Pages project settings > Functions > Environment variables:  
- Add variable `GEMINI_API_KEY` with your Gemini API key (kept secret by Cloudflare).

## Connect frontend to backend

- The chat form uses `fetch("/api/chat")` from `script.js`.  
- When deployed, Pages routes requests to `/api/chat` into `functions/api/chat.js`, which calls Gemini 1.5 Flash using the secret key and returns `{ reply }` JSON to the browser.

## Gemini model

The function calls `gemini-1.5-flash-latest` via:
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=YOUR_KEY
```

## Notes

- Keep code minimal and beginner-friendly.  
- No key is ever exposed in the frontend; it stays in Cloudflare secrets.  
- Update the `mailto:` link in `index.html` to your real address if needed.

