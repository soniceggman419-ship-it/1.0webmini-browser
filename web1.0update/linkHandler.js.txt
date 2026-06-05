import { fetchPage } from "./fetcher.js";
import { sanitizeHTML } from "./sanitizer.js";
import { renderPage } from "./renderer.js";

export function enableLinkNavigation(viewer) {
  viewer.addEventListener("load", () => {
    const doc = viewer.contentDocument;

    doc.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", async (e) => {
        e.preventDefault();

        let url = link.getAttribute("href");
        if (!url) return;

        if (!url.startsWith("http")) {
          const base = new URL(viewer.src);
          url = new URL(url, base).href;
        }

        try {
          const rawHTML = await fetchPage(url);
          const cleanHTML = sanitizeHTML(rawHTML);
          renderPage(cleanHTML);
        } catch (err) {
          console.error(err);
        }
      });
    });
  });
}
