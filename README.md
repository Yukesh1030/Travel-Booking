# STACKLY Travels

> **Discover More. Travel Better. Live Unforgettable.**

A static luxury travel and hospitality frontend platform built purely with HTML5, CSS3, and Vanilla JavaScript—powered by GSAP, ScrollTrigger, AOS, and Lenis.

## Design System

- **Primary (Deep Ocean):** `#173B46`
- **Background (Pearl Ivory):** `#F6F3EC`
- **Accent (Sand Gold):** `#C49A62`
- **Typography:** `Playfair Display` (editorial headings & destination titles) and `Plus Jakarta Sans` (UI, navigation, forms, pricing, and body copy)

## Project Structure

```text
.
├── index.html          # Main landing experience (Hero + 10 curated travel sections)
├── 404.html            # Custom animated 404 page with Back & Back to Home actions
├── .nojekyll           # Ensures direct static asset serving on GitHub Pages
├── README.md
├── css/
│   └── style.css       # Responsive layout, theme tokens, mobile drawer & motion styles
├── js/
│   ├── main.js         # Lenis smooth scroll, GSAP/ScrollTrigger, AOS, search & modals
│   └── 404.js          # GSAP timeline & interactive Back / Home navigation on 404
└── assets/
    └── *.webp          # All imagery optimized in WebP format
```

## GitHub Pages Deployment

All internal links and asset paths are relative (`assets/...`, `css/...`, `js/...`, `index.html`, `404.html`), making the project ready for immediate deployment from any GitHub Pages root or repository subpath (`https://<username>.github.io/<repository>/`). GitHub Pages automatically routes missing URLs to `404.html`.

