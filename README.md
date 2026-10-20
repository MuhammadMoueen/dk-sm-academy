# DK & SM Academy

Next.js App Router website with public content pages and a protected, PostgreSQL-backed admin dashboard.

## Getting started

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and set `DATABASE_URL` to the PostgreSQL connection string. Keep the real value private and out of source control.
3. Apply the database schema with `npm run db:migrate`.
4. Create the single admin account in an interactive terminal with `npm run db:provision-admin`.
5. Start the development server with `npm run dev`.

The provisioning command prompts for the admin email, display name, and password. It will not overwrite an existing admin account.

## Admin content

Visit `/admin/login` to sign in. The dashboard supports Articles, Portfolio / Client Reviews, and My Profile management. Article content is composed from structured headings, paragraphs, lists, links, and image references. Portfolio reviews support half-star ratings and an optional verified-client badge.

Image upload controls remain disabled until an actual storage provider is configured. Admin forms can reference existing same-site image paths; binary files are not stored in PostgreSQL.

Public article and portfolio sections display published database records only.

## Project structure

- `src/app/(public)/` contains public-facing routes without exposing the route-group name in URLs.
- `src/app/admin/login/` and `src/app/admin/(protected)/` contain the separate admin sign-in and protected dashboard routes.
- `src/app/api/admin/` contains authenticated admin APIs.
- `src/components/` contains shared layout, public, and admin components.
- `src/features/` contains content-domain queries and helpers.
- `src/lib/` contains server-only database, authentication, validation, and admin utilities.
- `migrations/` contains ordered PostgreSQL schema migrations.
- `scripts/` contains database setup utilities.

## Available commands

- `npm run dev` — start the development server.
- `npm run build` — build the production application.
- `npm run start` — start the production application.
- `npm run lint` — run ESLint.
- `npm run db:migrate` — apply pending PostgreSQL migrations.
- `npm run db:provision-admin` — create the initial administrator.
