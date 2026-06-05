import { fetchPage } from "./fetcher.js";
import { sanitizeHTML } from "./sanitizer.js";
import { renderPage } from "./renderer.js";

export function enableForms() {
  const viewer = document.getElementById("viewer");
  try {
    const doc = viewer.contentDocument;
    if (!doc) return;

    doc.querySelectorAll("form").forEach(form => {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const action = form.getAttribute("action") || "";
        const formData = new FormData(form);
        const params = new URLSearchParams(formData).toString();

        const url = action + "?" + params;

        try {
          const rawHTML = await fetchPage(url);
          const cleanHTML = sanitizeHTML(rawHTML);
          renderPage(cleanHTML);
        } catch (err) {
          console.error(err);
        }
      });
    });
  } catch (e) {
    // cross-origin access may fail silently
  }
}
