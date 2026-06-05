const viewer = document.getElementById("viewer");
const statusBar = document.getElementById("statusBar");

let currentBlobURL = null;

export function renderPage(html) {
  statusBar.textContent = "Loading...";

  if (currentBlobURL) {
    URL.revokeObjectURL(currentBlobURL);
    currentBlobURL = null;
  }

  const blob = new Blob([html], { type: "text/html" });
  currentBlobURL = URL.createObjectURL(blob);

  viewer.src = currentBlobURL;
}

export function onViewerReady(callback) {
  viewer.onload = () => {
    statusBar.textContent = "Done";
    callback();
  };
  viewer.onerror = () => {
    statusBar.textContent = "Failed to load page";
  };
}

export function setCurrentUrl(url) {
  viewer.setAttribute("data-current-url", url);
}
