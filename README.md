# Bendex Print, Copy & Graphic Center — Website

Marketing site for Bendex Print, Copy & Graphic Center
10875 Plano Road, Suite 101 · Dallas, TX 75238 · 214-341-7778

Plain HTML/CSS/JS. No build step, no dependencies, no framework.
Any static host will serve it as-is.

## Run it locally

```bash
cd bendex-site
python3 -m http.server 8080
```

Then open http://localhost:8080

(Any static server works — `npx serve`, `php -S localhost:8080`, VS Code Live Server, etc.)

## Files

| File | Purpose |
|---|---|
| `index.html` | The entire site — one page, anchored sections |
| `styles.css` | All styling. Brand colors are CSS variables at the top of the file |
| `script.js` | Mobile nav, service search/filter, form validation, mailto composer, scroll reveals |
| `assets/favicon.svg` | Browser tab icon |

## Sections

Header/topbar · Hero · Services (searchable, 8 categories) · Wide Format ·
How It Works · Quote Form · About · Contact + Map · Footer

## Editing common things

**Brand colors** — top of `styles.css`, the `:root` block (`--navy`, `--blue`, `--red`, `--yellow`).

**Phone / email / address** — search `index.html` for `214-341-7778`, `sales@bendexprintandcopy.com`,
or `10875`. They appear in the topbar, hero, quote section, contact section, footer,
the mobile call button, and the JSON-LD schema block in `<head>`.

**Services** — each category is an `<article class="card">` in the `#services` section.
Add a product by adding an `<li>` to that card's `<ul class="tags">`. The search box
picks it up automatically; no JS changes needed.

**Hours** — in the `#contact` section, under the "Hours" heading.

## ⚠️ Unverified content — confirm before going live

These were NOT in the source material and are currently placeholders:

1. **Business hours** (Mon–Fri 9–6, Sat by appointment) — invented.
2. **"Same-day color copies"** (hero pill) and **"local delivery"** (step 04) —
   inferred from "High Speed Photocopy" on the brochure. Remove if inaccurate.
3. **The logo** in the header/footer is an SVG recreation of the Bendex swoosh,
   not the original artwork. Replace with the real vector file when available.

## Before launch

- [ ] Confirm the three items above with BC Nwosu
- [ ] Replace the logo with the original vector art
- [ ] Swap the quote form's `mailto:` for a real form backend (Formspree, Netlify Forms,
      Basin) so submissions hit the inbox directly and support file uploads.
      See the `form.addEventListener('submit', ...)` block in `script.js`.
- [ ] Add real photos of the shop and past work
- [ ] Point the domain (bendexprintandcopy.com) at the host
- [ ] Set up Google Business Profile so the map/hours match

## Source material

Built from four photos supplied by the client: the tri-fold brochure (both sides),
BC Nwosu's business card, and the services card.
