import { describe, expect, it } from "vitest";

import { WEEKDAYS, type BusinessHours, type Restaurant } from "@/types/restaurant";
import { isAcceptingOrders, isOpenAllDay, isWithinBusinessHours } from "./business-hours";

function week(overrides: Partial<Record<BusinessHours["weekday"], Partial<BusinessHours>>> = {}) {
  return WEEKDAYS.map((weekday) => ({
    weekday,
    isOpen: true,
    openingTime: "18:00",
    closingTime: "23:30",
    ...overrides[weekday],
  }));
}

// 2026-10-20 is a Tuesday.
const tuesdayAt = (hours: number, minutes = 0) => new Date(2026, 9, 20, hours, minutes);
const wednesdayAt = (hours: number, minutes = 0) => new Date(2026, 9, 21, hours, minutes);

describe("isWithinBusinessHours", () => {
  it("is open between opening and closing", () => {
    expect(isWithinBusinessHours(week(), tuesdayAt(18))).toBe(true);
    expect(isWithinBusinessHours(week(), tuesdayAt(23, 29))).toBe(true);
  });

  it("is closed before opening and from closing time on", () => {
    expect(isWithinBusinessHours(week(), tuesdayAt(17, 59))).toBe(false);
    expect(isWithinBusinessHours(week(), tuesdayAt(23, 30))).toBe(false);
  });

  it("is closed all day when the weekday is off", () => {
    expect(isWithinBusinessHours(week({ TUESDAY: { isOpen: false } }), tuesdayAt(20))).toBe(false);
  });

  it("treats a closing time before the opening as a shift past midnight", () => {
    const hours = week({ TUESDAY: { closingTime: "02:00" }, WEDNESDAY: { isOpen: false } });
    expect(isWithinBusinessHours(hours, tuesdayAt(23, 45))).toBe(true);
    expect(isWithinBusinessHours(hours, wednesdayAt(1, 59))).toBe(true);
    expect(isWithinBusinessHours(hours, wednesdayAt(2))).toBe(false);
  });

  it("closes at midnight when the closing time is 00:00", () => {
    const hours = week({ TUESDAY: { closingTime: "00:00" } });
    expect(isWithinBusinessHours(hours, tuesdayAt(23, 59))).toBe(true);
    expect(isWithinBusinessHours(hours, wednesdayAt(0))).toBe(false);
  });

  it("stays open around the clock when opening equals closing", () => {
    const hours = week({ TUESDAY: { openingTime: "00:00", closingTime: "00:00" } });
    expect(isWithinBusinessHours(hours, tuesdayAt(0))).toBe(true);
    expect(isWithinBusinessHours(hours, tuesdayAt(12))).toBe(true);
    expect(isWithinBusinessHours(hours, tuesdayAt(23, 59))).toBe(true);
  });

  it("wraps from Sunday back to Saturday", () => {
    const hours = week({ SATURDAY: { closingTime: "03:00" } });
    expect(isWithinBusinessHours(hours, new Date(2026, 9, 25, 2))).toBe(true);
  });
});

describe("isAcceptingOrders", () => {
  const restaurant = { isOpen: true } as Restaurant;

  it("requires the store switch on and the time within business hours", () => {
    expect(isAcceptingOrders(restaurant, week(), tuesdayAt(20))).toBe(true);
    expect(isAcceptingOrders(restaurant, week(), tuesdayAt(10))).toBe(false);
    expect(isAcceptingOrders({ ...restaurant, isOpen: false }, week(), tuesdayAt(20))).toBe(false);
  });
});

describe("isOpenAllDay", () => {
  it("is true only for open days with equal opening and closing times", () => {
    const [day] = week();
    expect(isOpenAllDay({ ...day, openingTime: "00:00", closingTime: "00:00" })).toBe(true);
    expect(isOpenAllDay({ ...day, isOpen: false, openingTime: "00:00", closingTime: "00:00" })).toBe(false);
    expect(isOpenAllDay(day)).toBe(false);
  });
});
