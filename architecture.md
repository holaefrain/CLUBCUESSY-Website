# CLUBCUESSY Website — Rebuild Plan
 
**From:** vanilla HTML/CSS/JS + Express, served from GitHub Pages
**To:** React + Vite + TypeScript + shadcn/ui (frontend) · Hono + tRPC + Drizzle + Postgres (backend)
 
**Decisions locked in:**
 
- Events and articles live in Postgres; static page copy (Standards, Home) stays in code
- Simple admin login with CRUD for content
- Frontend stays on GitHub Pages at `www.clubcuessy.com`; API hosted separately
---
 
## 1. Read this first — the GitHub Pages trade-off
 
Keeping the frontend on Pages is workable and cheap, but three things follow from it. None are dealbreakers; all need a decision.
 
**a) No server-side rendering, so link previews are generic.**
Pages serves one static `index.html`. When someone drops a link to a specific event in a group chat or on Instagram, the crawler sees the shell — not the event title, date, or poster. Every shared link looks identical. For an events collective that spreads by word of mouth, this is the real cost.
 
*Options:* accept it · prerender routes at build time (`vite-react-ssg`) and rebuild when you publish an event, which reintroduces a deploy step for content · move the frontend to Cloudflare Pages or Vercel later, where SSR is one config change. The architecture below doesn't change either way, so this is deferrable — but decide before Phase 8.
 
**b) The API must live at `api.clubcuessy.com`, not a raw Railway/Render URL.**
Admin login uses an HttpOnly session cookie. Browsers treat `www.clubcuessy.com` and `api.clubcuessy.com` as the same site (same registrable domain), so a `Domain=.clubcuessy.com; SameSite=Lax` cookie is sent on API calls. Point the frontend at a raw `xxxxxxxxxx.execute-api.us-east-1.amazonaws.com` URL instead and the cookie is cross-site — it gets dropped, and you fall back to storing a token in `localStorage`, which is a downgrade. Add the CNAME record in Phase 0.
 
**c) Client-side routing needs a fallback.**
Deep links like `/events/summer-solstice` 404 on Pages unless `dist/404.html` is a copy of `index.html`. One line in the build script. Also keep `CNAME` in `public/` or Pages drops the custom domain on every deploy.
 
**Also, before anything else:** `node_modules/` is committed to the repo (103 commits of it). Remove it, add a real `.gitignore`. And confirm no Stripe or Resend key ever landed in a commit — `server.js` reads from env correctly, but check `.env` history and rotate if in doubt.
 
---
 
## 2. Target architecture
 
```
clubcuessy/
├── apps/
│   ├── web/                    # Vite + React + TS + shadcn → GitHub Pages
│   │   ├── public/             # CNAME, video bg, posters, favicon
│   │   └── src/
│   │       ├── routes/         # one folder per page
│   │       ├── components/     # ui/ (shadcn) + site-specific
│   │       ├── lib/trpc.ts     # typed client
│   │       └── styles/
│   └── api/                    # Hono + tRPC → AWS Lambda (API Gateway)
│       └── src/
│           ├── index.ts        # Hono app, CORS, mount points
│           ├── trpc/           # routers: public + admin
│           ├── auth/           # session create/verify
│           └── webhooks/       # Stripe raw-body route (NOT tRPC)
├── packages/
│   ├── db/                     # Drizzle schema, migrations, seed
│   └── shared/                 # zod schemas + types both sides import
├── pnpm-workspace.yaml
└── turbo.json                  # optional; plain pnpm scripts work fine
```
 
**Stack specifics**
 
| Concern | Choice | Why |
|---|---|---|
| Package manager | pnpm workspaces | Cheapest monorepo that works; no Turbo needed at this size |
| Postgres | Neon (free tier) | No server to babysit; branching is useful for migrations |
| Driver | `postgres.js` + `drizzle-orm/postgres-js`, via Neon's **pooled** connection string | Full transaction support over TCP; Lambda is still a Node runtime (unlike edge), but each concurrent invocation opens its own connection, so use the pooled endpoint or you'll exhaust Postgres's connection limit under any real concurrency |
| Hono adapter | `hono/aws-lambda` | Official Lambda adapter; no server process to run, and the free tier is permanent (1M requests/month), not a trial |
| tRPC ↔ Hono | `@hono/trpc-server` | Official middleware; mounts the tRPC handler on a Hono route |
| Auth | Hand-rolled sessions (~100 lines) | One or two admins; `better-auth` is more machinery than this needs |
| Password hashing | `@node-rs/argon2` | Fast, no native build headaches |
| Validation | zod, shared package | One schema drives tRPC input, form validation, and DB inserts |
| Forms | react-hook-form + `@hookform/resolvers/zod` | Pairs with shadcn form components |
| Routing | React Router v7 (declarative mode) | Fine for a static SPA |
| Server state | TanStack Query via `@trpc/react-query` | The classic integration, and the stable one. `@trpc/tanstack-react-query` is newer and nicer but still beta — worth a look, not worth a rebuild depending on it |
 
**Important:** the Stripe webhook cannot be a tRPC procedure. Signature verification needs the raw request body, and tRPC parses JSON before you see it. Mount it as a plain Hono route at `/webhooks/stripe` alongside the tRPC handler.
 
---
 
## 3. Data model
 
```
events
  id, slug, title, tagline, description_md,
  starts_at, doors_at, venue_name, venue_address, city,
  poster_url, soundcloud_url,
  stripe_pricing_table_id, stripe_publishable_key, price_cents, capacity,
  status ('draft' | 'published' | 'archived'),
  created_at, updated_at
 
event_lineup
  id, event_id → events, artist_name, set_time, is_anonymous, sort_order
  -- is_anonymous supports the Anonymous Performance Act
 
event_media
  id, event_id → events, url, caption, sort_order
  -- powers the Archives gallery
 
articles
  id, slug, title, excerpt, body_md, cover_image_url, author,
  tags text[], status, published_at, created_at, updated_at
 
contact_submissions
  id, name, email, subject, message,
  resend_message_id, status, created_at
 
orders
  id, event_id → events, stripe_payment_intent_id, stripe_checkout_session_id,
  email, name, amount_cents, currency, status, created_at
  -- written by the webhook; source of truth for who's coming
 
admin_users
  id, email (unique), password_hash, name, role, created_at
 
sessions
  id, user_id → admin_users, expires_at, created_at
```
 
Notes:
 
- **Archives is a view, not a table.** It's `events` where `status = 'archived'`, joined to `event_media`. No duplication.
- **Standards and the Home hero stay in code.** They change once a year; a DB round-trip buys nothing.
- **Article search starts client-side.** The full list is small enough to filter in the browser. Move to Postgres full-text (`tsvector` + GIN) only when the list gets long enough to notice.
- **Body fields are markdown**, rendered with `react-markdown`. Avoids building or embedding a rich text editor in the admin.
## 4. tRPC router shape
 
```
publicRouter
  events.listUpcoming()          events.bySlug(slug)
  events.listArchived()
  articles.list({ tag?, limit })  articles.bySlug(slug)
  contact.submit(input)           -- rate limited, honeypot field
  checkout.createPaymentIntent({ eventId, email, name })
 
adminRouter                       -- protectedProcedure, session cookie required
  events.create / update / publish / archive / delete
  articles.create / update / publish / delete
  media.createUploadUrl / attach / delete
  contact.list / markHandled
  orders.listByEvent
```
 
Plain Hono routes outside tRPC: `POST /webhooks/stripe`, `POST /auth/login`, `POST /auth/logout`, `GET /health`.
 
---
 
## 5. Phases
 
Estimates assume solo work, focused sessions. Each phase ends in something you can actually check.
 
### Phase 0 — Groundwork · ~half a day
Provision Neon and grab the connection string (use the **pooled** connection string, not the direct one — see §2 driver note). Request an ACM certificate for `api.clubcuessy.com` (validate it via the CNAME record ACM gives you), then create the API Gateway custom domain and add the `api.clubcuessy.com` CNAME at your DNS provider pointing at the target hostname API Gateway assigns. Strip `node_modules/` and `.DS_Store` from the repo, write a real `.gitignore`. Audit git history for leaked keys; rotate anything questionable. Decide: new repo, or rebuild in a branch of the existing one (recommend a branch — you keep the history and the Pages config).
 
**Done when:** you can `psql` into Neon and the repo is clean.

**Deferred:** DNS (ACM validation CNAME + API Gateway custom domain CNAME for `api.clubcuessy.com`) is on hold — using local Postgres for now instead of Neon too. Both need to be picked back up before Phase 8 deploy.
 
### Phase 1 — Monorepo skeleton · ~1 day
pnpm workspace. `apps/web` scaffolded with Vite + React + TS, Tailwind, shadcn init. `apps/api` with Hono, `hono/aws-lambda`, tRPC v11, CORS middleware allowlisting `https://www.clubcuessy.com` and `http://localhost:5173`. Local dev still runs the Hono app over plain HTTP (e.g. `@hono/node-server` in a small dev-only entrypoint) so `pnpm dev` doesn't require deploying to Lambda to iterate. `packages/db` and `packages/shared` wired into both. Shared `tsconfig.base.json`, one linter.
 
**Done when:** `pnpm dev` runs both apps, and a `health` tRPC query round-trips to the browser with full type inference — hover the result and see the API's return type.
 
### Phase 2 — Data layer · ~1 day
Write the Drizzle schema above. Generate and run the first migration. Write a seed script that pulls existing events, posters, and articles out of the current HTML files into the database — do this as a script, not by hand, so you can re-run it.
 
**Done when:** Drizzle Studio shows your real events and articles.
 
### Phase 3 — Public API · ~1 day
Build the public router. Zod input schemas in `packages/shared`. Consistent error formatting. Rate limit `contact.submit`.
 
**Done when:** every public query returns real seeded data, verified from a REST client or the tRPC panel.
 
### Phase 4 — Frontend shell and design system · ~1–2 days
This is where the site's identity gets rebuilt, so it's worth slowing down. Pull the existing CSS custom properties, fonts, and spacing into Tailwind theme tokens *before* placing components — otherwise you'll be fighting shadcn defaults for the rest of the port. Build the layout, nav, and footer. Wrap the video background and the SoundCloud Widget API in components with proper cleanup on unmount (the widget leaks iframes if you don't).
 
**Done when:** all 7 routes navigate, and the homepage is visually indistinguishable from the live site side by side.
 
### Phase 5 — Port the pages · ~2–3 days
HomePage → Standards → Upcoming-Events → Event-Description → Archives → Articles (search + carousel) → Contact. Roughly ascending order of complexity; Event-Description and Articles are the two with real logic.
 
**Done when:** feature parity with the live site, checked page by page against production.
 
### Phase 6 — Payments and email · ~1 day
Stripe Pricing Table stays embedded (it's the least code). Add the `/webhooks/stripe` raw route, verify signatures, write `orders` rows on `payment_intent.succeeded`. Wire Resend: ticket confirmation on successful payment, and route contact submissions to `hola@clubcuessy.com` while also storing them.
 
**Done when:** a test-mode purchase produces an `orders` row and a confirmation email lands in a real inbox. Use the Stripe CLI to replay webhooks locally.
 
### Phase 7 — Admin and auth · ~1–2 days
`admin_users` + `sessions`, argon2 hashing, HttpOnly `Secure` `SameSite=Lax` cookie scoped to `.clubcuessy.com`. `protectedProcedure` middleware. Admin routes under `/admin`: login, event list/editor, article list/editor, contact inbox, orders per event. Poster uploads via presigned URLs to Cloudflare R2 (or keep posters in `public/` for now and defer uploads to a later pass — worth deciding based on how often posters change).
 
**Done when:** you can create, edit, and publish an event from the browser and see it appear on the public site without touching git.
 
### Phase 8 — Deploy · ~1 day
GitHub Actions: build `apps/web`, copy `index.html` → `404.html`, keep `CNAME`, publish to Pages. API packaged and deployed to Lambda (GitHub Actions zip/upload or a small CDK/SAM stack), fronted by the API Gateway custom domain bound to `api.clubcuessy.com` with the ACM cert from Phase 0. Production env vars set as Lambda environment variables and in the Pages build. Register the production webhook endpoint in Stripe. Point `VITE_API_URL` at the API domain.
 
**Done when:** `www.clubcuessy.com` is serving the new build against the production API, and a deep link like `/events/<slug>` loads directly.
 
### Phase 9 — Cutover and hardening · ~half a day
Redirect old paths (`/HomePage`, `/Standards`, `/Upcoming-Events`, …) to the new routes so existing links and any search indexing survive. Per-page meta and OG tags. `sitemap.xml`, `robots.txt`. Lighthouse pass — video backgrounds are usually the LCP problem; poster-image the video and lazy-load below the fold. Confirm Neon backups are on.
 
**Done when:** old URLs resolve, Lighthouse is green, and you've clicked through the whole site on a phone.
 
---
 
**Rough total: 9–12 focused days.** Phases 4 and 5 dominate, and they're the ones that stretch — visual parity always takes longer than expected. Phases 1–3 are mechanical and predictable.
 
## 6. Sequencing note
 
Phases 1→2→3 are strictly ordered. Phase 4 can start in parallel with 2 and 3 if you stub the tRPC responses — worth doing if you want to see the new site early. Phase 6 depends only on Phase 3. Phase 7 depends on 2 and 4.
 
## 7. Open questions to settle before Phase 8
 
1. **Link previews** — accept generic, prerender, or move off Pages? (See §1a.)
2. **Poster uploads** — R2 in Phase 7, or keep images in git and defer?
3. **Stripe** — stay on Pricing Tables, or move to Checkout Sessions? Checkout gives you per-event line items and better metadata on the order, which matters once you're tracking attendance in the `orders` table.
4. **Who else gets admin access?** Affects whether `role` needs to do real work in Phase 7.