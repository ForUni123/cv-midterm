export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat") {
      if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
      }

      try {
        const { message } = await request.json();
        if (!message || typeof message !== "string") {
          return new Response(
            JSON.stringify({ error: "Message is required." }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        const apiKey = env.GEMINI_API_KEY;
        if (!apiKey) {
          return new Response(
            JSON.stringify({ error: "API key missing." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }

        const geminiUrl =
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent" +
          `?key=${apiKey}`;

        const geminiRes = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: message }], role: "user" }],
          }),
        });

        if (!geminiRes.ok) {
          return new Response(
            JSON.stringify({ error: "Gemini request failed." }),
            { status: 502, headers: { "Content-Type": "application/json" } }
          );
        }

        const geminiData = await geminiRes.json();
        const reply =
          geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ??
          "No response generated.";

        return new Response(JSON.stringify({ reply }), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: "Server error." }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Serve static assets (index.html, css, js, etc.)
    return env.ASSETS.fetch(request);
  },
};

