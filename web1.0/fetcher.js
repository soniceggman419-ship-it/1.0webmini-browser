const proxies = [
  "https://api.allorigins.win/raw?url=",
  "https://corsproxy.io/?",
];

export async function fetchPage(url) {
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
