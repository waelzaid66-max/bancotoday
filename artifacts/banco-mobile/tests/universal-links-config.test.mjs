import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const APP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APP_CONFIG = path.join(APP_ROOT, "app.config.ts");

test("app.config.ts wires Universal/App Links from env (not hardcoded)", () => {
  const src = fs.readFileSync(APP_CONFIG, "utf8");
  assert.match(src, /webAppLinkHost/);
  assert.match(src, /associatedDomains/);
  assert.match(src, /intentFilters/);
  assert.match(src, /EXPO_PUBLIC_ROUTER_ORIGIN/);
  assert.doesNotMatch(src, /applinks:banco\./i);
});

test("custom scheme bancooom remains in app.json", () => {
  const json = JSON.parse(fs.readFileSync(path.join(APP_ROOT, "app.json"), "utf8"));
  assert.equal(json.expo.scheme, "bancooom");
});

test("Expo product identity stays canonical (BANCO / com.bancooom.app)", () => {
  const json = JSON.parse(fs.readFileSync(path.join(APP_ROOT, "app.json"), "utf8"));
  assert.equal(json.expo.name, "BANCO");
  assert.equal(json.expo.ios?.bundleIdentifier, "com.bancooom.app");
  assert.equal(json.expo.android?.package, "com.bancooom.app");
  // Slug may stay bancoboom for EAS project continuity — scheme/package are SoT.
  assert.equal(json.expo.scheme, "bancooom");
});
