const viewer = document.getElementById("viewer");
const statusBar = document.getElementById("statusBar");

let currentBlobURL = null;

export function renderPage(html) {
  // Show loading status
  statusBar.textContent = "Loading...";

  // Revoke old Blob URL if it exists
  if (currentBlobURL) {
    URL.revokeObjectURL(currentBlobURL);
    currentBlobURL = null;
  }

  // Create new Blob and URL
  const blob = new Blob([html], { type: "text/html" });
  currentBlobURL = URL.createObjectURL(blob);

  // Set the viewer src
  viewer.src = currentBlobURL;

  // Handle successful load
  viewer.onload = () => {
    statusBar.textContent = "Done";
  };

  // Handle loading errors
  viewer.onerror = () => {
    statusBar.textContent = "Failed to load page";
  };
