const bookmarksBar = document.getElementById("bookmarksBar");
const bookmarkBtn = document.getElementById("bookmarkBtn");
const urlInput = document.getElementById("urlInput");

function loadBookmarks() {
  const bookmarks = JSON.parse(localStorage.getItem("web10_bookmarks") || "[]");
  bookmarksBar.innerHTML = "";
  bookmarks.forEach((b, i) => {
    const btn = document.createElement("button");
    btn.textContent = b.title || b.url;
    btn.title = b.url;
    btn.addEventListener("click", () => {
      urlInput.value = b.url;
      document.getElementById("goBtn").click();
    });
    bookmarksBar.appendChild(btn);
  });
}

bookmarkBtn.addEventListener("click", () => {
  const url = urlInput.value.trim();
  if (!url) return;
  const bookmarks = JSON.parse(localStorage.getItem("web10_bookmarks") || "[]");
  if (bookmarks.some(b => b.url === url)) return;
  const title = prompt("Bookmark name:", url);
  if (!title) return;
  bookmarks.push({ url, title });
  localStorage.setItem("web10_bookmarks", JSON.stringify(bookmarks));
  loadBookmarks();
});

loadBookmarks();
