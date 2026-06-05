const input = document.getElementById("urlInput");
const button = document.getElementById("goBtn");
const viewer = document.getElementById("viewer");

const proxies = [
  "https://api.allorigins.win/raw?url=",
  "https://corsproxy.io/?",
];

button.addEventListener("click", loadPage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") loadPage();
});

async function fetchPage(url) {
  for (const proxy of proxies) {
    try {
      const fullUrl = proxy + encodeURIComponent(url);
      const res = await fetch(fullUrl, {
        signal: AbortSignal.timeout(10000),
      });
      if (res.ok) {
        const text = await res.text();
        if (text && text.length > 0) return text;
      }
    } catch {
      continue;
    }
  }
  throw new Error("All proxies failed");
}

async function loadPage() {
  let url = input.value.trim();
  if (!url) return;
  if (!url.startsWith("http")) url = "https://" + url;

  try {
    const html = await fetchPage(url);

    // Strip unwanted tags
    let clean = html
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
      .replace(/<link[\s\S]*?rel=["']?stylesheet["']?[\s\S]*?>/gi, "")
      .replace(/<img[\s\S]*?>/gi, "")
      .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
      .replace(/<video[\s\S]*?>[\s\S]*?<\/video>/gi, "")
      .replace(/<audio[\s\S]*?>[\s\S]*?<\/audio>/gi, "")
      .replace(/<source[\s\S]*?>/gi, "")
      .replace(/<object[\s\S]*?>[\s\S]*?<\/object>/gi, "")
      .replace(/<embed[\s\S]*?>/gi, "")
      .replace(/style="[^"]*"/gi, "")
      .replace(/on\w+="[^"]*"/gi, "")
      .replace(/srcdoc="[^"]*"/gi, "")
      .replace(/srcset="[^"]*"/gi, "");

    const blob = new Blob([clean], { type: "text/html" });
    viewer.src = URL.createObjectURL(blob);
  } catch (err) {
    alert("Failed: " + err.message);
  }
}
