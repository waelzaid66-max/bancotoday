import { describe, it, expect } from "vitest";
import { validateAttributes } from "./ListingService";

/**
 * Sub-type-aware attribute floors (#13). `rooms` is required for built real-estate
 * units but NOT for raw land / bare commercial plots, so a land listing is never
 * forced to invent a room count. Pure function — no DB. Mirrors the mobile gate
 * (requiredSpecKeysFor / REAL_ESTATE_NO_ROOMS_TYPES).
 */
describe("validateAttributes — real-estate rooms floor is sub-type aware", () => {
  it("requires rooms for a built unit (apartment)", () => {
    const ok = validateAttributes("real_estate", { area: 120, property_type: "apartment", rooms: 3 });
    expect(ok.valid).toBe(true);

    const missing = validateAttributes("real_estate", { area: 120, property_type: "apartment" });
    expect(missing.valid).toBe(false);
    expect(missing.errors.join(" ")).toMatch(/rooms/);
  });

  it("does NOT require rooms for land / shop / office / clinic", () => {
    for (const property_type of ["land", "shop", "office", "clinic"]) {
      const res = validateAttributes("real_estate", { area: 500, property_type });
      expect(res.valid, `${property_type} should publish without rooms`).toBe(true);
    }
  });

  it("still requires area for real-estate regardless of sub-type", () => {
    const res = validateAttributes("real_estate", { property_type: "land" });
    expect(res.valid).toBe(false);
    expect(res.errors.join(" ")).toMatch(/area/);
  });

  it("keeps the car + industrial floors intact", () => {
    expect(validateAttributes("car", { mileage: 50000, condition: "used" }).valid).toBe(true);
    expect(validateAttributes("car", { mileage: 50000 }).valid).toBe(false); // missing condition
    expect(validateAttributes("industrial", { capacity: "500 u/hr" }).valid).toBe(true);
    expect(validateAttributes("industrial", {}).valid).toBe(false); // missing capacity
  });
});
