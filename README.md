# The Spa House Day Spa — Redesign Concept

An unsolicited, single-page website redesign concept for **The Spa House Day Spa, LLC** in
Gonzales, Louisiana — a 5.0-rated day spa offering massage therapy, facials & skincare, waxing,
and permanent makeup.

## Why this concept exists

The spa's previous website (`tshdayspa.com`) is currently **broken/erroring**, leaving a
5.0-rated local business with effectively no working web presence. This concept shows a modern,
fast, mobile-first site the business could adopt right now — built around their real services,
prices, story, hours, and a working link to their existing online booking.

## What's real here

- **Services & prices** reproduced from the spa's own published trifold brochure (recovered from
  the Wayback Machine), covering massage, facials, microdermabrasion, chemical peels, dermaplaning,
  waxing, permanent makeup, and signature spa packages.
- **About copy** adapted from the spa's own original homepage text.
- **Reviews** are real guest quotes (TripAdvisor), with staff members guests actually named.
- **Photos** were recovered from the spa's own former website (storefront, logo, and the treatment
  imagery they previously used).
- **Contact, hours, address, and the Vagaro booking link** are the business's real details.

Prices reflect the spa's published menu and are shown as a guide; a note on the page directs guests
to confirm current pricing at booking.

## View it

Open `index.html` in any browser — it's fully static, no build step, no dependencies beyond a single
Google Fonts link.

## SEO / deploy note

The page includes JSON-LD structured data (`DaySpa`), a canonical link, complete Open Graph +
Twitter Card tags, `robots.txt`, and `sitemap.xml`. All absolute URLs use the literal placeholder
`https://REPLACE-WITH-DOMAIN.com/`. Before deploying, do a one-line find-and-replace of that
placeholder with the real domain across `index.html`, `robots.txt`, and `sitemap.xml`.

## Tech

Hand-written HTML/CSS/JS. Responsive and mobile-first, accessible (semantic landmarks, labels,
focus states, `prefers-reduced-motion`), and performant (optimized WebP imagery, lazy loading,
`IntersectionObserver` scroll reveals). No frameworks.

---

*This is an independent redesign concept created as a portfolio/pitch piece. It is not the spa's
official website and is not affiliated with or endorsed by The Spa House Day Spa, LLC.*
