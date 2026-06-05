import { fetchPage } from "./fetcher.js";
import { sanitizeHTML } from "./sanitizer.js";
import { renderPage } from "./renderer.js";

export function enableLinkNavigation() {
  const viewer = document.getElementById("viewer");
  try {
    const doc = viewer.contentDocument;
    if (!doc) return;

    doc.querySelectorAll("a[href]").forEach(link => {
      link.addEventListener("click", async (e) => {
        e.preventDefault();

        let url = link.getAttribute("href");
        if (!url || url.startsWith("#") || url.startsWith("javascript:")) return;

        if (!url.startsWith("http")) {
          try {
            const baseUrl = viewer.getAttribute("data-current-url") || "";
            url = new URL(url, baseUrl).href;
          } catch {
            return;
          }
        }

        document.getElementById("urlInput").value = url;

        try {
          const rawHTML = await fetchPage(url);
          const cleanHTML = sanitizeHTML(rawHTML);
          renderPage(cleanHTML);
          viewer.setAttribute("data-current-url", url);
        } catch (err) {
          console.error(err);
        }
      });
    });
  } catch (e) {
    // cross-origin access may fail silently
  }
}
