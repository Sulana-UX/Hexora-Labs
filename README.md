# Hexora Labs – Software Solutions · Website

Marketing website for **Hexora Labs**, a software development startup offering web, mobile, desktop, backend, database, AI/data and university project mentoring services.

Built with **React + Vite**, **Tailwind CSS v4**, **Motion for React**, **Lucide icons** and **React Router**. It is a fully static site and runs on **Cloudflare Pages Free**: no server, database or paid API.

---

## 1. Installation

Requirements: **Node.js 20+** (22 LTS recommended) and npm.

```bash
npm install
```

## 2. Local development

```bash
npm run dev        # http://localhost:5173 with hot reload
npm run lint       # ESLint
```

## 3. Production build

```bash
npm run build      # outputs static files to dist/
npm run preview    # serve dist/ locally at http://localhost:4173
```

## 4. Deploying to Cloudflare Pages (free)

**Option A: Git integration (recommended)**

1. Push this project to a GitHub or GitLab repository.
2. In the Cloudflare dashboard, open **Workers & Pages → Create → Pages → Connect to Git** and select the repository.
3. Build settings:
   | Setting | Value |
   | --- | --- |
   | Framework preset | `Vite` (or None) |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Environment variable (optional) | `NODE_VERSION = 22` |
4. Click **Save and Deploy**. Every push to the main branch redeploys automatically; other branches get preview URLs.

**Option B: Direct upload**

```bash
npm run build
npx wrangler pages deploy dist --project-name hexora-labs
```

**SPA routing.** `public/_redirects` sends every route (`/services`, `/work`, `/privacy`, …) to `index.html` so client-side routing works on refresh and on direct links. `public/_headers` adds long-term caching for hashed assets and basic security headers.

**Custom domain.** In the Pages project, go to **Custom domains → Set up a domain**.

### SEO after choosing a domain

No production domain is hard-coded. Once you have one:

1. In `index.html`, change `og:image` and `twitter:image` to absolute URLs (e.g. `https://your-domain/og-image.jpg`), and add `<meta property="og:url" content="https://your-domain/">` and `<link rel="canonical" href="https://your-domain/">`.
2. Optionally add a `public/sitemap.xml` and reference it in `public/robots.txt`.
3. Set `VITE_SITE_URL` in Cloudflare Pages → Settings → Environment variables. It is exposed as `site.url` in `src/config/site.js`.

---

## 5. Project structure

```
brand-originals/            Original logo files (never modified)
scripts/process_assets.py   Generates optimised web assets from the originals
public/                     Favicons, OG image, manifest, _redirects, _headers, robots.txt
src/
  config/site.js            Brand name, email, optional phone/WhatsApp/socials, navigation
  data/content.js           Services, Student Hub items, process steps, reasons, form options
  data/portfolio.js         Portfolio entries and categories
  services/inquiry.js       Inquiry boundary (mailto today, Supabase-ready)
  lib/supabase.js           Supabase placeholder and setup notes
  context/InquiryContext    Lets "Enquire" buttons pre-select the project type
  hooks/                    Active section, section navigation, clipboard, document title
  components/
    layout/                 Navbar, Footer, Layout
    sections/               Hero, Services, StudentHub, Portfolio, Process, About, Contact
    illustrations/          Hero illustration and portfolio UI previews (code-drawn SVG/CSS)
    ui/                     Button, Container/Panel, SectionHeading, Reveal, Logo
  pages/                    Home (one-page), Privacy, NotFound
```

**Clean URLs.** Each section has a shareable path (`/services`, `/work`, `/student-hub`, `/about`, `/contact`, `/process`). These render the one-page home and scroll to that section. The document title updates per section.

### Editing content

- **Email, phone, WhatsApp, social links:** `src/config/site.js`. `phone` is `{ display, href }` (e.g. `tel:+94…`); `phone`/`whatsapp` render only when set, and social links render only when they have a real `url`.
- **Services, Student Hub, process, reasons, budget tiers, project types:** `src/data/content.js`.
- **Portfolio:** `src/data/portfolio.js`. All current entries are clearly marked **concept projects** (`concept: true`), which shows a "Concept project" badge. When real projects are completed, add them with `concept: false` and either a code-drawn preview or an image (see "Asset management").

---

## 6. Contact form behaviour

The inquiry form validates input, then builds an RFC 6068-encoded `mailto:` link to **hexoralabs@gmail.com**, with subject and body pre-filled. That link opens the visitor's own email app.

- The website **does not send or store** anything, and the UI says the visitor must press **Send** in their email app. No false "success" message is shown.
- If no email app opens, visitors can re-open the link or copy the full inquiry text.
- A direct email button and a copy-email button are always available.

---

## 7. Asset management

Original logos live untouched in `brand-originals/`. To regenerate the optimised versions (e.g. after replacing a logo):

```bash
pip install pillow numpy
npm run assets          # runs python scripts/process_assets.py
```

The script:
- removes the white background with soft, anti-aliased edges ("colour-to-alpha")
- keeps the intentional white face inside the hexagon mark
- trims empty margins

It outputs:

| File | Use |
| --- | --- |
| `src/assets/brand/logo-horizontal.webp` (+ `.png`) | Navbar, footer (light backgrounds) |
| `src/assets/brand/logo-mark.webp` | Icon-only mark (404 page) |
| `src/assets/brand/logo-badge.webp` | Circular emblem (About section) |
| `public/favicon.ico`, `favicon-16/32.png`, `icon-192/512.png`, `apple-touch-icon.png` | Favicons / PWA icons |
| `public/og-image.jpg` | 1200×630 social preview |

> The horizontal logo has navy lettering, so use it on white or light backgrounds only. For a dark background, request an official reversed (white) logo version rather than recolouring it.

**Adding portfolio images:** place optimised `.webp` files (around 1600px wide, under 200 KB) in `src/assets/portfolio/`, import them in `src/data/portfolio.js`, and render them with `loading="lazy"` and descriptive `alt` text.

Fonts (Sora and Inter) are self-hosted via `@fontsource-variable`. There are no external font requests.

---

## 8. Future Supabase integration

The UI talks to inquiries only through `submitInquiry()` in `src/services/inquiry.js`, so a backend can be added without changing components:

1. `npm install @supabase/supabase-js`
2. Create a free Supabase project and run the SQL in `src/lib/supabase.js`. It creates an `inquiries` table with Row Level Security that allows anonymous **inserts only**.
3. Copy `.env.example` to `.env.local` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Add the same variables in Cloudflare Pages settings.
4. Uncomment the client code in `src/lib/supabase.js` and set `INQUIRY_PROVIDER = 'supabase'` in `src/services/inquiry.js`.
5. Update the form's confirmation copy and the privacy notice (`src/pages/Privacy.jsx` and the footer), because inquiries would then be stored.

Optional: send email notifications for new rows using a Supabase Database Webhook or Edge Function. Both are available on the free tier.

---

## 9. Accessibility and performance notes

- Semantic landmarks, one `h1` per page, and a logical heading order.
- A skip link, visible focus rings, and keyboard-operable menu and filters. The mobile menu closes on Escape and locks page scroll.
- Labelled form fields, with inline errors linked through `aria-describedby`. Focus moves to the first invalid field.
- `prefers-reduced-motion` is respected: floating and reveal animations are disabled, and scrolling is instant.
- Vendor code is split into long-cached chunks; the Privacy and 404 pages are lazy-loaded; images are WebP and lazy-loaded below the fold.
