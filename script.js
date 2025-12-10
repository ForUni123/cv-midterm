const chatForm = document.getElementById("chat-form");
const chatBody = document.getElementById("chat-body");
const chatInput = document.getElementById("chat-message");
const chatToggle = document.getElementById("chat-toggle");
const chatbox = document.getElementById("chatbox");

function addMessage(text, sender = "bot") {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.textContent = text;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  chatInput.value = "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      addMessage("Sorry, something went wrong. Please try again.", "bot");
      return;
    }

    const data = await res.json();
    addMessage(data.reply || "I couldn't generate a reply.", "bot");
  } catch (err) {
    addMessage("Network error. Please try again.", "bot");
  }
});

chatToggle.addEventListener("click", () => {
  const isHidden = chatBody.style.display === "none";
  chatBody.style.display = isHidden ? "flex" : "none";
  chatForm.style.display = isHidden ? "flex" : "none";
  chatToggle.textContent = isHidden ? "–" : "+";
  if (!isHidden) {
    chatbox.style.height = "52px";
  } else {
    chatbox.style.height = "auto";
  }
});

