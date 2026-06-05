// Legacy fallback loader (used only if modular system fails)
import { legacyLoad } from "./app.js";
const proxy = "https://api.allorigins.win/raw?url=";

export async function legacyLoad(url, viewer) {
  try {
    if (!url.startsWith("http")) {
      url = "https://" + url;
    }

    const res = await fetch(proxy + encodeURIComponent(url));
    let html = await res.text();

    // ===== Old sanitizer =====

    html = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
    html = html.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "");
    html = html.replace(/<link[\s\S]*?rel=["']?stylesheet["']?[\s\S]*?>/gi, "");
    html = html.replace(/<img[\s\S]*?>/gi, "");
    html = html.replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "");
    html = html.replace(/style="[^"]*"/gi, "");
    html = html.replace(/on\w+="[^"]*"/gi, "");
    html = html.replace(/<(\w+)[^>]*>/g, "<$1>");

    const blob = new Blob([html], { type: "text/html" });
    viewer.src = URL.createObjectURL(blob);

  } catch (err) {
    console.error("Legacy loader failed:", err);
    throw err;
  }
}
