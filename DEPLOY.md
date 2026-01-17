# Deploying Cafe Latte Co.

## Run locally
1) From the project root: `python3 -m http.server 3000`
2) Open `http://localhost:3000/` to browse the site.

## Data-driven build
Location detail pages and `sitemap.xml` are generated from JSON.
Run this after changing files in `src/data/`:
```bash
node scripts/build.js
```

## GitHub Pages
- Publish from the `main` branch using the repository root as the Pages source.
- `.nojekyll` is present to skip Jekyll processing.
- `CNAME` contains a placeholder (`www.REPLACE_WITH_DOMAIN.com`). Update it to the paid domain, then push to `main`.
- All paths are relative-friendly, so the site works under `https://diamondballs80.github.io/cafelatteco/`.

## Custom domain + HTTPS
1) In GitHub: Settings → Pages → Custom domain → enter your domain (same as `CNAME`).
2) Enable “Enforce HTTPS” once the certificate is issued.
3) Verify DNS has an ALIAS/ANAME for the apex and a CNAME for `www` pointing to `cname.github.io`.
