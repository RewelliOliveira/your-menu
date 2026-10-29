import { describe, expect, it } from "vitest";

import { WEEKDAYS, isAcceptingOrders, isWithinBusinessHours } from "../src/domain/business-hours";
import { canTransition } from "../src/domain/order-status";
import { slugify } from "../src/domain/text";
import type { BusinessHours } from "../src/types/restaurant";

function week(overrides: Partial<Record<BusinessHours["weekday"], Partial<BusinessHours>>> = {}) {
  return WEEKDAYS.map((weekday) => ({
    weekday,
    isOpen: true,
    openingTime: "18:00",
    closingTime: "23:30",
    ...overrides[weekday],
  }));
}

const tuesdayAt = (hours: number, minutes = 0) => new Date(2026, 9, 20, hours, minutes);
const wednesdayAt = (hours: number, minutes = 0) => new Date(2026, 9, 21, hours, minutes);

describe("isWithinBusinessHours", () => {
  it("is open between opening and closing", () => {
    expect(isWithinBusinessHours(week(), tuesdayAt(18))).toBe(true);
    expect(isWithinBusinessHours(week(), tuesdayAt(23, 29))).toBe(true);
    expect(isWithinBusinessHours(week(), tuesdayAt(23, 30))).toBe(false);
  });

  it("treats a closing time before the opening as a shift past midnight", () => {
    const hours = week({ TUESDAY: { closingTime: "02:00" }, WEDNESDAY: { isOpen: false } });
    expect(isWithinBusinessHours(hours, wednesdayAt(1, 59))).toBe(true);
    expect(isWithinBusinessHours(hours, wednesdayAt(2))).toBe(false);
  });

  it("stays open around the clock when opening equals closing", () => {
    const hours = week({ TUESDAY: { openingTime: "00:00", closingTime: "00:00" } });
    expect(isWithinBusinessHours(hours, tuesdayAt(12))).toBe(true);
  });
});

describe("isAcceptingOrders", () => {
  it("requires the store switch on and the time within business hours", () => {
    expect(isAcceptingOrders({ isOpen: true }, week(), tuesdayAt(20))).toBe(true);
    expect(isAcceptingOrders({ isOpen: true }, week(), tuesdayAt(10))).toBe(false);
    expect(isAcceptingOrders({ isOpen: false }, week(), tuesdayAt(20))).toBe(false);
  });
});

describe("canTransition", () => {
  it("follows the order flow and keeps final states final", () => {
    expect(canTransition("PENDING", "CONFIRMED")).toBe(true);
    expect(canTransition("PENDING", "DELIVERED")).toBe(false);
    expect(canTransition("DELIVERED", "CANCELLED")).toBe(false);
  });
});

describe("slugify", () => {
  it("builds url-safe slugs from restaurant names", () => {
    expect(slugify("  Cantina São João & Cia ")).toBe("cantina-sao-joao-cia");
    expect(slugify("!!!")).toBe("");
  });
});
