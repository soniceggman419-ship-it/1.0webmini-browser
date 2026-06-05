const proxy = "https://api.allorigins.win/raw?url=";

export async function fetchPage(url) {
  const res = await fetch(proxy + encodeURIComponent(url));

  if (!res.ok) {
    throw new Error("Network response failed");
  }

  return await res.text();
}
