# Coffee Shop Website Spec (Jo’s-style template)

## Goal
Build a fast, modern, responsive marketing site for a coffee shop. The site should follow the structure, feel, and content patterns of https://www.joscoffee.com/ as a template (not a pixel-perfect clone). The repo must be suitable for deployment on GitHub Pages with a CNAME file for the paid custom domain.

## Non-Goals (for MVP)
- No user accounts
- No online payments on this site
- No Clover integration yet (ordering will be a link-out CTA for now)
- No CMS required (content stored in simple JSON files)

## Tech/Repo Requirements
- Static site that works on GitHub Pages.
- Plain HTML/CSS/JS OR a static build framework (acceptable: Astro / Next.js static export / Vite).
- No server-side rendering required.
- All site content (locations, hours, announcements, events) must be editable via JSON in `/src/data/`.
- Output must be accessible (semantic HTML, keyboard nav, alt text), responsive, and fast.

## Repository & GitHub Pages Publishing Assumptions (IMPORTANT)
- Codex must work within the existing Git repository for this project and must not initialize a new repository.
- The canonical repository is: https://github.com/DiamondGeezer/cafelatteco
- Default branch is `main`.
- The site must be publishable via GitHub Pages from the `main` branch.
- Prefer a structure that publishes from the repository root (i.e., the published output includes an `index.html` at the root of the publish source).
- Use relative paths suitable for project pages (the site may be served under a subpath like `/cafelatteco/`).
- All built assets (HTML, CSS, JS, images, fonts) must work correctly when served from the project subpath `https://diamondballs80.github.io/cafelatteco/`.
- Include an empty `.nojekyll` file at the publish root to prevent Jekyll processing issues.

## Deployment Requirements
- Repo supports GitHub Pages publishing.
- Include `/CNAME` file (domain placeholder: `www.REPLACE_WITH_DOMAIN.com`).
- Use relative paths suitable for GitHub Pages.
- Provide a short `DEPLOY.md` that explains:
  - how to run locally
  - how to build
  - how GitHub Pages publishes
  - where to set the custom domain + HTTPS

## Information Architecture / Sitemap
Top navigation (desktop + mobile hamburger):
- Home: `/`
- About: `/about`
- Locations: `/locations`
- Contact: `/contact`
- Events: `/events`
- Shop: external link (e.g. Shopify store)
- Order: `/order`

Footer:
- Careers (external or internal stub page): `/careers` (or external link)
- Privacy Policy: `/privacy`
- Social links: Instagram, Facebook

## Page Specs

### 1) Home (`/`)
Hero section:
- Large headline (all-caps style vibe) and short subheadline.
- Primary CTA button: “Order Now”
- Secondary CTA: “Menu” or “Locations”
- Optional animated/looping small image area (GIF/video) — keep light.

Locations preview section:
- Grid/list of location cards
- Each card includes:
  - location name
  - hours (short)
  - address
  - quick links:
    - Menu (PDF link or internal section)
    - Order (external provider or `/order`)
    - Directions (Google Maps)

Announcement/feature sections (2–3 blocks):
- Each block:
  - image
  - headline
  - 1–2 paragraphs
  - optional CTA

Photo grid (masonry or simple responsive grid):
- 8–16 images optimized for web.

### 2) About (`/about`)
- Simple brand story copy
- 3–6 images in a gallery
- Optional: short “values” row (coffee, tacos, community, etc.)

### 3) Locations index (`/locations`)
- List/grid of all locations
- Each entry links to a location detail page.
- Support “Coming Soon” badge.

### 4) Location detail pages (`/locations/:slug`)
Generate pages from JSON data.
Each location detail page includes:
- Headline: “Hot coffee good food” style
- Location name, hours, address
- Buttons: Menu, Order, Delivery, Directions (show only if present)
- Hero photo
- Gallery photos (6–12)
- Optional: “Events” section for that location (if events tagged)

### 5) Order (`/order`)
Purpose: “Choose your location to order ahead.”
- List locations with “Order” buttons”
- Some locations may not support ordering (show disabled note)
- Copy note: “Not available for X location(s)” if relevant

### 6) Events (`/events`)
- Hero intro text
- List upcoming events as cards:
  - title
  - location
  - date/time
  - short description
  - CTA: Directions / Tickets / More info
- Data-driven from JSON.

### 7) Contact (`/contact`)
- Simple contact form (front-end only for MVP) with fields:
  - name
  - email
  - message
- For MVP, the form can:
  - open a mailto fallback
  - OR post to a placeholder endpoint (to be wired later)
- Also include:
  - general email
  - phone (optional)
  - press/inquiries block (optional)

### 8) Privacy (`/privacy`)
- A simple privacy policy template page.

### 9) Careers (`/careers`)
- Either a stub page with a link to the hiring platform OR an external link.
- Include a simple “email us your resume” fallback.

## Content/Data Model
Create `/src/data/` with:

### `locations.json`
Array of locations:
- id
- slug
- name
- status: open|comingSoon
- hoursShort
- hoursLong (optional)
- addressLines (array)
- phone (optional)
- links:
  - menuUrl (optional)
  - orderUrl (optional)
  - deliveryUrl (optional)
  - directionsUrl (required)
- heroImage
- galleryImages (array)
- notes (optional)

### `events.json`
Array of events:
- id
- title
- locationSlug (optional)
- dateStartISO
- dateEndISO (optional)
- timeDisplay (string)
- description
- ctaLabel (optional)
- ctaUrl (optional)
- directionsUrl (optional)
- image

### `site.json`
- brandName
- tagline
- primaryCtaLabel
- primaryCtaHref
- shopHref
- social:
  - instagram
  - facebook
- seo defaults

## Visual Design (Jo’s-inspired)
- Minimal, bold typography
- Strong all-caps headings
- Lots of whitespace
- Large photography
- Simple buttons with strong contrast
- Mobile-first with clean nav + overlay menu

## Fonts (LOCAL SELF-HOSTED — REQUIRED)

A custom brand font is provided and must be self-hosted locally.

Source font file:
- `/assets/fonts/CafeLatteCoFont.woff`

Codex MUST perform the following steps:
1. Preserve the original `.woff` file.
2. Transcode `CafeLatteCoFont.woff` into `CafeLatteCoFont.woff2`.
3. Output the `.woff2` file to `/assets/fonts/`.
4. Commit both font files to the repository.
5. Do not hotlink or reference any external font providers.

Preferred transcoding method (if CLI tools are available):
- Run `woff2_compress CafeLatteCoFont.woff`.

If CLI tools are unavailable, use a build-step or programmatic method that produces a valid `.woff2` file.

Final expected folder structure:
- `/assets/fonts/CafeLatteCoFont.woff`
- `/assets/fonts/CafeLatteCoFont.woff2`

Register the font in the global stylesheet using `@font-face`:
- font-family: `CafeLatteCo`
- font-weight: 400
- font-style: normal
- font-display: swap
- source order must prefer `.woff2` first, then `.woff`

Fonts must be wired exclusively via CSS variables:
- `--font-display` for headings
- `--font-body` for body text

Both variables must reference the `CafeLatteCo` font and include system font fallbacks.

No hardcoded `font-family` declarations are allowed outside these variables.

## Images
- Use modern formats where possible (WebP/AVIF), fall back to JPG.
- Optimize size for fast load.
- Provide alt text.

## SEO
- Unique title + meta description per page.
- OpenGraph tags default in layout with overrides per page.
- Sitemap.xml (optional but recommended).
- robots.txt basic.

## Deliverables
- Full site implementation with all pages above
- JSON-driven content
- `CNAME` placeholder file
- `DEPLOY.md`
- Clean, readable code and folder structure

## Future Hook (Phase 2)
- Add “Order Ahead” integration (Clover/third-party) via `/order` page links first.
- Later: build a real ordering flow + backend (Parse/Back4App) + Clover API integration and printing.
