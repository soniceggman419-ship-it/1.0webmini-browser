import { fetchPage } from "./fetcher.js";
import { sanitizeHTML } from "./sanitizer.js";
import { renderPage, onViewerReady, setCurrentUrl } from "./renderer.js";
import { pushHistory, goBack, goForward } from "./history.js";
import { toPlainText } from "./textMode.js";
import { enableLinkNavigation } from "./linkHandler.js";
import { enableForms } from "./forms.js";

const input = document.getElementById("urlInput");
const button = document.getElementById("goBtn");
const backBtn = document.getElementById("backBtn");
const forwardBtn = document.getElementById("forwardBtn");
const textModeToggle = document.getElementById("textModeToggle");
const statusBar = document.getElementById("statusBar");
const viewer = document.getElementById("viewer");

const textExtensions = new Set([
  "txt", "text", "md", "markdown", "rst", "rtf",
  "c", "h", "cpp", "hpp", "cc", "cxx", "hh", "cs", "java", "kt", "kts", "scala", "clj",
  "py", "rb", "go", "rs", "swift", "php", "pl", "pm", "lua", "r", "m", "mm",
  "js", "jsx", "ts", "tsx", "vue", "svelte",
  "css", "scss", "sass", "less", "styl",
  "html", "htm", "xhtml", "xml", "json", "yaml", "yml", "toml", "ini", "cfg", "conf",
  "sh", "bash", "zsh", "fish", "bat", "cmd", "ps1", "psm1",
  "sql", "graphql", "gql",
  "gradle", "dockerfile", "makefile", "cmake",
  "tex", "bib", "cls",
  "log", "out", "err",
  "diff", "patch",
  "env", "gitignore", "gitattributes", "editorconfig",
  "lock", "toml",
  "lisp", "el", "hs", "erl", "ex", "exs",
]);

function isTextFile(url) {
  try {
    const path = new URL(url).pathname;
    const dot = path.lastIndexOf(".");
    if (dot === -1) return false;
    const ext = path.slice(dot + 1).toLowerCase();
    return textExtensions.has(ext);
  } catch {
    return false;
  }
}

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function isInternalUrl(url) {
  return url.startsWith("int://");
}

function resolveInternalUrl(url) {
  const page = url.slice(6).replace(/\/+$/, "") || "welcome";
  return "internal/" + page + ".html";
}

viewer.src = "internal/welcome.html";

window.addEventListener("message", (e) => {
  if (e.data && e.data.type === "navigate") {
    input.value = e.data.url;
    loadPage(e.data.url);
  }
});

let textMode = false;
let currentUrl = "";

textModeToggle.addEventListener("change", () => {
  textMode = textModeToggle.checked;
  if (currentUrl) _loadPageInternal(currentUrl);
});

button.addEventListener("click", () => loadPage(input.value));
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") loadPage(input.value);
});

backBtn.addEventListener("click", () => {
  const url = goBack();
  if (url) {
    input.value = url;
    if (isInternalUrl(url)) {
      loadPageInternalFile(url);
    } else {
      _loadPageInternal(url);
    }
  }
});

forwardBtn.addEventListener("click", () => {
  const url = goForward();
  if (url) {
    input.value = url;
    if (isInternalUrl(url)) {
      loadPageInternalFile(url);
    } else {
      _loadPageInternal(url);
    }
  }
});

onViewerReady(() => {
  enableLinkNavigation();
  enableForms();
});

async function loadPage(url) {
  if (!url) return;
  input.value = url;

  pushHistory(url);
  currentUrl = url;

  if (isInternalUrl(url)) {
    loadPageInternalFile(url);
  } else {
    if (!url.startsWith("http")) url = "https://" + url;
    currentUrl = url;
    await _loadPageInternal(url);
  }
}

function loadPageInternalFile(url) {
  const file = resolveInternalUrl(url);
  viewer.src = file;
  setCurrentUrl(url);
  statusBar.textContent = "Done";
}

async function _loadPageInternal(url) {
  if (!url.startsWith("http")) url = "https://" + url;
  currentUrl = url;
  statusBar.textContent = "Loading...";

  try {
    const raw = await fetchPage(url);

    if (isTextFile(url)) {
      const pre = `<pre>${escapeHTML(raw)}</pre>`;
      setCurrentUrl(url);
      const blob = new Blob([pre], { type: "text/html" });
      viewer.src = URL.createObjectURL(blob);
      statusBar.textContent = "Done";
      return;
    }

    let cleanHTML = sanitizeHTML(raw);

    if (textMode) {
      cleanHTML = toPlainText(cleanHTML);
    }

    setCurrentUrl(url);
    renderPage(cleanHTML);
  } catch (err) {
    statusBar.textContent = "Error: " + err.message;
    console.error(err);
  }
}
