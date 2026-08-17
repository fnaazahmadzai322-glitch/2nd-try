# Pagani Dubai — Private Hypercar Showroom

A premium, cinematic single-page website for a private Pagani hypercar showroom in the UAE.
Black + neon green + carbon-fiber aesthetic, GSAP + ScrollTrigger + Lenis smooth scroll, and a
scroll-driven "exploded" engineering diagram inspired by Apple-style product reveals.

Static site, no build step or dependencies required.

## Sections

Hero (configurator-style flagship reveal) · Marquee · Car Collection · 3D Reveal (exploded car
diagram) · Performance (stats + spark canvas) · Our Story · UAE Showroom (map + hours) ·
Private Consultation (booking form) · Contact.

## Structure

```
index.html          # all page content/sections
css/style.css        # design system + layout + animations
css/lenis.css         # Lenis base styles
js/script.js          # Lenis + GSAP/ScrollTrigger interactions, exploded-car timeline, form
js/vendor/            # gsap.min.js, ScrollTrigger.min.js, lenis.min.js (bundled, no CDN needed)
assets/cars/           # drop real Pagani photography here (see below)
assets/video/          # optional hero background video
```

## Run locally

Just open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8080
# visit http://localhost:8080
```

## Adding your own photography / video

The Hero and Car Collection cards currently show original neon wireframe illustrations as
placeholders (no real Pagani photos are bundled, to avoid licensing issues). Drop your own
images/video at these **exact paths** and they'll appear automatically — no code changes needed:

| File | Used in |
|---|---|
| `assets/cars/zonda-r.jpg` | Hero + Collection card 1 (Zonda R) |
| `assets/cars/huayra-bc.jpg` | Collection card 2 (Huayra BC) |
| `assets/cars/huayra-codalunga.jpg` | Collection card 3 (Huayra Codalunga) |
| `assets/cars/utopia.jpg` | Collection card 4 (Utopia) |
| `assets/video/hero.mp4` | Optional cinematic hero background video |

If a file is missing, the wireframe illustration shows instead — nothing breaks.

## Editing content

- **Models, specs, pricing**: edit the four `.model-card` blocks in the `#collection` section of `index.html`. Prices are indicative "from" figures — update in both the Hero and each model card.
- **Showroom address/hours/map**: edit the `#showroom` section; the map is a keyless Google Maps embed driven by the address query string in the iframe `src`.
- **Consultation form**: the form in `#consultation` is front-end only (no backend wired up) — it shows a success message on submit. Connect `js/script.js`'s `consultationForm` submit handler to your CRM/email endpoint to make it live.
- **Contact links**: update the `href` values in the `#contact` section (phone, WhatsApp, email, map link) and the social row.
- **Colors/fonts**: CSS custom properties are defined at the top of `css/style.css` under `:root`.

## Deploy

Works as-is on GitHub Pages, Netlify, Vercel, or any static host — no build command needed.

## Note

This is a concept/demo showroom experience built for illustration. Pagani and associated model
names are trademarks of Pagani Automobili S.p.A. — swap in officially licensed photography and
video before any public/commercial launch.
