# Hexora Labs – Software Solutions · Website

Website for **Hexora Labs**, a software development startup offering web, mobile, desktop, backend, database, AI/data and university project mentoring services.

The repository has two separate parts:

| Part | Folder | Built with | Hosted on (free) |
| --- | --- | --- | --- |
| **Frontend** (the website) | `frontend/` | React + Vite, Tailwind CSS v4, Motion, Lucide icons, React Router | Vercel |
| **Backend** (API) | `backend/` | Vercel serverless functions (Node.js), nodemailer (Gmail SMTP), pdf-lib | Vercel |

```
Visitor's browser ──► frontend (Vercel project "hexora-labs")
        │  POST {VITE_API_URL}/api/inquiry
        ▼
backend (Vercel project "hexora-api") ──► builds a PDF ──► Gmail SMTP ──► hexoralabs@gmail.com
```

---

## 1. Installation

Requirements: **Node.js 22+** and npm. The repo uses **npm workspaces**, so a single install at the root sets up both parts.

```bash
npm install
cp backend/.env.example backend/.env   # then add the Gmail app password
```

## 2. Local development

```bash
npm run dev        # runs BOTH: website http://localhost:5173 + API http://127.0.0.1:8787
npm run dev:web    # website only (the contact form will show "couldn't be sent")
npm run dev:api    # API only
npm run lint       # ESLint (frontend)
```

During development the website calls `/api/...`, and Vite forwards those calls to the local backend on port 8787 (`frontend/vite.config.js`).

## 3. Production build

```bash
npm run build      # builds the website to frontend/dist/
npm run preview    # serves frontend/dist at http://localhost:4173
```

## 4. Deployment on Vercel (free Hobby plan)

The same GitHub repository is imported into Vercel **twice**: once for the backend, once for the website. Deploy the **backend first**, because the website needs its URL. Every push to `main` then redeploys both automatically.

### 4.1 Backend → Vercel project `hexora-api`

1. On [vercel.com](https://vercel.com), choose **Add New → Project**, import this repository and name the project `hexora-api`.
2. **Root Directory:** click *Edit* and choose `backend`. Framework preset: **Other**. Leave the build and output settings empty.
3. **Environment Variables:**

   | Name | Value |
   | --- | --- |
   | `GMAIL_USER` | `hexoralabs@gmail.com` |
   | `GMAIL_APP_PASSWORD` | the 16-character Gmail app password |
   | `INQUIRY_TO` | `hexoralabs@gmail.com` |
   | `ALLOWED_ORIGINS` | `http://localhost:5173` (the website URL is added in step 4.3) |

4. **Deploy.** Open `https://hexora-api.vercel.app/api/health` (use your project's real domain); it should return `{"ok":true}`.

### 4.2 Frontend → Vercel project `hexora-labs`

1. **Add New → Project** again, import the same repository and name it `hexora-labs`.
2. **Root Directory:** `frontend`. Vercel detects **Vite** automatically (build `npm run build`, output `dist`).
3. **Environment Variables:** `VITE_API_URL` = the backend URL from step 4.1, e.g. `https://hexora-api.vercel.app` (no trailing slash).
4. **Deploy.** After changing `VITE_API_URL`, redeploy, because it is read at build time.

### 4.3 Allow the website to call the API

In the **backend** project, go to **Settings → Environment Variables** and set `ALLOWED_ORIGINS` to `http://localhost:5173,https://hexora-labs.vercel.app` (your real website URL). Then go to **Deployments → ⋯ → Redeploy**. The API refuses requests from any other website.

**SPA routing and headers.** `frontend/vercel.json` sends every route (`/services`, `/work`, `/privacy`, …) to `index.html`, adds long-term caching for hashed assets and sets basic security headers.

**Custom domain.** In the website project, go to **Settings → Domains**, then add that domain to `ALLOWED_ORIGINS` in the backend project and redeploy it.

### SEO

The public site URL defaults to `https://hexora-labs.vercel.app` (set in `frontend/vite.config.js`). Everything below is derived from it:

- canonical link, `og:url`, absolute `og:image` / `twitter:image` and Organization + WebSite JSON-LD in `frontend/index.html`
- `sitemap.xml` and `robots.txt`, generated at build time
- per-section titles and descriptions (`sectionMeta` in `frontend/src/config/site.js`). Section URLs canonicalise to `/`; the 404 page is `noindex`.

**After adding a custom domain,** set `VITE_SITE_URL=https://your-domain` in the website project's environment variables (or change the default in `vite.config.js`) and redeploy.

**Get indexed:** add the site in [Google Search Console](https://search.google.com/search-console) (URL-prefix property, verify with the *HTML tag* method by pasting the meta tag into `frontend/index.html`), then submit `sitemap.xml` under **Sitemaps**. Do the same in [Bing Webmaster Tools](https://www.bing.com/webmasters) (it can import from Search Console).

---

## 5. Project structure

```
brand-originals/              Original logo files (never modified)
scripts/process_assets.py     Generates optimised logos/favicons for frontend + backend
package.json                  Workspace root: dev / build / deploy scripts for both parts

frontend/                     ── Website (Vercel)
  index.html, vite.config.js, vercel.json, eslint.config.js, .env.example
  public/                     Favicons, OG image, manifest, robots.txt
  src/
    config/site.js            Brand name, email, phone/WhatsApp, socials, navigation
    data/                     content.js, portfolio.js, images.js
    services/inquiry.js       Calls the backend API (or mailto fallback)
    context/, hooks/          Inquiry pre-select, active section, navigation, clipboard
    components/               layout/, sections/, illustrations/, ui/
    pages/                    Home (one-page), Privacy, NotFound
    assets/                   brand/, images/, portfolio/ (optimised WebP)

backend/                      ── API (Vercel serverless functions)
  api/health.js, api/inquiry.js  Vercel functions → /api/health, /api/inquiry
  src/handler.js              CORS, validation, spam checks, email (nodemailer)
  dev-server.js               Local API server on :8787 (npm run dev:api)
  vercel.json                 Function settings (bundles the PDF logo)
  .env.example                Local secrets template (.env is git-ignored)
  src/pdf.js                  Branded PDF summary (pdf-lib)
  src/logo.png                Logo for the PDF header
```

**Clean URLs.** Each section has a shareable path (`/services`, `/work`, `/student-hub`, `/about`, `/contact`, `/process`). These render the one-page home and scroll to that section.

### Editing content

- **Email, phone, WhatsApp, social links:** `frontend/src/config/site.js`. `phone`/`whatsapp` are `{ display, href }` and render only when set; social links render only when they have a real `url`.
- **Services, Student Hub, process, reasons, budget tiers, project types:** `frontend/src/data/content.js`.
- **Portfolio:** `frontend/src/data/portfolio.js`. Each project has toggleable screenshots (`views`), a floating screenshot (`inset`), highlights, tech tags and a GitHub link. Screenshots go in `frontend/src/assets/portfolio/` as optimised `.webp` files.

---

## 6. Contact form: email with PDF (backend)

When a visitor presses **Send Inquiry**, the website posts to **`{VITE_API_URL}/api/inquiry`**. The backend:

1. accepts requests only from `ALLOWED_ORIGINS` (CORS), validates the data again and filters spam (hidden honeypot field, minimum fill time)
2. creates a branded **PDF summary** with a reference number such as `HX-261125-4K7Q` (`backend/src/pdf.js`)
3. emails it through **Gmail SMTP** from and to `hexoralabs@gmail.com`, with the PDF attached and *Reply-To* set to the visitor.

The visitor sees a confirmation with the reference number only after the email has been sent. If sending fails, they get *Try again*, *Email us instead* and *WhatsApp* options.

### Secrets (never commit these)

| Name | Value |
| --- | --- |
| `GMAIL_USER` | `hexoralabs@gmail.com` |
| `GMAIL_APP_PASSWORD` | 16-character Google App password (Google Account → Security → 2-Step Verification → App passwords) |
| `INQUIRY_TO` | Where inquiries are delivered (default: `GMAIL_USER`) |
| `ALLOWED_ORIGINS` | Comma-separated website URLs allowed to call the API |

- **Local:** `backend/.env` (git-ignored). Copy it from `backend/.env.example`.
- **Production:** the backend Vercel project's **Settings → Environment Variables** (stored encrypted by Vercel).

The PDF uses standard fonts, so Sinhala or Tamil characters appear as "?" in the PDF (with a note). The email body always shows the original text. Gmail allows about 500 emails a day.

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
| `frontend/src/assets/brand/logo-horizontal.webp` (+ `.png`) | Navbar, footer (light backgrounds) |
| `backend/src/logo.png` | PDF header logo |
| `frontend/src/assets/brand/logo-mark.webp` | Icon-only mark (404 page) |
| `frontend/src/assets/brand/logo-badge.webp` | Circular emblem (About section) |
| `frontend/public/favicon.ico`, `favicon-16/32.png`, `icon-192/512.png`, `apple-touch-icon.png` | Favicons / PWA icons |
| `frontend/public/og-image.jpg` | 1200×630 social preview |

> The horizontal logo has navy lettering, so use it on white or light backgrounds only. For a dark background, request an official reversed (white) logo version rather than recolouring it.

**Adding portfolio images:** place optimised `.webp` files (around 1600px wide, under 200 KB) in `frontend/src/assets/portfolio/`, import them in `frontend/src/data/portfolio.js`, and render them with `loading="lazy"` and descriptive `alt` text.

Fonts (Sora and Inter) are self-hosted via `@fontsource-variable`. There are no external font requests.

---

## 8. Future Supabase integration

The UI talks to inquiries only through `submitInquiry()` in `frontend/src/services/inquiry.js`, so storage can be added without changing components:

1. `npm install @supabase/supabase-js -w frontend`
2. Create a free Supabase project and run the SQL in `frontend/src/lib/supabase.js`. It creates an `inquiries` table with Row Level Security that allows anonymous **inserts only**.
3. Copy `frontend/.env.example` to `frontend/.env.local` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Add the same variables in the website's Vercel project settings.
4. Uncomment the client code in `frontend/src/lib/supabase.js` and set `VITE_INQUIRY_PROVIDER=supabase`.
5. Update the form's confirmation copy and the privacy notice (`frontend/src/pages/Privacy.jsx` and the footer), because inquiries would then be stored.

Optional: send email notifications for new rows using a Supabase Database Webhook or Edge Function. Both are available on the free tier.

---

## 9. Accessibility and performance notes

- Semantic landmarks, one `h1` per page, and a logical heading order.
- A skip link, visible focus rings, and keyboard-operable menu and filters. The mobile menu closes on Escape and locks page scroll.
- Labelled form fields, with inline errors linked through `aria-describedby`. Focus moves to the first invalid field.
- `prefers-reduced-motion` is respected: floating and reveal animations are disabled, and scrolling is instant.
- Vendor code is split into long-cached chunks; the Privacy and 404 pages are lazy-loaded; images are WebP and lazy-loaded below the fold.
