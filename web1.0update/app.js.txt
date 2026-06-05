const input = document.getElementById("urlInput");
const button = document.getElementById("goBtn");
const viewer = document.getElementById("viewer");
const statusBar = document.getElementById("statusBar"); // optional

const proxy = "https://api.allorigins.win/raw?url=";

const historyStack = [];
let historyIndex = -1;

button.addEventListener("click", () => loadPage(input.value));
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") loadPage(input.value);
});

const backBtn = document.getElementById("backBtn");
const forwardBtn = document.getElementById("forwardBtn");
if (backBtn) backBtn.addEventListener("click", () => navigateHistory(-1));
if (forwardBtn) forwardBtn.addEventListener("click", () => navigateHistory(1));

async function loadPage(url) {
  if (!url) return;
  if (!url.startsWith("http")) url = "https://" + url;

  input.value = url;
  pushHistory(url);

  try {
    if (statusBar) statusBar.textContent = "Loading...";
    
    const res = await fetch(proxy + encodeURIComponent(url));
    const contentType = res.headers.get("Content-Type") || "";
    let text = await res.text();

    // ===== Detect plain text =====
    if (contentType.includes("text/plain") || url.endsWith(".txt")) {
      // Render as plain text inside <pre>
      const blob = new Blob([`<pre>${escapeHTML(text)}</pre>`], { type: "text/html" });
      viewer.src = URL.createObjectURL(blob);
    } else {
      // Old Web 1.0 HTML sanitizer
      text = text.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
      text = text.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "");
      text = text.replace(/<link[\s\S]*?rel=["']?stylesheet["']?[\s\S]*?>/gi, "");
      text = text.replace(/<img[\s\S]*?>/gi, "");
      text = text.replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "");
      text = text.replace(/style="[^"]*"/gi, "");
      text = text.replace(/on\w+="[^"]*"/gi, "");
      text = text.replace(/<(\w+)[^>]*>/g, "<$1>");

      const blob = new Blob([text], { type: "text/html" });
      viewer.src = URL.createObjectURL(blob);
    }

    if (statusBar) statusBar.textContent = "Done";

  } catch (err) {
    if (statusBar) statusBar.textContent = "Error";
    alert("Failed to load page.");
    console.error(err);
  }
}

// ===== History helpers =====
function pushHistory(url) {
  historyStack.splice(historyIndex + 1);
  historyStack.push(url);
  historyIndex = historyStack.length - 1;
}

function navigateHistory(offset) {
  const newIndex = historyIndex + offset;
  if (newIndex >= 0 && newIndex < historyStack.length) {
    historyIndex = newIndex;
    loadPage(historyStack[historyIndex]);
  }
}

// ===== Helper to escape HTML inside <pre> =====
function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
