// Production-hardening regression guards for rental host + notification deep-links.
// Zero-dependency (node:test). Run with:
//   pnpm --filter @workspace/banco-mobile run test:lib

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.dirname(__dirname);

const RENTAL_HOST = path.join(APP_ROOT, "lib", "rentalHost.ts");
const NOTIF_ROUTING = path.join(APP_ROOT, "lib", "notificationRouting.ts");
const PROFILE = path.join(APP_ROOT, "app", "(tabs)", "profile.tsx");
const LAYOUT = path.join(APP_ROOT, "app", "_layout.tsx");

test("rentalHost treats is_bookable === true as bookable", () => {
  const src = fs.readFileSync(RENTAL_HOST, "utf8");
  assert.match(
    src,
    /is_bookable\s*===\s*true/,
    "rentalHost must gate on is_bookable === true (furnished daily marketplace only)",
  );
  assert.match(
    src,
    /filterBookableListings/,
    "rentalHost must export filterBookableListings for profile hub visibility",
  );
});

// Contract after 72a8e01: server stamps data.role (guest|host); the router
// opens that side. Legacy rows without role keep the host default. Must NOT
// regress to a hardcoded role:"host" (that sent guests to an empty host inbox).
test("booking notifications route by stamped side (guest|host), default host", () => {
  const src = fs.readFileSync(NOTIF_ROUTING, "utf8");

  assert.match(
    src,
    /type\s*===\s*["']booking["'][\s\S]*pathname:\s*["']\/bookings["']/,
    "booking notifications must deep-link to /bookings",
  );

  assert.match(
    src,
    /role:\s*d\.role\s*===\s*["']guest["']\s*\?\s*["']guest["']\s*:\s*["']host["']/,
    "must open guest trips when role=guest, else host inbox (legacy default)",
  );

  assert.doesNotMatch(
    src,
    /params:\s*\{\s*role:\s*["']host["']\s*\}/,
    'must not hardcode role:"host" (that broke guest booking taps in 72a8e01)',
  );
});

test("payment and subscription notifications route to billing hub", () => {
  const src = fs.readFileSync(NOTIF_ROUTING, "utf8");
  assert.match(src, /payment_success/, "payment_success type must be handled");
  assert.match(src, /payment_failed/, "payment_failed must route to billing hub");
  assert.match(src, /subscription_expiring/, "subscription_expiring must be handled");
  assert.match(
    src,
    /return\s+["']\/billing["']\s+as\s+Href/,
    "billing-related notifications must open /billing full page",
  );
});

test("message notification deep-link forwards listingId when stamped", () => {
  const src = fs.readFileSync(NOTIF_ROUTING, "utf8");
  assert.match(
    src,
    /type === "message"[\s\S]*?listingId:\s*d\.listing_id/,
    "push/feed message taps must pass listingId (server stamps listing_id)",
  );
  assert.match(
    src,
    /financing_lead_id[\s\S]*?\/business\/banks/,
    "FI handoff pings must open Banks hub",
  );
});

test("rental hub is a registered stack route", () => {
  const layout = fs.readFileSync(LAYOUT, "utf8");
  assert.match(layout, /name="rentals\/hub"/, "rentals/hub must be in root stack");
  const profile = fs.readFileSync(PROFILE, "utf8");
  assert.match(profile, /\/rentals\/hub/, "profile menu must link to rental hub");
});

test("profile Payments menu opens billing hub (wallet remains linked inside)", () => {
  const src = fs.readFileSync(PROFILE, "utf8");
  assert.match(
    src,
    /profile\.menuWallet[\s\S]*router\.push\(\s*["']\/billing["']\s+as\s+Href\s*\)/,
    "profile Payments entry must open /billing without removing /wallet screen",
  );
});

// Anti-wipe guards: 93b650b reintroduced baseline touch-traps after f70e016/4ccf939.
// These must never return — they make overflow menus fill the screen / eat taps.
test("profile overflow menu stays touch-safe (no nested responder trap)", () => {
  const src = fs.readFileSync(PROFILE, "utf8");
  const modalStart = src.indexOf("{/* Overflow menu");
  assert.ok(modalStart >= 0, "overflow menu marker must exist");
  const modalEnd = src.indexOf("</Modal>", modalStart);
  assert.ok(modalEnd > modalStart, "overflow menu Modal must close");
  const block = src.slice(modalStart, modalEnd);
  assert.doesNotMatch(
    block,
    /onStartShouldSetResponder/,
    "profile menu must NOT use onStartShouldSetResponder (93b650b pollution)",
  );
  assert.match(
    block,
    /StyleSheet\.absoluteFillObject/,
    "profile menu dismiss control must be a sibling absoluteFill Pressable",
  );
  assert.match(
    block,
    /<ScrollView[\s\S]*menuItems\.map/,
    "profile menu items must scroll inside the sheet",
  );
  assert.match(
    src,
    /menuSheet:\s*\{[\s\S]*?maxHeight:\s*["']85%["']/,
    "menuSheet must cap at maxHeight 85% (4ccf939)",
  );
});

test("PromoteButton sheet stays touch-safe (no nested responder trap)", () => {
  const src = fs.readFileSync(
    path.join(APP_ROOT, "components", "PromoteButton.tsx"),
    "utf8",
  );
  assert.doesNotMatch(
    src,
    /onStartShouldSetResponder/,
    "PromoteButton must not nest onStartShouldSetResponder under backdrop Pressable",
  );
  assert.match(
    src,
    /StyleSheet\.absoluteFillObject/,
    "PromoteButton must dismiss via sibling absoluteFill Pressable",
  );
});

test("home logo/sort menus stay touch-safe (no nested responder trap)", () => {
  const src = fs.readFileSync(
    path.join(APP_ROOT, "app", "(tabs)", "index.tsx"),
    "utf8",
  );
  assert.doesNotMatch(
    src,
    /onStartShouldSetResponder/,
    "home feed menus must not use onStartShouldSetResponder (f70e016 / anti-93b650b)",
  );
  const absCount = (src.match(/StyleSheet\.absoluteFillObject/g) || []).length;
  assert.ok(
    absCount >= 2,
    "home logo + sort menus each need an absoluteFill dismiss Pressable",
  );
});

test("account-type gate keeps Skip + dismiss-first anti-trap", () => {
  const src = fs.readFileSync(PROFILE, "utf8");
  assert.match(src, /testID="onboard-skip"/, "Skip control must remain (224ef4f)");
  assert.match(
    src,
    /demoteBlockedTitle/,
    "elevated self-demote must stay client-blocked (S4)",
  );
  const fn = src.indexOf("const chooseAccountType");
  assert.ok(fn >= 0);
  // Include demote guard preamble before dismiss/updateMe (slice must be long enough).
  const slice = src.slice(fn, fn + 2800);
  const dismiss = slice.indexOf("setNeedsAccountType(false)");
  const update = slice.indexOf("await updateMe({ account_type");
  const chosen = slice.indexOf("accountTypeChosen: true");
  assert.ok(dismiss >= 0 && update >= 0, "chooseAccountType must dismiss + updateMe");
  assert.ok(
    dismiss < update,
    "must dismiss gate BEFORE updateMe (df68258 anti-trap)",
  );
  assert.ok(
    chosen >= 0 && update < chosen,
    "Clerk accountTypeChosen must follow successful updateMe (cold-restart SoT)",
  );
  assert.match(
    src,
    /setNeedsAccountType\(true\)/,
    "post-signup / chooseAccountType failure must reopen retry gate",
  );
});

test("search map restores locate-me control (fcd7d1c)", () => {
  const html = fs.readFileSync(
    path.join(APP_ROOT, "components", "search", "mapHtml.ts"),
    "utf8",
  );
  const map = fs.readFileSync(
    path.join(APP_ROOT, "components", "search", "SearchResultsMap.tsx"),
    "utf8",
  );
  assert.match(html, /LocateControl/, "mapHtml must include LocateControl");
  assert.match(html, /locate-btn/, "locate button styles required");
  assert.match(html, /locate_error/, "locate failures must post to host (N2)");
  assert.match(map, /geolocationEnabled/, "WebView must enable geolocation");
  assert.match(map, /locate_error/, "native map must Alert on locate_error");
});

test("search map frames by market country center (b68c8af restore)", () => {
  const tax = fs.readFileSync(
    path.join(APP_ROOT, "lib", "searchTaxonomy.ts"),
    "utf8",
  );
  const html = fs.readFileSync(
    path.join(APP_ROOT, "components", "search", "mapHtml.ts"),
    "utf8",
  );
  const map = fs.readFileSync(
    path.join(APP_ROOT, "components", "search", "SearchResultsMap.tsx"),
    "utf8",
  );
  assert.match(tax, /export function marketCountryMapCenter/, "taxonomy center helper required");
  assert.match(tax, /FR:\s*\{\s*lat:/, "EU markets must have map centers");
  for (const iso of ["LB", "MA", "TN", "SD"]) {
    assert.match(
      tax,
      new RegExp(`${iso}:\\s*\\{\\s*lat:`),
      `${iso} must have map center (catalog market must not frame as EG)`,
    );
  }
  assert.match(
    html,
    /center\?: \{ lat: number; lng: number; zoom: number \}/,
    "buildMapHtml must accept optional center",
  );
  assert.match(
    map,
    /marketCountryMapCenter\(criteria\.marketCountry\)/,
    "native map must pass market center into buildMapHtml",
  );
});

test("European market countries have flags for compressed picker", () => {
  const src = fs.readFileSync(
    path.join(APP_ROOT, "constants", "countryCodes.ts"),
    "utf8",
  );
  for (const iso of ["FR", "DE", "ES", "IT"]) {
    assert.match(
      src,
      new RegExp(`iso:\\s*"${iso}"[\\s\\S]*?flag:\\s*"`),
      `${iso} must have a flag emoji for MarketCountryButton`,
    );
  }
});

test("billing, wallet, and invoices are registered stack routes", () => {
  const src = fs.readFileSync(LAYOUT, "utf8");
  const routes = ["billing", "wallet", "invoices", "invoices/[id]"];
  for (const route of routes) {
    const escaped = route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    assert.match(
      src,
      new RegExp(`name="${escaped}"`),
      `_layout.tsx must register Stack.Screen for ${route}`,
    );
  }
});

test("billing hub exposes monthly CSV export", () => {
  const src = fs.readFileSync(path.join(APP_ROOT, "app", "billing.tsx"), "utf8");
  assert.match(
    src,
    /exportBillingReportCsv/,
    "billing hub must call exportBillingReportCsv for statement export",
  );
  assert.match(src, /testID="billing-export-csv"/, "billing export control must be testable");
});

test("invoice detail exposes PDF download", () => {
  const src = fs.readFileSync(path.join(APP_ROOT, "app", "invoices", "[id].tsx"), "utf8");
  assert.match(src, /downloadInvoicePdf/, "invoice detail must support PDF export");
  assert.match(src, /testID="invoice-download-pdf"/, "invoice PDF button must be testable");
});

test("real-estate engines include facet-gated property_type chips", () => {
  const src = fs.readFileSync(path.join(APP_ROOT, "constants", "engines.ts"), "utf8");
  for (const key of ["duplex", "penthouse", "studio", "office", "commercial_land"]) {
    assert.match(
      src,
      new RegExp(`key:\\s*"${key}"[\\s\\S]*?requiresFacet:\\s*true`),
      `${key} engine must be facet-gated`,
    );
  }
});

test("search params wire near-me geo to API client", () => {
  const src = fs.readFileSync(path.join(APP_ROOT, "lib", "searchParams.ts"), "utf8");
  assert.match(src, /nearMeEnabled/, "SearchCriteria must track near-me toggle");
  assert.match(src, /sp\.near_lat/, "buildSearchParams must send near_lat");
  assert.match(src, /sp\.radius_km/, "buildSearchParams must send radius_km");
});

test("search tab uses market-scoped rental taxonomy adapter", () => {
  const search = fs.readFileSync(path.join(APP_ROOT, "app", "(tabs)", "search.tsx"), "utf8");
  const sheet = fs.readFileSync(
    path.join(APP_ROOT, "components", "search", "FilterSheet.tsx"),
    "utf8",
  );
  assert.match(search, /rentalTermsForSearch/, "search tab must use searchTaxonomy adapter");
  assert.match(search, /MARKET_COUNTRIES/, "search tab must expose per-market rental chips");
  assert.match(sheet, /rentalTermsForSearch/, "FilterSheet must use market-scoped rental terms");
  assert.match(sheet, /filter-near-me/, "FilterSheet must expose near-me control");
});

test("create taxonomy includes engine-aligned commercial property types", () => {
  const src = fs.readFileSync(
    path.join(APP_ROOT, "constants", "listingCreateTaxonomy.ts"),
    "utf8",
  );
  assert.match(src, /commercial_land/, "PROPERTY_TYPES must include commercial_land");
  assert.match(src, /warehouse/, "PROPERTY_TYPES must include warehouse");
});
