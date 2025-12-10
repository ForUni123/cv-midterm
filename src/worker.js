const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Preflight for CORS when needed
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (url.pathname === "/api/chat") {
      if (request.method !== "POST") {
        return json({ error: "Method Not Allowed" }, 405);
      }

      try {
        const { message } = await request.json();
        if (!message || typeof message !== "string") {
          return json({ error: "Message is required." }, 400);
        }

        const apiKey = env.GEMINI_API_KEY;
        if (!apiKey) {
          return json({ error: "API key missing." }, 500);
        }

        const geminiUrl =
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent" +
          `?key=${apiKey}`;

        const geminiRes = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: message }], role: "user" }],
          }),
        });

        if (!geminiRes.ok) {
          const errText = await geminiRes.text();
          return json(
            {
              error: "Gemini request failed.",
              status: geminiRes.status,
              detail: errText.slice(0, 400),
            },
            502
          );
        }

        const geminiData = await geminiRes.json();
        const reply =
          geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ??
          "No response generated.";

        return json({ reply });
      } catch (err) {
        return json({ error: "Server error." }, 500);
      }
    }

    // Serve static assets (index.html, css, js, etc.)
    return env.ASSETS.fetch(request);
  },
};

