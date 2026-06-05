import { fetchPage } from "./fetcher.js";
import { sanitizeHTML } from "./sanitizer.js";
import { renderPage } from "./renderer.js";

export function enableForms(viewer) {
  viewer.addEventListener("load", () => {
    const doc = viewer.contentDocument;

    doc.querySelectorAll("form").forEach(form => {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const action = form.getAttribute("action") || "";
        const formData = new FormData(form);
        const params = new URLSearchParams(formData).toString();

        const url = action + "?" + params;

        const rawHTML = await fetchPage(url);
        const cleanHTML = sanitizeHTML(rawHTML);
        renderPage(cleanHTML);
      });
    });
  });
}
