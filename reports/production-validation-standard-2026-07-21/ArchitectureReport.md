# Architecture Report

| Field | Value |
|-------|-------|
| Standard | Production Execution & Validation Standard |
| Repository | `waelzaid66-max/-BANCO-CA-OOM-` |
| Branch | `main` |
| Commit | `7c74602fbbc0e7ecaa65f945ebbefb1e29de73aa` (`7c74602`) |
| Describe | `v1.4.0-stable-2026-07-18-206-g7c74602` |
| Latest tag | `v1.4.0-stable-2026-07-18` |
| Author | Cursor agent (validation standard) |
| Date | 2026-07-21 |
| Production accepted | **NO** |



Monorepo: pnpm + artifacts (api-server, banco-mobile, admin-os, dealer-os, banco-web, banco-website, landing) + lib (db, api-spec, api-zod, api-client-react, taxonomy, search-contract, design-tokens).

Maps live path: **Leaflet/OSM WebView** (not Google Maps SDK), despite unused `react-native-maps` / `@types/google.maps` packages.

Auth: Clerk; OAuth google/apple in profile; Facebook = social link icon only (not login provider).

Integrity: `scripts/chain-integrity-gate.mjs` — PASS.

