const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

const rootDir = process.cwd();
const outputDir = path.join(rootDir, "dist-pages");
const entries = [
  { source: "index.html", target: "index.html" },
  { source: "app.js", target: "app.js" },
  { source: "styles.css", target: "styles.css" },
  { source: "public-config.js", target: "public-config.js" },
  { source: "assets/images", target: "assets/images" },
  { source: "studio", target: "studio" }
];

function getBuildVersion() {
  if (process.env.GITHUB_SHA) {
    return process.env.GITHUB_SHA.slice(0, 8);
  }

  try {
    const revision = childProcess
      .execSync("git rev-parse --short HEAD", {
        cwd: rootDir,
        stdio: ["ignore", "pipe", "ignore"]
      })
      .toString()
      .trim();

    if (revision) {
      return revision;
    }
  } catch {
    // Ignore git lookup failures and fall back to a timestamp.
  }

  return String(Date.now());
}

function appendVersionQuery(url, version) {
  return `${url}${url.includes("?") ? "&" : "?"}v=${version}`;
}

function replaceAsciiTextInBuffer(buffer, searchValue, replacementValue) {
  const text = buffer.toString("latin1");

  if (!text.includes(searchValue)) {
    return buffer;
  }

  return Buffer.from(text.split(searchValue).join(replacementValue), "latin1");
}

function rewriteVersionedHtml(targetFile, replacements) {
  let content = fs.readFileSync(targetFile);

  replacements.forEach(({ from, to }) => {
    content = replaceAsciiTextInBuffer(content, from, to);
  });

  fs.writeFileSync(targetFile, content);
}

function copyEntry(sourcePath, targetPath) {
  const stats = fs.statSync(sourcePath);

  if (stats.isDirectory()) {
    fs.mkdirSync(targetPath, { recursive: true });

    for (const child of fs.readdirSync(sourcePath)) {
      copyEntry(path.join(sourcePath, child), path.join(targetPath, child));
    }

    return;
  }

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
}

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

entries.forEach((entry) => {
  copyEntry(path.join(rootDir, entry.source), path.join(outputDir, entry.target));
});

const buildVersion = getBuildVersion();

rewriteVersionedHtml(path.join(outputDir, "index.html"), [
  { from: 'href="./styles.css"', to: `href="${appendVersionQuery("./styles.css", buildVersion)}"` },
  { from: 'src="./public-config.js"', to: `src="${appendVersionQuery("./public-config.js", buildVersion)}"` },
  { from: 'src="./app.js"', to: `src="${appendVersionQuery("./app.js", buildVersion)}"` },
  { from: 'href="./studio/intake-studio.html"', to: `href="${appendVersionQuery("./studio/intake-studio.html", buildVersion)}"` },
  { from: 'src="./studio/intake-studio.html"', to: `src="${appendVersionQuery("./studio/intake-studio.html", buildVersion)}"` }
]);

rewriteVersionedHtml(path.join(outputDir, "studio", "intake-studio.html"), [
  { from: 'href="./intake-studio.css"', to: `href="${appendVersionQuery("./intake-studio.css", buildVersion)}"` },
  { from: 'src="../public-config.js"', to: `src="${appendVersionQuery("../public-config.js", buildVersion)}"` },
  { from: 'src="./intake-studio.js"', to: `src="${appendVersionQuery("./intake-studio.js", buildVersion)}"` }
]);

if (fs.existsSync(path.join(rootDir, "CNAME"))) {
  copyEntry(path.join(rootDir, "CNAME"), path.join(outputDir, "CNAME"));
}

fs.writeFileSync(path.join(outputDir, ".nojekyll"), "");
