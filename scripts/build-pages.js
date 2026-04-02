const fs = require("fs");
const path = require("path");

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

if (fs.existsSync(path.join(rootDir, "CNAME"))) {
  copyEntry(path.join(rootDir, "CNAME"), path.join(outputDir, "CNAME"));
}

fs.writeFileSync(path.join(outputDir, ".nojekyll"), "");
