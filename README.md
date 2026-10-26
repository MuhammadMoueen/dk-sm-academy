# DK & SM Academy

DK & SM Academy is a premium black-and-gold educational website for Forex,
Crypto, technology, and market-insight content. It combines a public learning
site with a protected PostgreSQL-backed admin dashboard for managing articles,
portfolio reviews, media, profile information, and selected analytics.

- **Live website:** <https://www.dksmacademy.tech>
- **Repository:** <https://github.com/MuhammadMoueen/dk-sm-academy>
- **Application type:** Next.js App Router application
- **License:** No license has been specified in this repository.

## Project Overview

The public site presents the Academy's brand, services, educational resources,
portfolio work, community links, FAQs, policies, and published articles. The
admin area provides authenticated content management and dashboard reporting.
Content is stored in PostgreSQL and rendered by the same Next.js application.

The application is designed for:

- Learners exploring Forex, Crypto, AI, technology, and market education.
- Visitors looking for Academy services and community channels.
- An administrator who needs to publish articles, manage portfolio reviews,
  upload media, and review visitor and YouTube analytics.

## Features

### Public website

- Responsive black-and-gold branded layout with sticky navigation and footer.
- Home sections for hero content, about information, services, portfolio,
  articles, and community links.
- Public pages for:
  - About
  - Services and individual service categories
  - Portfolio
  - Reviews
  - Latest articles and individual article pages
  - Learning and learning resources
  - Community
  - FAQ
  - Privacy policy
  - Terms and conditions
  - Disclaimer
  - Data deletion instructions
- SEO metadata, canonical URLs, Open Graph metadata, Twitter card metadata,
  sitemap, robots route, and dynamic article metadata.
- Responsive article presentation with a desktop grid and a mobile horizontal
  carousel with pagination indicators.
- Public visitor counting for non-admin, non-API routes.

### Admin dashboard

- Protected administrator sign-in and session-based authorization.
- Dashboard summary cards for total, published, and draft articles plus
  portfolio review counts.
- Recent administrative activity.
- Visitor growth charts with monthly and yearly views.
- YouTube subscriber analytics when the Google OAuth integration is configured.
- Article management with search, status filtering, pagination, draft saving,
  publishing, editing, previewing, and deletion.
- Structured article content blocks for headings, paragraphs, lists, links, and
  images.
- Portfolio/client review management with ratings, images, publication status,
  and verified-client state.
- Profile and password management.
- Media uploads through Cloudinary.
- Mobile admin navigation drawer and a desktop sidebar.

### Integrations

- PostgreSQL for application data.
- Cloudinary for authenticated image uploads.
- Google OAuth and the YouTube Data API for subscriber analytics.
- Configured outbound links for YouTube, WhatsApp Channel, Telegram, and other
  social profiles.

WhatsApp is currently a channel link only. The application does not implement
WhatsApp API access, OAuth, follower-count retrieval, or synchronization.

## Technology Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js `16.4.2` App Router |
| UI | React `19.3.0`, TypeScript, Tailwind CSS v4 |
| Build tooling | Turbopack, React Compiler, ESLint 9 |
| Database | PostgreSQL via `pg` |
| Validation | Zod |
| Authentication | Custom PostgreSQL-backed admin sessions, bcryptjs |
| Image storage | Cloudinary |
| Social analytics | Google OAuth and YouTube Data API |
| Hosting target | Vercel-compatible Next.js deployment |

The repository does not include a separate backend service. Server Components,
Route Handlers, server-only modules, and database queries run within the
Next.js application.

## Architecture and Application Flow

1. The root App Router layout loads global metadata, Geist fonts, and global
   styles.
2. The public route group renders the public header, page content, footer, and
   visitor beacon.
3. Public content queries in `src/features/` read published records from
   PostgreSQL through the shared database pool.
4. Admin routes are wrapped by the protected admin layout. It calls
   `requireAdmin()` before rendering protected pages and redirects unauthenticated
   users to `/admin/login`.
5. Client admin components call authenticated Route Handlers under
   `/api/admin/*`.
6. Route Handlers validate input with Zod, check the admin session and request
   origin, perform parameterized PostgreSQL queries, and return JSON responses.
7. Article and portfolio mutations record activity in `admin_activity`.
8. Uploaded images are validated server-side and sent to Cloudinary; only
   validated HTTPS references are stored in PostgreSQL.
9. Visitor requests are counted by day using a signed visitor cookie and the
   `visitor_daily_counts` table.
10. YouTube OAuth tokens are encrypted before storage and are used to fetch
    subscriber snapshots from the YouTube Data API.

## Project Structure

```text
.
├── migrations/                 Ordered PostgreSQL migrations
├── public/images/              Public image assets
├── scripts/                    Migration and admin provisioning scripts
├── src/
│   ├── app/
│   │   ├── (public)/           Public pages and route group
│   │   ├── admin/              Login and protected admin routes
│   │   ├── api/                Route Handlers for admin, analytics, and contact
│   │   ├── globals.css         Global theme and shared styles
│   │   └── layout.tsx          Root layout and metadata
│   ├── components/
│   │   ├── admin/              Dashboard, editors, navigation, and forms
│   │   ├── analytics/          Public visitor beacon
│   │   ├── blog/               Article cards, content, and collections
│   │   ├── home/               Home page sections
│   │   ├── layout/             Public header, footer, and mobile navigation
│   │   └── portfolio/          Portfolio presentation
│   ├── config/site.ts          Site name, navigation, and social URLs
│   ├── features/               Article, analytics, portfolio, and social logic
│   ├── lib/                    Database, auth, validation, uploads, and helpers
│   └── types/                  Shared TypeScript domain types
├── .env.example                Environment-variable template
├── next.config.ts              Next.js configuration
├── package.json                Dependencies and npm scripts
└── tsconfig.json               TypeScript configuration
```

The nested `dk-sm-academy/` directory contains a stale create-next-app
README/template and is not the application root. Use the repository root
README and root `package.json` for setup.

## Public Website Pages

The public route group contains these routes:

| Route | Purpose |
| --- | --- |
| `/` | Academy landing page |
| `/about` | Academy information |
| `/services` | Services overview |
| `/services/buy-sell` | Buy and sell service |
| `/services/airdrops` | Airdrops service |
| `/services/exchange-campaigns` | Exchange campaigns service |
| `/services/trading` | Trading/market analysis service |
| `/services/courses` | Courses service |
| `/portfolio` | Published portfolio entries |
| `/reviews` | Published reviews |
| `/blog` | Published article listing |
| `/blog/[slug]` | Published article detail |
| `/learning` | Learning content |
| `/learning-resources` | Learning resources |
| `/community` | Community channels |
| `/faq` | Frequently asked questions |
| `/privacy-policy` | Privacy policy |
| `/terms` | Terms and conditions |
| `/disclaimer` | Disclaimer |
| `/data-deletion` | Data deletion instructions |
| `/robots.txt` | Robots metadata |
| `/sitemap.xml` | Sitemap |

The configured community links are defined in `src/config/site.ts`. The
WhatsApp Channel and YouTube links are outbound links; the WhatsApp link does
not represent an API connection.

## Admin Dashboard

The admin area is available under `/admin`:

- `/admin/login` provides the administrator sign-in form.
- `/admin/dashboard` shows content totals, visitor growth, recent activity, and
  social analytics.
- `/admin/articles` lists articles with search, status filters, pagination,
  status changes, editing, preview, and deletion.
- `/admin/articles/new` creates an article.
- `/admin/articles/[id]/edit` edits an existing article.
- `/admin/articles/[id]/preview` previews an article.
- `/admin/portfolio` manages portfolio/client reviews.
- `/admin/portfolio/new` and `/admin/portfolio/[id]/edit` manage entries.
- `/admin/portfolio/[id]/preview` previews a portfolio entry.
- `/admin/media` provides the media management surface.
- `/admin/resources`, `/admin/services`, `/admin/faqs`,
  `/admin/testimonials`, and `/admin/social-links` are available admin
  navigation destinations in the current application.
- `/admin/profile` manages administrator profile information.
- `/admin/settings` provides administrator settings and password management.

All protected pages use the shared protected layout and existing session
authorization. The desktop sidebar and mobile drawer use the same admin
navigation destinations.

## Authentication and Session Management

- The application provisions one administrator account with database ID `1`.
- Passwords are hashed with `bcryptjs`; plaintext passwords are not stored.
- Sign-in is handled by `POST /api/admin/session`.
- Sign-out is handled by `DELETE /api/admin/session`.
- Login attempts are rate-limited per email/IP bucket to 8 attempts within a
  15-minute window.
- Successful login creates a random session token. Only its SHA-256 hash is
  stored in `admin_sessions`.
- Sessions expire after 12 hours.
- Production uses an `__Host-admin_session` cookie; development uses
  `admin_session`.
- Session cookies are `HttpOnly`, `SameSite=Lax`, path-scoped, expiry-bound,
  and `Secure` in production.
- Protected page access uses `requireAdmin()`.
- Mutating admin API requests require a same-origin request and a valid admin
  session.
- Expired or missing sessions are removed and protected pages redirect to the
  login page.

The project does not use a third-party login provider for administrator
authentication. Google OAuth is used only for the optional YouTube analytics
connection described below.

## Database Design

The ordered migrations in `migrations/` create and extend these structures:

| Table | Purpose |
| --- | --- |
| `schema_migrations` | Tracks applied migration filenames |
| `admin_accounts` | The single administrator account |
| `admin_sessions` | Hashed admin session tokens and expiry |
| `admin_login_attempts` | Login rate-limit buckets |
| `articles` | Article metadata, JSON content blocks, status, and SEO data |
| `portfolio_reviews` | Portfolio/client review content and publication state |
| `admin_activity` | Audit-style content-management activity |
| `visitor_daily_counts` | Aggregated daily public visitor counts |
| `social_provider_connections` | Encrypted social OAuth connections |
| `social_metric_snapshots` | Historical social metric snapshots |

Important relationships and constraints include:

- `admin_sessions.admin_id` references `admin_accounts.id` with cascade
  deletion.
- `admin_activity.actor_id` references `admin_accounts.id`.
- `social_metric_snapshots.provider` references
  `social_provider_connections.provider`.
- Article content is stored as a JSONB array and is not constrained by an
  application-level body-length limit.
- Article title, excerpt, slug, URLs, hashtags, and SEO fields retain explicit
  validation and database constraints.

## Article Management System

Articles are stored as structured content blocks rather than raw HTML. The
admin editor supports:

- Title, generated slug, short description, category, hashtags, article link,
  display order, thumbnail, SEO title, and SEO description.
- H2 and H3 headings.
- Paragraphs of practical long-form length.
- Ordered and unordered lists.
- Internal or external links.
- Article images with alt text and optional captions.
- Draft saving, publishing, unpublishing, editing, previewing, and deletion.

The client sends article data to:

- `POST /api/admin/articles` for creation.
- `GET /api/admin/articles` for listing.
- `GET /api/admin/articles/[id]` for editing data.
- `PUT /api/admin/articles/[id]` for full updates.
- `PATCH /api/admin/articles/[id]` for publication status changes.
- `DELETE /api/admin/articles/[id]` for deletion.

The server validates the structured payload, stores the complete content array
as JSONB, and does not silently truncate article content. Published articles
are queried by status and rendered through `ArticleContent` on the public
article page.

## Analytics and Social Integrations

### Visitor analytics

The public visitor beacon sends same-origin requests to
`POST /api/analytics/visit`. Admin and API paths are excluded. Visits are
aggregated by UTC day in `visitor_daily_counts`, with a signed, HTTP-only
day cookie used to identify the visitor state. The dashboard reads monthly or
yearly series through the protected analytics API.

This is aggregate daily counting, not a per-user analytics platform.

### YouTube

The implemented social analytics provider is YouTube:

1. An administrator starts the Google OAuth flow from the dashboard.
2. The application requests the read-only YouTube scope.
3. OAuth state is signed and expires after 10 minutes.
4. The selected channel connection and tokens are encrypted with AES-256-GCM
   before database storage.
5. The provider fetches the channel subscriber count from the YouTube Data API.
6. Counts are stored as dated snapshots and shown in the dashboard.
7. Expired tokens can be refreshed; failed connections are marked with an
   appropriate status.

Automatic refresh can be invoked through
`POST /api/admin/social-analytics/cron` with a bearer value matching
`SOCIAL_ANALYTICS_CRON_SECRET`. The repository does not include a `vercel.json`
cron schedule, so scheduling that endpoint requires an external or separately
configured scheduler.

### WhatsApp Channel

The WhatsApp Channel is configured as an outbound URL in
`src/config/site.ts`. The dashboard button opens the channel in a new tab.
There is no WhatsApp API, OAuth flow, follower-count retrieval, live metric,
or synchronization implemented.

### Other social schema entries

The social migration permits several provider names for database compatibility,
but the application runtime currently exposes only the YouTube provider.

## Environment Variables

Copy `.env.example` to `.env.local` for local development. Use secret storage
in production and never commit real values.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL and metadata base URL |
| `ANALYTICS_COOKIE_SECRET` | HMAC secret for the public visitor cookie |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Server-side Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Server-side Cloudinary API secret |
| `SOCIAL_ANALYTICS_ENCRYPTION_KEY` | Base64-encoded 32-byte key for encrypted social tokens |
| `SOCIAL_ANALYTICS_CRON_SECRET` | Bearer secret for the protected social refresh endpoint |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID for YouTube |
| `GOOGLE_CLIENT_SECRET` | Server-side Google OAuth client secret |
| `GOOGLE_OAUTH_REDIRECT_URI` | Registered OAuth callback URL |

Example values must be replaced with real deployment-specific values:

```dotenv
DATABASE_URL=<postgresql-connection-string>
NEXT_PUBLIC_SITE_URL=https://www.dksmacademy.tech
ANALYTICS_COOKIE_SECRET=<random-secret>
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<server-api-key>
CLOUDINARY_API_SECRET=<server-api-secret>
SOCIAL_ANALYTICS_ENCRYPTION_KEY=<base64-encoded-32-byte-key>
SOCIAL_ANALYTICS_CRON_SECRET=<random-cron-secret>
GOOGLE_CLIENT_ID=<google-oauth-client-id>
GOOGLE_CLIENT_SECRET=<google-oauth-client-secret>
GOOGLE_OAUTH_REDIRECT_URI=https://www.dksmacademy.tech/api/admin/social-analytics/callback/youtube
```

`NODE_ENV` is supplied by the runtime and controls production cookie security;
it is not listed as a project-specific variable in `.env.example`.

## Installation and Local Development

### Prerequisites

- Node.js compatible with the installed Next.js and TypeScript versions.
- npm.
- PostgreSQL database.
- Cloudinary account for image uploads.
- Google Cloud OAuth credentials only if YouTube analytics is needed.

### Setup

```bash
git clone https://github.com/MuhammadMoueen/dk-sm-academy.git
cd dk-sm-academy
npm install
copy .env.example .env.local
```

On macOS/Linux, use `cp .env.example .env.local` instead of `copy`.

Set at least `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`, and
`ANALYTICS_COOKIE_SECRET` in `.env.local`. Add Cloudinary variables before
using uploads. Add the social analytics variables only when configuring
YouTube.

Apply migrations and provision the initial administrator:

```bash
npm run db:migrate
npm run db:provision-admin
```

The provisioning command prompts interactively for the administrator email,
display name, and password. It will not overwrite an existing account.

Start development:

```bash
npm run dev
```

Open <http://localhost:3000>. The admin sign-in page is
<http://localhost:3000/admin/login>.

## Available Commands

These are the scripts defined in the root `package.json`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create the optimized production build |
| `npm run start` | Start the production server after building |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Apply pending PostgreSQL migrations |
| `npm run db:provision-admin` | Create the initial administrator interactively |

There is no `test` script currently defined in `package.json`.

## Database Setup and Migrations

`npm run db:migrate` loads `.env.local`, discovers migration files matching
`NNN_name.sql`, sorts them, and records applied filenames in
`schema_migrations`. Each migration runs in a transaction while the script
holds a PostgreSQL advisory lock, which prevents concurrent migration runs.

Run migrations only against the intended database. The script does not reset,
drop, or recreate existing application data. Back up production data and
review new migration files before applying them.

## Deployment Guide

The application is compatible with a standard Next.js deployment on Vercel.
No `vercel.json` or repository-managed Vercel project configuration is
included, so configure the Vercel project and domain in the Vercel dashboard.

Recommended deployment sequence:

1. Import the GitHub repository into Vercel.
2. Use the repository root as the project root.
3. Add the production environment variables listed above.
4. Set `NEXT_PUBLIC_SITE_URL` to `https://www.dksmacademy.tech`.
5. Configure the custom domain and DNS records in Vercel.
6. Ensure the production PostgreSQL provider accepts Vercel connections.
7. Run `npm run db:migrate` against the intended production database before
   using protected content-management features.
8. Register the exact production value of
   `GOOGLE_OAUTH_REDIRECT_URI` in the Google Cloud OAuth client if YouTube
   analytics is enabled.
9. Deploy and verify `/`, `/blog`, `/admin/login`, image uploads, and any
   enabled YouTube OAuth flow.

Keep all server secrets out of client-exposed variables and out of Git. A
deployment must have a reachable database; the public content and admin
dashboard depend on PostgreSQL.

## Security Considerations

- Use strong, unique values for all application secrets.
- Store secrets only in local ignored files or deployment secret storage.
- Use HTTPS in production so secure cookies and OAuth redirects work correctly.
- Do not expose Cloudinary API secrets, Google client secrets, database URLs,
  encryption keys, or cron secrets to the browser.
- Keep the exact OAuth redirect URI registered with Google.
- Preserve the same-origin checks on mutating APIs.
- Keep the login rate limiter and bcrypt password hashing enabled.
- Do not run migration or provisioning commands against an unintended database.
- Restrict access to the Vercel project, PostgreSQL instance, Cloudinary
  account, and Google Cloud project.

## Known Limitations and Future Improvements

Verified current limitations:

- Only one administrator account is supported.
- Only YouTube is implemented as a social analytics provider at runtime.
- WhatsApp provides a link only; it has no API metrics or synchronization.
- The contact POST endpoint currently returns `501 Not Implemented`.
- The repository has no automated test script.
- Social refresh has a protected cron endpoint but no repository-managed Vercel
  cron schedule.
- Visitor analytics are daily aggregate counts rather than detailed visitor
  profiles.
- Cloudinary is required for the admin upload controls.
- The repository does not specify a software license.

Potential future improvements should be evaluated separately from the current
implementation, for example adding automated tests, implementing a contact
workflow, adding a managed scheduled refresh, and supporting additional
analytics providers.

## Troubleshooting

### `DATABASE_URL is required`

Create `.env.local` from `.env.example`, set `DATABASE_URL`, and restart the
development server or rerun the database command.

### Migrations fail or appear to run against the wrong database

Check the connection string in `.env.local`, confirm the PostgreSQL instance
is reachable, and inspect `schema_migrations`. Do not rerun destructive SQL or
manually delete migration records.

### Admin sign-in fails

Confirm migrations were applied and run `npm run db:provision-admin` from an
interactive terminal. The provisioning command never overwrites an existing
administrator. Also verify the browser is using the same origin as the
application.

### Image uploads are unavailable

Set all three Cloudinary variables, restart Next.js, and use PNG, JPEG, or WebP
files smaller than 8 MB. Uploads require an authenticated admin session.

### YouTube analytics is not connected

Set the Google OAuth variables and the 32-byte social encryption key. Ensure
the exact callback URL is registered with Google, then reconnect YouTube from
the admin dashboard. Token refresh requires a valid stored refresh token.

### Social refresh is unauthorized

Calls to the cron endpoint must include:

```http
Authorization: Bearer <SOCIAL_ANALYTICS_CRON_SECRET>
```

### The public site has no articles or reviews

Only records with `published` status are rendered publicly. Check the admin
content status and confirm the application is connected to the expected
PostgreSQL database.

## Contributing / Development Guidelines

1. Create a focused branch for each change.
2. Inspect existing patterns before adding a new component, route, or helper.
3. Keep secrets in environment configuration, never in source control.
4. Preserve authentication, authorization, validation, and migration safety.
5. Run `npm run lint`, `npx tsc --noEmit`, and `npm run build` before opening a
   pull request.
6. If database behavior changes, add an ordered migration and document the
   operational impact.
7. Keep public and admin UI changes responsive and keyboard accessible.
8. Review the final diff for unrelated files and data changes.

## Acknowledgements

This project uses and builds on:

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Cloudinary](https://cloudinary.com/)
- [Google YouTube Data API](https://developers.google.com/youtube/v3)
- [Zod](https://zod.dev/)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
