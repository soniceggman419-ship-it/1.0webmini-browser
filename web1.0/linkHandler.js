import { fetchPage } from "./fetcher.js";
import { sanitizeHTML } from "./sanitizer.js";
import { renderPage } from "./renderer.js";
import { pushHistory } from "./history.js";

export function enableLinkNavigation() {
  const viewer = document.getElementById("viewer");
  try {
    const doc = viewer.contentDocument;
    if (!doc) return;

    doc.querySelectorAll("a[href]").forEach(link => {
      link.addEventListener("click", async (e) => {
        e.preventDefault();

        let url = link.getAttribute("data-href") || link.getAttribute("href");
        if (!url || url === "#" || url.startsWith("javascript:")) return;

        document.getElementById("urlInput").value = url;
        pushHistory(url);

        if (url.startsWith("int://")) {
          const file = "internal/" + (url.slice(6).replace(/\/+$/, "") || "welcome") + ".html";
          viewer.src = file;
          viewer.setAttribute("data-current-url", url);
          return;
        }

        if (!url.startsWith("http")) {
          try {
            const baseUrl = viewer.getAttribute("data-current-url") || "";
            url = new URL(url, baseUrl).href;
          } catch {
            return;
          }
        }

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
