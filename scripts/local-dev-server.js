const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const projectRoot = path.resolve(__dirname, "..");
const defaultHost = process.env.HOST || "127.0.0.1";
const defaultPort = Number.parseInt(process.env.PORT || "3000", 10);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};

function getArgValue(flag) {
  const index = process.argv.indexOf(flag);

  if (index === -1) {
    return "";
  }

  return process.argv[index + 1] || "";
}

const host = getArgValue("--host") || defaultHost;
const port = Number.parseInt(getArgValue("--port") || String(defaultPort), 10);

function getContentType(filePath) {
  return mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

function sendJson(response, statusCode, payload) {
  const body = JSON.stringify(payload, null, 2);

  response.writeHead(statusCode, {
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(body),
    "Content-Type": "application/json; charset=utf-8"
  });
  response.end(body);
}

function normalizeRequestPath(requestUrl) {
  const url = new URL(requestUrl, "http://localhost");
  let pathname = decodeURIComponent(url.pathname || "/");

  if (pathname === "/") {
    pathname = "/index.html";
  }

  return pathname;
}

async function resolveFilePath(requestPath) {
  const safeRelativePath = requestPath.replace(/^\/+/, "");
  let resolvedPath = path.resolve(projectRoot, safeRelativePath);

  if (!resolvedPath.startsWith(projectRoot)) {
    return "";
  }

  try {
    const stats = await fs.promises.stat(resolvedPath);

    if (stats.isDirectory()) {
      resolvedPath = path.join(resolvedPath, "index.html");
    }
  } catch {
    return "";
  }

  try {
    const stats = await fs.promises.stat(resolvedPath);
    return stats.isFile() ? resolvedPath : "";
  } catch {
    return "";
  }
}

function printServerAddresses() {
  console.log("");
  console.log("Local frontend server is running.");
  console.log(`Project root: ${projectRoot}`);
  console.log(`Local URL: http://${host}:${port}`);

  if (host === "0.0.0.0") {
    const interfaces = os.networkInterfaces();
    const networkUrls = [];

    Object.values(interfaces).forEach((items) => {
      (items || []).forEach((item) => {
        if (item.family === "IPv4" && !item.internal) {
          networkUrls.push(`http://${item.address}:${port}`);
        }
      });
    });

    if (networkUrls.length) {
      console.log("LAN URLs:");
      networkUrls.forEach((url) => console.log(`  ${url}`));
    }
  }

  console.log("Press Ctrl+C to stop.");
  console.log("");
}

const server = http.createServer(async (request, response) => {
  if (!request.url) {
    sendJson(response, 400, { error: "Missing request URL." });
    return;
  }

  if (!["GET", "HEAD"].includes(request.method || "GET")) {
    response.writeHead(405, {
      "Allow": "GET, HEAD",
      "Cache-Control": "no-store"
    });
    response.end();
    return;
  }

  const requestPath = normalizeRequestPath(request.url);
  const filePath = await resolveFilePath(requestPath);

  if (!filePath) {
    sendJson(response, 404, {
      error: "File not found.",
      path: requestPath
    });
    return;
  }

  try {
    const stats = await fs.promises.stat(filePath);

    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Length": stats.size,
      "Content-Type": getContentType(filePath)
    });

    if (request.method === "HEAD") {
      response.end();
      return;
    }

    fs.createReadStream(filePath).pipe(response);
  } catch (error) {
    console.error(error);
    sendJson(response, 500, { error: "Failed to read file." });
  }
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use. Try a different PORT or close the old server.`);
    process.exit(1);
  }

  console.error(error);
  process.exit(1);
});

server.listen(port, host, () => {
  printServerAddresses();
});

process.on("SIGINT", () => {
  server.close(() => process.exit(0));
});

