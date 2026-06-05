export function toPlainText(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return `<pre>${doc.body.innerText}</pre>`;
}
