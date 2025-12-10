# Rati Nabijashvili · CV

A minimal personal CV site with a chatbox that talks to Gemini through a Cloudflare Pages Function.

## Structure

- `index.html` – page layout and content
- `styles.css` – simple dark styling
- `script.js` – chatbox interactions and fetch
- `functions/api/chat.js` – Cloudflare Pages Function calling Gemini

## Local preview

You can open `index.html` directly in a browser for layout preview (chat calls will fail locally because `/api/chat` runs on Cloudflare).

## Deploy (Worker + static assets)

This repo now deploys via Wrangler (as Cloudflare build command).

1) `wrangler.toml` is provided (`main = "src/worker.js"`, assets served from repo root).  
2) Add secret: `npx wrangler secret put GEMINI_API_KEY`.  
3) Deploy locally for testing: `npx wrangler dev` or `npx wrangler deploy`.  
4) In the Cloudflare dashboard deployment UI, use deploy command `npx wrangler deploy` and leave build command empty.

## Connect frontend to backend

- The chat form uses `fetch("/api/chat")` from `script.js`.  
- The Worker at `src/worker.js` handles `/api/chat`, calls Gemini 1.5 Flash, and serves static assets for other paths.

## Gemini model

The function calls `gemini-1.5-flash-latest` via:
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=YOUR_KEY
```

## Notes

- Keep code minimal and beginner-friendly.  
- No key is ever exposed in the frontend; it stays in Cloudflare secrets.  
- Update the `mailto:` link in `index.html` to your real address if needed.

