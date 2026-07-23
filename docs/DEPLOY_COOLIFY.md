# Banco — Coolify on Hostinger VPS Deployment Guide

## Overview

This guide explains how to deploy the entire Banco monorepo on
[Coolify](https://coolify.io) running on a Hostinger VPS.

### Services deployed

| Service | Type | Container Port | Description |
|---------|------|---------------|-------------|
| `postgres` | Postgres 16 | 5432 (internal) | Persistent database |
| `api` | Node.js Express | 8080 | REST + WebSocket API server |
| `banco-web` | Next.js standalone | 3000 | Consumer app (listings, bookings, Clerk auth) |
| `banco-website` | Next.js standalone | 3000 (→ 3001 host) | Marketing website |
| `web` | Nginx + Vite SPAs | 80 | Landing + dealer-os + admin-os (dual path aliases) |

The Expo mobile app (`artifacts/banco-mobile`) runs on iOS/Android via EAS — it is **not** deployed as a server container.

### Live production note (Pre-Exec Gate)

| Fact | Value |
|------|-------|
| Current live API origin | `https://banco.today` (also `https://banco.deals`) |
| Current front door | Google Frontend / GCP — **not** Coolify yet |
| Live SPA paths | `/dealer-os/`, `/admin-os/` |
| Coolify alias paths | `/market/`, `/admin/` (same apps; **both** are served) |
| Coolify on this repo | Files in this guide — DNS cutover is a later wave |

Coolify deploy must **not** delete Replit project files. Replit and Coolify coexist until an explicit cutover.

---

## Quick Start

### 1. Prerequisites

- Coolify installed on your Hostinger VPS (see [Coolify docs](https://coolify.io/docs/installation))
- A domain (or subdomain per service)
- A GitHub personal access token with repo access (or SSH key) configured in Coolify
- PNPM and Node.js 24 installed only on your local machine for migrations

### 2. Add your repository to Coolify

1. In Coolify dashboard → **New Resource** → **Docker Compose**
2. Connect your GitHub/GitLab account
3. Select the `waelzaid66-max/bancoo` repository
4. Set the **Compose file path** to: `docker-compose.coolify.yml`
5. Click **Save**

### 3. Set environment variables

In Coolify's **Environment Variables** tab, add every variable listed in the
[Environment Variables](#environment-variables) section below.

> ⚠️  **Build-time variables** (prefixed `NEXT_PUBLIC_*` and `VITE_*`) are
> baked into the JavaScript bundle at image build time. Changing them requires
> a full rebuild (`Redeploy`). Set them before the first deploy.

### 4. Configure domains in Coolify

In the **Domains** tab, assign a domain to each exposed port:

| Service | Host Port | Assign domain |
|---------|-----------|---------------|
| `api` | 8080 | `api.yourdomain.com` |
| `banco-web` | 3000 | `app.yourdomain.com` |
| `banco-website` | 3001 | `yourdomain.com` |
| `web` (Nginx) | 80 | `static.yourdomain.com` (or your single-origin domain) |

Coolify's built-in Traefik reverse proxy handles HTTPS/TLS automatically via
Let's Encrypt.

### 5. Deploy

Click **Deploy** in Coolify. Coolify will:
1. Pull the source code from GitHub
2. Build all Docker images (API, Next.js apps, Nginx SPAs)
3. Start all containers in dependency order
4. Run health checks on each service

---

## Environment Variables

### Required (API server will refuse to start without these)

| Variable | Description |
|----------|-------------|
| `POSTGRES_PASSWORD` | Postgres database password |
| `CLERK_SECRET_KEY` | Clerk backend secret key (`sk_live_...`) |
| `SESSION_SECRET` | Random 32+ character string for session signing |
| `PAYMENT_CONFIG_ENCRYPTION_KEY` | Random 32+ character hex string for payment config AES encryption |

### Important build-time variables (set before first deploy)

| Variable | Used by | Description |
|----------|---------|-------------|
| `BANCO_WEB_URL` | `banco-web` build | Public URL of the consumer app (e.g. `https://app.yourdomain.com`) |
| `BANCO_WEBSITE_URL` | `banco-website` build | Public URL of the marketing website (e.g. `https://yourdomain.com`) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `banco-web`, `banco-website` builds | Clerk publishable key (`pk_live_...`) |
| `VITE_CLERK_PUBLISHABLE_KEY` | `web` (Vite SPAs) build | Same Clerk publishable key for admin-os / dealer-os |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | `banco-web` build | Google Maps API key for map search |

> **Why is `NEXT_PUBLIC_API_URL` hardcoded to `http://api:8080`?**
>
> `NEXT_PUBLIC_API_URL` is used by the Next.js server for SSR data fetches and
> for the `/api/*` reverse proxy rewrite. Since both `banco-web` and `banco-website`
> run inside the same Docker network as the `api` container, the internal hostname
> `api` resolves to the API container. Browser clients never call this URL directly
> — they use relative `/api/*` paths that the Next.js server proxies internally.
>
> This hardcoded internal URL is correct and intentional. If you move to a
> separate API host, update `NEXT_PUBLIC_API_URL` in both
> `Dockerfile.banco-web` and `Dockerfile.banco-website` and rebuild.

### Optional variables

| Variable | Default | Description |
|----------|---------|-------------|
| `POSTGRES_USER` | `banco` | Postgres user |
| `POSTGRES_DB` | `banco` | Postgres database name |
| `CLERK_PUBLISHABLE_KEY` | — | Clerk publishable key (server-side use in API) |
| `CORS_ALLOWED_ORIGINS` | — | Comma-separated list of allowed CORS origins |
| `PUBLIC_API_BASE_URL` | — | Public-facing API base URL |
| `PUBLIC_APP_URL` | — | Public-facing app base URL |
| `ADMIN_EMAILS` | — | Comma-separated admin email addresses |
| `OPENAI_API_KEY` | — | OpenAI API key (AI features) |
| `OPENAI_MODEL` | — | OpenAI model name |
| `RESEND_API_KEY` | — | Resend API key (email delivery) |
| `EMAIL_FROM` | — | Sender email address |
| `PAYMOB_MODE` | `test` | `test` or `live` |
| `PAYMOB_API_BASE` | — | Paymob API base URL |
| `PAYMOB_PUBLIC_KEY` | — | Paymob public key |
| `PAYMOB_SECRET_KEY` | — | Paymob secret key |
| `PAYMOB_HMAC_SECRET` | — | Paymob HMAC secret |
| `PAYMOB_INTEGRATION_IDS` | — | Paymob integration IDs (JSON) |
| `OBJECT_STORAGE_PROVIDER` | — | **`s3` or `replit` only** — `gcs` is rejected by code |
| `S3_BUCKET` | — | S3 bucket name (when provider=`s3`) |
| `AWS_REGION` | — | AWS region |
| `AWS_ACCESS_KEY_ID` | — | **Required on Hostinger/Coolify** (no IAM role). Optional on AWS with task/instance role |
| `AWS_SECRET_ACCESS_KEY` | — | Pair with access key on non-AWS hosts |
| `PUBLIC_OBJECT_SEARCH_PATHS` | — | Public S3 key prefixes for listing images |
| `PRIVATE_OBJECT_DIR` | — | Private S3 key prefix for uploads |
| `GIT_SHA` | — | Git commit baked into `/api/readyz` (set in Coolify to the deploy commit) |
| `BUILD_ID` | — | Optional build id alongside `GIT_SHA` |
| `ERROR_ALERT_WEBHOOK` | — | Webhook URL for error alerts |
| `LOG_LEVEL` | `info` | Pino log level |
| `LOG_DIR` | — | Directory for log file output (omit to log to stdout only) |
| `CRON_TIMEZONE` | `Africa/Cairo` | Timezone for scheduled jobs |

### Build-time Vite SPA variables (for `web` service)

| Variable | Description |
|----------|-------------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key for admin-os / dealer-os |
| `VITE_CLERK_PROXY_URL` | Clerk proxy URL if using Clerk auth proxy |
| `VITE_API_BASE_URL` | API base URL referenced inside the SPAs |
| `VITE_MARKET_URL` | URL for the market/dealer surface |
| `VITE_ADMIN_URL` | URL for the admin surface |
| `VITE_APP_ANDROID_URL` | Android app store URL |
| `VITE_APP_IOS_URL` | iOS app store URL |

---

## Database Migrations

> ⚠️  **Migrations are NOT run automatically on container start.** This is
> intentional — auto-running schema changes on every boot is unsafe in production.

### First-time setup (new database)

After the `postgres` and `api` containers are running, open a shell in the
API container and push the schema:

```bash
# In Coolify: select the `api` container → Execute Command → /bin/sh

# Push schema (creates/updates tables). --force = NON-INTERACTIVE: the container
# shell has no TTY, and bare `push` can hang on the drizzle data-loss prompt
# (see .agents/memory/post-merge-drizzle-push.md). Always use push-force here.
pnpm --filter @workspace/db run push-force
```

Or with a local `DATABASE_URL` pointing to your production Postgres:

```bash
DATABASE_URL="postgresql://banco:<password>@<vps-ip>:5432/banco" \
  pnpm --filter @workspace/db run push-force
```

### Subsequent deployments

For schema changes after the initial deploy:

```bash
# This project uses drizzle-kit push (schema-push model, NO migration files):
# `lib/db` exposes only `push` / `push-force` (no `generate` / `migrate` scripts).
# Apply schema changes non-interactively (container has no TTY):
pnpm --filter @workspace/db run push-force
```

### Postgres connection string

The `api` container's `DATABASE_URL` is automatically constructed from the
`POSTGRES_*` variables:

```
postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
```

The hostname `postgres` resolves to the Postgres container via Docker's internal
DNS on the `banco_net` network.

---

## Deployment Order

Coolify respects Docker Compose `depends_on` semantics:

1. `postgres` starts first (health-checked: `pg_isready`)
2. `api` starts after Postgres is healthy (health-checked: `/api/healthz`)
3. `banco-web`, `banco-website`, `web` start after API is healthy

This order is enforced by `depends_on: condition: service_healthy` in
`docker-compose.coolify.yml`.

---

## Architecture

```
Internet
    │
    ▼
Coolify Traefik (HTTPS/TLS)
    │
    ├──── app.yourdomain.com  →  banco-web:3000   (Next.js consumer app)
    ├──── yourdomain.com       →  banco-website:3000 (Next.js marketing site)
    ├──── api.yourdomain.com   →  api:8080          (REST API)
    └──── static / single-origin →  web:80         (Nginx: SPAs + /api + /l)
                                      ├── /              landing
                                      ├── /dealer-os/    dealer-os (LIVE path)
                                      ├── /market/       dealer-os (Coolify alias)
                                      ├── /admin-os/     admin-os (LIVE path)
                                      ├── /admin/        admin-os (Coolify alias)
                                      ├── /api/          → api:8080
                                      ├── /l/            → api:8080 (SEO short links)
                                      ├── /sitemap.xml   → api:8080
                                      └── /robots.txt    → api:8080

Internal Docker network (banco_net):
    api:8080  ←──── banco-web (SSR data fetches)
    api:8080  ←──── banco-website (SSR data fetches)
    api:8080  ←──── web/nginx (/api/ + /l/ reverse proxy)
    postgres:5432 ←──── api
```

### Key networking facts

- All services communicate via the `banco_net` Docker bridge network
- `api` service is reachable as hostname `api` from all other containers
- `postgres` is only reachable internally (no host port exposed)
- Browsers call `/api/*` → proxied by Next.js or Nginx — browsers never need the internal `api` hostname
- **`/l/:id` is mounted on the API app root** (`seoRoutes.ts`), not under `/api`. Nginx **must** proxy `/l/`, `/sitemap.xml`, and `/robots.txt` or short links break on the SPA origin
- Live Clerk is bound to **`banco.today`**. Include `https://banco.today` (and deals if used) in `CORS_ALLOWED_ORIGINS` when frontends are separate origins

### Object storage on Hostinger

```
OBJECT_STORAGE_PROVIDER=s3
AWS_REGION=...
S3_BUCKET=...
PUBLIC_OBJECT_SEARCH_PATHS=...
PRIVATE_OBJECT_DIR=...
AWS_ACCESS_KEY_ID=...          # required — VPS has no IAM role
AWS_SECRET_ACCESS_KEY=...
```

Do **not** set `OBJECT_STORAGE_PROVIDER=gcs` — the factory throws. For GCP buckets use S3-compatible HMAC credentials with `s3`.

### Deploy pin

Set `GIT_SHA` (and optionally `BUILD_ID`) in Coolify to the git commit being deployed. After deploy:

```bash
curl -sS https://<your-api-host>/api/readyz
# expect: "gitSha":"<that commit>", "checks":{"database":"ok"}
```

Live `banco.today` (GCP, Pre-Exec) returned ready **without** `gitSha` — Coolify images from this branch fix that when `GIT_SHA` is set.

---

## Expo Mobile App

The Expo app (`artifacts/banco-mobile`) is a React Native mobile app deployed
via Expo Application Services (EAS), not as a Docker container.

- Run `eas build` and `eas submit` from your local machine or CI
- Set `EXPO_PUBLIC_DOMAIN` to your API domain (e.g. `api.yourdomain.com`)
- The mobile app communicates with the API over HTTPS — it is unaffected by
  Docker deployment topology

---

## Troubleshooting

### Container fails to start: "PORT environment variable is required"

The `api` container requires `PORT=8080`. This is set in `docker-compose.coolify.yml`.
If missing, check that Coolify is reading the compose file correctly.

### Next.js app shows blank page or 404 on `/api/*`

1. Verify `NEXT_PUBLIC_API_URL` was set to `http://api:8080` at build time
2. Confirm the `api` service is healthy: check Coolify logs for `api`
3. Check that the `banco-web` and `api` containers are on the same network (`banco_net`)

### Vite SPA (admin-os, dealer-os) shows blank page

1. Verify dual builds: `/dealer-os/` + `/market/` for dealer-os, `/admin-os/` + `/admin/` for admin-os (`Dockerfile.web`)
2. Rebuild the `web` service: in Coolify, force a rebuild
3. Check nginx logs for 404s on asset paths
4. Confirm `/l/<listing-id>` returns listing HTML (proxied to API), not the landing SPA

### Database connection refused

1. Confirm `postgres` container is healthy: `pg_isready -U banco`
2. Verify `POSTGRES_PASSWORD` is set in Coolify environment
3. The `DATABASE_URL` is auto-constructed from `POSTGRES_*` variables; manually
   override with `DATABASE_URL` env var if using an external Postgres

### Clerk authentication errors

- `CLERK_SECRET_KEY` must match the Clerk application in use (`sk_live_...` for production)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `VITE_CLERK_PUBLISHABLE_KEY` must be
  the same publishable key (`pk_live_...`), set before build time

### Slow first deployment

The first build downloads all npm packages. Subsequent builds use BuildKit pnpm
store cache mounts and complete significantly faster.

### Checking service health manually

```bash
# API liveness (no DB dependency)
curl http://<vps-ip>:8080/api/healthz

# API readiness (DB must be up)
curl http://<vps-ip>:8080/api/readyz

# banco-web
curl http://<vps-ip>:3000/api/healthz

# banco-website
curl http://<vps-ip>:3001/api/healthz

# Nginx
curl http://<vps-ip>/nginx-health
```

---

## Production Readiness Checklist

Before going live:

- [ ] Set all **required** environment variables (see table above)
- [ ] Set `BANCO_WEB_URL`, `BANCO_WEBSITE_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` before first build
- [ ] Set `GIT_SHA` to the deploy commit (verify via `/api/readyz`)
- [ ] Configure domains in Coolify → Traefik issues TLS certificates automatically
- [ ] Run database schema push (first time) or migrate (subsequent changes)
- [ ] Set `PAYMOB_MODE=live` and fill in production Paymob credentials (optional until payments go live)
- [ ] Verify `CORS_ALLOWED_ORIGINS` includes all frontend domains (include `https://banco.today` when used)
- [ ] Set up object storage: `OBJECT_STORAGE_PROVIDER=s3` + bucket + **AWS access keys on Hostinger**
- [ ] Never set `OBJECT_STORAGE_PROVIDER=gcs` (rejected in code)
- [ ] Configure `RESEND_API_KEY` for transactional email
- [ ] Set `ERROR_ALERT_WEBHOOK` for production error alerting
- [ ] Test health endpoints + `/l/<id>` + `/dealer-os/` and `/market/`
- [ ] Verify Expo app points to the production API (`EXPO_PUBLIC_DOMAIN`)
- [ ] Do **not** delete Replit files; Coolify cutover is a separate owner-approved wave

---

## Residual Deployment Risks

| Risk | Mitigation |
|------|-----------|
| Vite SPAs require `BASE_PATH` at build time | Dual builds in `Dockerfile.web` (`/dealer-os`+`/market`, `/admin-os`+`/admin`) |
| `/l/` short links on SPA origin | Nginx proxies `/l/`, `/sitemap.xml`, `/robots.txt` to API |
| Hostinger S3 without IAM | Pass `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` in Coolify env |
| `NEXT_PUBLIC_*` vars baked at build time | Document rebuild requirement; use internal `http://api:8080` for SSR |
| First DB migration must be run manually | Documented above; prevents accidental destructive migrations |
| No TLS between internal services | Internal Docker network traffic is trusted; use mTLS if higher security is required |
| `pnpm-lock.yaml` frozen — update lockfile locally if deps change | Run `pnpm install` locally, commit updated lockfile |
