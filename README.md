# CityPulse — city-journal prototype

A static, framework-free website. All places, ratings, prices, reports and conditions are **sample data**.

## Run it
Open `index.html` in a browser, or serve the folder:

    cd citypulse && python3 -m http.server 8000   # then visit http://localhost:8000

No build step or dependencies. Fonts load from Google Fonts (falls back to Georgia/system sans offline).

## Files
- `index.html` — page structure, all sections, semantic markup and labels.
- `css/styles.css` — design tokens (ivory, forest, terracotta, sage), layout, responsive rules. No animation or transitions.
- `js/data.js` — all sample content (`places`, `notes`, `reports`, `routes`). Replace this with API/CMS data.
- `js/app.js` — small render functions sharing one `state` object: map, picks, saved list, tools, safety, report form.
- `images/` — drop photos here and set `image: "images/name.jpg"` on a place; otherwise an illustration is drawn.

## What needs a real backend/API
- Weather and traffic in the snapshot (weather API, traffic API).
- Map: swap the illustrative SVG for Leaflet/Mapbox/Google Maps; keep `x,y` → lat/lng in `data.js`.
- Routing and any “steadier route” logic (routing API plus verified lighting/footfall data).
- Reports: submissions currently use `localStorage`; a server must store, moderate and verify them.
- “Verified” labels: only apply with a named official source. None are shown in this prototype.
- Saved places use `localStorage` (per browser); accounts need a backend.
