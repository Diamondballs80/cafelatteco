const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dataDir = path.join(root, "src", "data");

const loadJson = (file) => JSON.parse(fs.readFileSync(path.join(dataDir, file), "utf8"));

const site = loadJson("site.json");
const locations = loadJson("locations.json");

const htmlForLocation = (loc) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${loc.name} | ${site.brandName}</title>
  <meta name="description" content="Details, hours, and ordering for ${loc.name} at ${site.brandName}.">
  <meta property="og:title" content="${loc.name} | ${site.brandName}">
  <meta property="og:description" content="Coffee, tacos, and community in ${loc.addressLines.join(", ")}.">
  <meta property="og:image" content="../assets/images/${loc.heroImage}.jpg">
  <link rel="stylesheet" href="../assets/css/styles.css">
  <script>window.__BASE_PATH__ = "../";</script>
  <script src="../assets/js/main.js" defer></script>
</head>
<body data-page="location-detail" data-location-slug="${loc.slug}">
  <header data-nav></header>
  <main class="page">
    <div data-location-detail></div>
  </main>
  <div data-footer></div>
</body>
</html>`;

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const buildLocations = () => {
  const outDir = path.join(root, "locations");
  ensureDir(outDir);
  locations.forEach((loc) => {
    const filePath = path.join(outDir, `${loc.slug}.html`);
    fs.writeFileSync(filePath, htmlForLocation(loc));
    console.log(`Generated ${filePath}`);
  });
};

const buildSitemap = () => {
  const urls = [
    "",
    "about/",
    "locations/",
    "events/",
    "order/",
    "contact/",
    "privacy/",
    "careers/"
  ];
  const locUrls = locations.map((loc) => `locations/${loc.slug}.html`);
  const lines = [...urls, ...locUrls].map(
    (url) => `<url><loc>https://diamondballs80.github.io/cafelatteco/${url}</loc></url>`
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${lines.join(
    "\n"
  )}\n</urlset>\n`;
  fs.writeFileSync(path.join(root, "sitemap.xml"), xml);
  console.log("sitemap.xml updated");
};

buildLocations();
buildSitemap();
