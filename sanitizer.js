export function sanitizeHTML(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Remove unwanted elements
  const blockedTags = ["script", "style", "img", "iframe", "link"];
  blockedTags.forEach(tag => {
    doc.querySelectorAll(tag).forEach(el => el.remove());
  });

  // Clean attributes (keep only href for links)
  doc.querySelectorAll("*").forEach(el => {
    [...el.attributes].forEach(attr => {
      if (!(el.tagName === "A" && attr.name === "href")) {
        el.removeAttribute(attr.name);
      }
    });
  });

  return doc.documentElement.outerHTML;
}