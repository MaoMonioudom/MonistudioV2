# Moni Image Studio — Project Overview

A photography studio portfolio site with a public-facing marketing site and a
private admin dashboard for managing its content. This doc covers what the
project is, how it's built, how the pieces fit together, and the performance
work done on it so far.

## What it is

- Public site: home, portfolio (works grid), services, about, contact.
- Admin dashboard (`/admin/*`): login-gated CRUD for everything shown on the
  public site — banners, services, portfolio features, partners, team
  members/activities, contact-page banners, and viewing contact-form
  submissions.
- Domain: `moniimagestudio.com`

## Stack

**Frontend** (`frontend/`)
- React 19 + Vite 7
- React Router v6 (client-side routing, `App.jsx`)
- Tailwind CSS
- `axios` for API calls, `react-helmet-async` for SEO tags
- React Compiler enabled (auto-memoization at build time)
- Deployed on Vercel as a static build (`vite build` → `dist/`), SPA rewrites
  configured in `frontend/vercel.json`

**Backend** (`backend/`)
- Node + Express 4
- MongoDB via Mongoose 8
- Cloudinary (`multer-storage-cloudinary`) for image uploads/hosting
- JWT (`jsonwebtoken`) for admin auth
- Deployed on Vercel as a serverless function (`backend/vercel.json`,
  `@vercel/node` builder) — **Hobby (free) plan**

## Repo layout

```
backend/
  server.js              Express app entry — mounts all routes
  config/
    db.js                Mongoose connection (see Performance section)
    cloudinary.js         Cloudinary client + delete helper
  models/                 One Mongoose schema per resource
  controllers/             One controller per resource, CRUD handlers
  routes/                  One router per resource, wires routes → controllers
  middleware/
    authMiddleware.js      JWT auth guard for admin-only routes

frontend/
  src/
    App.jsx                Route table (public + /admin/* → Dashboard)
    pages/                  Public route components (Home, Works, Service, ...)
    admins/                 Admin dashboard views (Login, Dashboard, per-resource CRUD)
    components/             Shared UI: Nav, Footer, Hero, Gallery, cards, effects
    hooks/                  useInView (scroll reveal), useMouseParallax (cursor/parallax)
    assets/, public/        Static assets (logo, fallback bg, favicons)
```

## Data model / resources

Each of these has a Mongoose model, a controller with standard CRUD, and a
route file mounted under `/api/<resource>` in `server.js`:

- **Banners** — homepage hero slides (title, subtitle, image, order, active)
- **Services** — service categories (also used to build the Portfolio page's
  filter buttons)
- **Features** — individual portfolio work items, linked to a Service,
  paginated on the Portfolio page
- **Partners** — logos shown in the "Trusted By" section
- **Team Members** / **Team Activities** — About page content
- **Contact Banners** — hero content for the Contact page
- **Contact Submissions** — stores messages sent via the public contact form,
  viewable in the admin dashboard (no public read access)
- **Auth** — single admin login, issues a JWT used by `authMiddleware.js` to
  protect all write/admin-only routes

Images for banners/features/partners/etc. are uploaded via `multer` straight
to Cloudinary; the stored `imageUrl` field is the raw Cloudinary URL.

## Frontend routing

Public routes are lazy-loaded per page (`React.lazy` + `Suspense`) so each
page's JS only loads when visited. All `/admin/*` routes render the same
`Dashboard` component, which presumably switches views internally based on
the path/section.

## Performance investigation & fixes

Diagnosed by measuring the **live site** (moniimagestudio.com), not local dev,
using browser devtools network timing.

### What was found

- Homepage hero showed nothing for ~2.5s: `/api/banners` didn't start until
  ~1.8s in (after the JS bundle parsed/executed) and took **703ms** to
  respond.
- The hero image (`hzqsnfiqlyvb8vun2du6.jpg`, a raw Cloudinary upload) was
  **414KB**, full original resolution/quality, and only started downloading
  *after* the banner API responded — another 550ms. ~3s total before the
  hero was fully visible.
- Same pattern on the Portfolio page (`Works.jsx`) — every grid image is a
  raw, unoptimized Cloudinary URL with no size/quality transform.
- Safari's Tracking Prevention warnings (yellow "blocked access to storage"
  for `res.cloudinary.com`) are a harmless side effect of this — images still
  load fine, it's just a symptom of many uncompressed cross-origin image
  requests.

### Root causes

1. **No MongoDB connection reuse.** `backend/config/db.js` called
   `mongoose.connect()` fresh every time with no caching, so requests paid a
   full TCP+TLS+auth handshake to the database before any query could run.
2. **Images served unoptimized.** Controllers store the raw Cloudinary
   `req.file.path` as-is — no `f_auto`, `q_auto`, or width cap — so browsers
   always download the full-resolution original regardless of display size.
3. **`process.exit(1)` on DB connection failure** — fine for a long-running
   server, bad for serverless: would kill the whole function on any
   transient DB hiccup.

### Fixes implemented

- [x] **DB connection caching** — `backend/config/db.js` now caches the
      Mongoose connection on `global`, so warm serverless invocations reuse
      it instead of reconnecting every request. `process.exit(1)` removed;
      connection errors are now logged instead of crashing the function
      (`backend/server.js`).
- [ ] **Image optimization** — not yet implemented. Plan: append Cloudinary
      transform params (`f_auto,q_auto:best`, plus a sensible width cap per
      placement — ~1920px for the hero, ~800px for portfolio grid
      thumbnails) when building image URLs in `Hero.jsx` and `Works.jsx` (and
      anywhere else `imageUrl` is rendered directly). Conservative quality
      chosen deliberately since this is a photography studio site — goal is
      to stop shipping more pixels than the display can show, not to
      visibly degrade photos. Could add a "view full size" link on
      individual work pages for people who want the untouched original.
- [ ] **Keep-warm ping** — being set up externally via cron-job.org, not
      Vercel Cron, because the backend is on Vercel's Hobby plan (native
      Cron Jobs there are limited to once/day — too infrequent to help).
      Steps: create a free cron-job.org account → new cronjob → URL =
      backend root (`https://<backend-domain>/`) → schedule
      `*/5 * * * *` (every 5 min) → save. Purely keeps the serverless
      function warm; works together with the connection caching above.

### Deliberately not done (and why)

- **Redis / response caching** — would help at higher traffic/query
  complexity, but adds a service to manage for no real benefit at this
  site's current scale. Connection caching already covers the actual
  bottleneck.
- **Moving off serverless** (e.g. Render/Fly.io always-on host) — the
  "proper" fix once keep-warm pinging stops being enough; overkill here.
- **HTTP-based DB driver / connection pooler** (Mongo Data API, Prisma
  Accelerate) — same reasoning, bigger architectural change than current
  traffic justifies.
