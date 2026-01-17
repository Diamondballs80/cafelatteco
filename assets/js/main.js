const basePath = window.__BASE_PATH__ || "./";
const dataCache = {};

const loadData = async (name) => {
  if (dataCache[name]) return dataCache[name];
  const response = await fetch(`${basePath}src/data/${name}.json`);
  if (!response.ok) {
    throw new Error(`Unable to load ${name} data`);
  }
  const json = await response.json();
  dataCache[name] = json;
  return json;
};

const imageSource = (name) => ({
  webp: `${basePath}assets/images/${name}.webp`,
  fallback: `${basePath}assets/images/${name}.jpg`
});

const renderPicture = (name, alt = "") => {
  const src = imageSource(name);
  return `
    <picture>
      <source srcset="${src.webp}" type="image/webp">
      <img src="${src.fallback}" alt="${alt}">
    </picture>
  `;
};

const formatDate = (iso) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const buildNav = (site) => {
  const navEl = document.querySelector("[data-nav]");
  if (!navEl) return;

  const page = document.body.dataset.page || "";
  const isActive = (p) => (p === page ? 'aria-current="page"' : "");
  const homeHref = basePath === "./" ? "./" : basePath;

  navEl.innerHTML = `
    <div class="nav">
      <a class="nav__brand" href="${homeHref}">${site.brandName}</a>
      <div class="nav__links" aria-label="Primary">
        <a href="${basePath}about/" ${isActive("about")}>About</a>
        <a href="${basePath}locations/" ${isActive("locations")}>Locations</a>
        <a href="${basePath}events/" ${isActive("events")}>Events</a>
        <a href="${basePath}contact/" ${isActive("contact")}>Contact</a>
        <a href="${site.shopHref}" target="_blank" rel="noreferrer">Shop</a>
        <a href="${basePath}order/" ${isActive("order")}>Order</a>
      </div>
      <div class="nav__cta">
        <a class="btn primary" href="${basePath}order/">${site.primaryCtaLabel}</a>
      </div>
      <button class="nav__toggle" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
    </div>
    <div class="mobile-drawer" data-mobile-drawer>
      <a href="${basePath}about/">About</a>
      <a href="${basePath}locations/">Locations</a>
      <a href="${basePath}events/">Events</a>
      <a href="${basePath}contact/">Contact</a>
      <a href="${site.shopHref}" target="_blank" rel="noreferrer">Shop</a>
      <a href="${basePath}order/">Order</a>
      <a class="btn primary" href="${basePath}order/">${site.primaryCtaLabel}</a>
    </div>
  `;

  const toggle = navEl.querySelector(".nav__toggle");
  const drawer = navEl.querySelector("[data-mobile-drawer]");
  toggle?.addEventListener("click", () => {
    drawer?.classList.toggle("open");
  });
};

const buildFooter = (site) => {
  const footer = document.querySelector("[data-footer]");
  if (!footer) return;
  const logo = `${basePath}assets/images/cafeLatte_logo_rust.png`;
  footer.innerHTML = `
    <div class="footer">
      <div class="footer__inner">
        <div>
          <div class="footer__brand">
            <img src="${logo}" alt="${site.brandName} logo">
            <span class="sr-only">${site.brandName}</span>
          </div>
          <p class="muted">${site.tagline}</p>
        </div>
        <div class="list">
          <a href="${basePath}careers/">Careers</a>
          <a href="${basePath}privacy/">Privacy Policy</a>
        </div>
        <div class="list">
          <a href="${site.social.instagram}" target="_blank" rel="noreferrer">Instagram</a>
          <a href="${site.social.facebook}" target="_blank" rel="noreferrer">Facebook</a>
        </div>
      </div>
    </div>
  `;
};

const renderHero = (site) => {
  const hero = document.querySelector("[data-home-hero]");
  if (!hero) return;
  const heroImg = renderPicture(site.heroBackground || "hero-coffee", `${site.brandName} hero background`);
  const logo = `${basePath}assets/images/cafeLatte_logo.png`;
  hero.innerHTML = `
    <section class="hero hero--full" aria-label="${site.brandName}">
      <div class="hero__background" aria-hidden="true">
        ${heroImg}
      </div>
      <div class="hero__overlay"></div>
      <div class="hero__center">
        <div class="hero__logo-badge">
          <img src="${logo}" alt="${site.brandName} logo">
        </div>
        <a class="btn hero__cta" href="${basePath}${site.primaryCtaHref}">${site.primaryCtaLabel}</a>
      </div>
    </section>
  `;
};

const locationCard = (location) => {
  const statusChip =
    location.status === "comingSoon"
      ? '<span class="status-chip coming">Coming soon</span>'
      : `<span class="status-chip">Open · ${location.hoursShort}</span>`;
  const img = renderPicture(location.heroImage, `${location.name} interior`);
  const links = location.links || {};
  const optionalLink = (label, href) =>
    href
      ? `<a href="${href}" target="_blank" rel="noreferrer">${label}</a>`
      : "";

  return `
    <article class="card location-card">
      <div class="card__img">${img}</div>
      <div class="location-card__meta">
        <div class="eyebrow">${location.addressLines.join(" · ")}</div>
        ${statusChip}
      </div>
      <h3>${location.name}</h3>
      <p>${location.notes || ""}</p>
      <div class="location-card__links">
        <a href="${basePath}locations/${location.slug}.html">Details</a>
        ${optionalLink("Menu", links.menuUrl)}
        ${optionalLink("Order", links.orderUrl)}
        ${optionalLink("Delivery", links.deliveryUrl)}
        ${links.directionsUrl ? `<a href="${links.directionsUrl}" target="_blank" rel="noreferrer">Directions</a>` : ""}
      </div>
    </article>
  `;
};

const renderLocationsPreview = (locations) => {
  const target = document.querySelector("[data-locations-preview]");
  if (!target) return;
  const openFirst = locations.slice(0, 3);
  target.innerHTML = `
    <div class="section">
      <div class="container">
        <div class="split">
          <div>
            <div class="eyebrow">Locations</div>
            <h2>Find your spot</h2>
            <p>Three (and counting) Austin cafés pouring seasonal espresso, cold brew, and tacos made to order.</p>
            <a class="btn" href="${basePath}locations/">See all locations</a>
          </div>
          <div class="grid cards-3">
            ${openFirst.map(locationCard).join("")}
          </div>
        </div>
      </div>
    </div>
  `;
};

const renderAnnouncements = (announcements) => {
  const target = document.querySelector("[data-announcements]");
  if (!target) return;
  target.innerHTML = `
    <div class="section">
      <div class="container grid cards-2">
        ${announcements
          .map(
            (item) => `
              <div class="announcement card">
                <div>${renderPicture(item.image, item.headline)}</div>
                <div>
                  <div class="eyebrow">Happening now</div>
                  <h3>${item.headline}</h3>
                  <p>${item.body}</p>
                  <a class="btn" href="${basePath}${item.ctaHref}">${item.ctaLabel}</a>
                </div>
              </div>
            `
          )
          .join("")}
      </div>
    </div>
  `;
};

const renderPhotoGrid = (locations) => {
  const target = document.querySelector("[data-photo-grid]");
  if (!target) return;
  const gallerySet = new Set();
  locations.forEach((loc) => loc.galleryImages?.forEach((img) => gallerySet.add(img)));
  const images = Array.from(gallerySet).slice(0, 12);
  target.innerHTML = `
    <div class="section">
      <div class="container">
        <div class="eyebrow">Scenes</div>
        <h2>Daily polaroids</h2>
        <div class="photo-grid">
          ${images.map((img) => renderPicture(img, "Cafe Latte Co.")).join("")}
        </div>
      </div>
    </div>
  `;
};

const renderLocationsPage = (locations) => {
  const list = document.querySelector("[data-locations-list]");
  if (!list) return;
  list.innerHTML = locations.map(locationCard).join("");
};

const renderLocationDetail = (locations, site) => {
  const target = document.querySelector("[data-location-detail]");
  if (!target) return;

  const slug = document.body.dataset.locationSlug || window.location.pathname.split("/").pop()?.replace(".html", "");
  const location = locations.find((loc) => loc.slug === slug);
  if (!location) {
    target.innerHTML = `<p>Location not found.</p>`;
    return;
  }

  document.title = `${location.name} | ${site.brandName}`;
  const desc = `Details, hours, and ordering for ${location.name} at Cafe Latte Co.`;
  const descTag = document.querySelector('meta[name="description"]');
  if (descTag) descTag.setAttribute("content", desc);

  const links = location.links || {};
  const buttons = [
    links.menuUrl && `<a class="btn" href="${links.menuUrl}" target="_blank" rel="noreferrer">Menu</a>`,
    links.orderUrl && `<a class="btn primary" href="${links.orderUrl}" target="_blank" rel="noreferrer">Order</a>`,
    links.deliveryUrl && `<a class="btn" href="${links.deliveryUrl}" target="_blank" rel="noreferrer">Delivery</a>`,
    links.directionsUrl && `<a class="btn" href="${links.directionsUrl}" target="_blank" rel="noreferrer">Directions</a>`
  ]
    .filter(Boolean)
    .join("");

  target.innerHTML = `
    <div class="section">
      <div class="container">
        <div class="location-hero">
          ${renderPicture(location.heroImage, location.name)}
          <div class="location-hero__overlay">
            <div class="location-hero__content">
              <div class="pill">Hot coffee, good food</div>
              <h1>${location.name}</h1>
              <p>${location.hoursLong || location.hoursShort}</p>
              <div class="btn-row">${buttons}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="container split">
        <div>
          <div class="eyebrow">Address</div>
          <p>${location.addressLines.join("<br>")}</p>
          ${location.phone ? `<p>${location.phone}</p>` : ""}
          <div class="tag-row">
            <span class="chip">${location.status === "comingSoon" ? "Coming soon" : "Open"}</span>
            <span class="chip">${location.hoursShort}</span>
          </div>
        </div>
        <div>
          <div class="eyebrow">About this shop</div>
          <p>${location.notes || "Good coffee, tacos, and friendly faces all day."}</p>
          <div class="gallery">
            ${location.galleryImages.map((img) => renderPicture(img, location.name)).join("")}
          </div>
        </div>
      </div>
    </div>
  `;
};

const renderEventsPage = (events, locations) => {
  const list = document.querySelector("[data-events-list]");
  if (!list) return;
  const lookup = Object.fromEntries(locations.map((l) => [l.slug, l.name]));
  list.innerHTML = events
    .map((event) => {
      const img = renderPicture(event.image, event.title);
      const locationName = event.locationSlug ? lookup[event.locationSlug] : "All locations";
      return `
        <article class="card event-card">
          ${img}
          <div>
            <div class="eyebrow">${locationName}</div>
            <h3>${event.title}</h3>
            <p>${event.description}</p>
            <div class="tag-row">
              <span class="chip">${event.timeDisplay}</span>
              <span class="chip">${formatDate(event.dateStartISO)}</span>
            </div>
            <div class="btn-row" style="margin-top:10px;">
              ${event.ctaUrl ? `<a class="btn primary" href="${event.ctaUrl}" target="_blank" rel="noreferrer">${event.ctaLabel || "More info"}</a>` : ""}
              ${event.directionsUrl ? `<a class="btn" href="${event.directionsUrl}" target="_blank" rel="noreferrer">Directions</a>` : ""}
            </div>
          </div>
        </article>
      `;
    })
    .join("");
};

const renderOrderPage = (locations) => {
  const list = document.querySelector("[data-order-list]");
  if (!list) return;
  let unavailable = 0;
  list.innerHTML = locations
    .map((loc) => {
      const hasOrder = Boolean(loc.links?.orderUrl);
      if (!hasOrder) unavailable += 1;
      return `
        <div class="order-card">
          <div>
            <div class="eyebrow">${loc.addressLines.join(" · ")}</div>
            <h3>${loc.name}</h3>
            <p>${loc.hoursShort}</p>
          </div>
          <div class="order-card__actions">
            ${
              hasOrder
                ? `<a class="btn primary" href="${loc.links.orderUrl}" target="_blank" rel="noreferrer">Order</a>`
                : `<span class="chip">Not yet available</span>`
            }
            ${loc.links?.deliveryUrl ? `<a class="btn" href="${loc.links.deliveryUrl}" target="_blank" rel="noreferrer">Delivery</a>` : ""}
            ${loc.links?.directionsUrl ? `<a class="btn" href="${loc.links.directionsUrl}" target="_blank" rel="noreferrer">Directions</a>` : ""}
          </div>
        </div>
      `;
    })
    .join("");

  const note = document.querySelector("[data-order-note]");
  if (note && unavailable > 0) {
    note.innerHTML = `<div class="alert">Not available for ${unavailable} location(s) yet. Coming soon.</div>`;
  }
};

const renderContactPage = (site) => {
  const target = document.querySelector("[data-contact]");
  if (!target) return;
  const mailto = `mailto:${site.contactEmail}`;
  target.querySelector("[data-contact-email]").textContent = site.contactEmail;
  target.querySelector("[data-contact-email]").setAttribute("href", mailto);
  const phone = target.querySelector("[data-contact-phone]");
  if (site.contactPhone && phone) {
    phone.textContent = site.contactPhone;
    phone.setAttribute("href", `tel:${site.contactPhone.replace(/[^\\d]/g, "")}`);
  }
  const press = target.querySelector("[data-press-email]");
  if (press && site.pressEmail) {
    press.textContent = site.pressEmail;
    press.setAttribute("href", `mailto:${site.pressEmail}`);
  }
  const form = target.querySelector("form");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const subject = encodeURIComponent(`Cafe Latte Co. inquiry from ${data.get("name")}`);
    const body = encodeURIComponent(`${data.get("message")}\n\nReply to: ${data.get("email")}`);
    window.location.href = `${mailto}?subject=${subject}&body=${body}`;
  });
};

const init = async () => {
  try {
    const site = await loadData("site");
    buildNav(site);
    buildFooter(site);

    const page = document.body.dataset.page || "home";
    if (page === "home") {
      renderHero(site);
      const [locations, announcements] = await Promise.all([loadData("locations"), loadData("announcements")]);
      renderLocationsPreview(locations);
      renderAnnouncements(announcements);
      renderPhotoGrid(locations);
    }
    if (page === "about") {
      const locations = await loadData("locations");
      renderPhotoGrid(locations);
    }
    if (page === "locations") {
      const locations = await loadData("locations");
      renderLocationsPage(locations);
    }
    if (page === "location-detail") {
      const [locations] = await Promise.all([loadData("locations")]);
      renderLocationDetail(locations, site);
    }
    if (page === "events") {
      const [events, locations] = await Promise.all([loadData("events"), loadData("locations")]);
      renderEventsPage(events, locations);
    }
    if (page === "order") {
      const locations = await loadData("locations");
      renderOrderPage(locations);
    }
    if (page === "contact") {
      renderContactPage(site);
    }
  } catch (err) {
    console.error(err);
  }
};

document.addEventListener("DOMContentLoaded", init);
