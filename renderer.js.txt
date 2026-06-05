const viewer = document.getElementById("viewer");

export function renderPage(html) {
  const blob = new Blob([html], { type: "text/html" });
  const blobURL = URL.createObjectURL(blob);

  viewer.src = blobURL;
}
