import http from "node:http";
import https from "node:https";
import fs from "node:fs";
import path from "node:path";

const PORT = 8080;
const publicDir = ".";

const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".txt": "text/plain",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // Proxy endpoint
  if (url.pathname === "/proxy") {
    const target = url.searchParams.get("url");
    if (!target) {
      res.writeHead(400);
      res.end("Missing url param");
      return;
    }

    const targetUrl = new URL(target);
    const proxyReq = (targetUrl.protocol === "https:" ? https : http).request(targetUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MiniBrowser/1.0)",
        "Accept": "text/html,application/xhtml+xml,text/plain,*/*",
      },
      timeout: 15000,
    }, (proxyRes) => {
      let body = "";
      proxyRes.on("data", (chunk) => body += chunk.toString());
      proxyRes.on("end", () => {
        res.writeHead(200, {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": proxyRes.headers["content-type"] || "text/html",
        });
        res.end(body);
      });
    });

    proxyReq.on("error", () => {
      res.writeHead(502);
      res.end("Proxy error");
    });

    proxyReq.end();
    return;
  }

  // Serve static files
  let filePath = url.pathname === "/" ? "/index.html" : url.pathname;
  filePath = path.join(publicDir, filePath);
  filePath = path.normalize(filePath);

  if (!filePath.startsWith(path.resolve(publicDir))) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": mime[ext] || "application/octet-stream" });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});
