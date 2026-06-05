export function sanitizeHTML(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const blockedTags = ["script", "style", "img", "iframe", "link", "video", "audio", "source", "object", "embed"];
  blockedTags.forEach(tag => {
    doc.querySelectorAll(tag).forEach(el => el.remove());
  });

  doc.querySelectorAll("*").forEach(el => {
    [...el.attributes].forEach(attr => {
      const name = attr.name.toLowerCase();
      if (name === "style" || name.startsWith("on") || name === "srcset" || name === "srcdoc") {
        el.removeAttribute(attr.name);
      }
    });
  });

  return doc.documentElement.outerHTML;
}
