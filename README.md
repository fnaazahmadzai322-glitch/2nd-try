# Sharique Aslam — Portfolio Website

A premium, dark, futuristic single-page portfolio for **Sharique Aslam ([@4LizX_Web](https://x.com/4LizX_Web))** — Web3 Content Creator, Ambassador, and Community Builder.

Static site, no build step or dependencies required.

## Structure

```
index.html       # all page content/sections
css/style.css     # design system + layout + animations
js/script.js      # nav toggle, scroll reveal, clipboard copy
```

## Run locally

Just open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8080
# visit http://localhost:8080
```

## Deploy

Works as-is on GitHub Pages, Netlify, Vercel, or any static host — no build command needed.

## Editing content

- **Testimonials**: edit the three `<blockquote class="testimonial-card">` blocks in `index.html` (search for `data-editable="testimonial"`).
- **Brands worked with**: edit the `.logo-wall` list and the campaign/ambassador cards in the `#brands` section.
- **Contact links**: update the `href` values in the `#contact` section (email, X, Telegram). Discord has no public profile link, so it's a click-to-copy button.
- **Colors/fonts**: CSS custom properties are defined at the top of `css/style.css` under `:root`.
