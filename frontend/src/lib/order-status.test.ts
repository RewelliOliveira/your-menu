import { describe, expect, it } from "vitest";

import { canTransition, getNextStep } from "./order-status";

describe("canTransition", () => {
  it("allows the normal flow and cancelling active orders", () => {
    expect(canTransition("PENDING", "CONFIRMED")).toBe(true);
    expect(canTransition("CONFIRMED", "IN_DELIVERY")).toBe(true);
    expect(canTransition("IN_DELIVERY", "DELIVERED")).toBe(true);
    expect(canTransition("IN_DELIVERY", "CANCELLED")).toBe(true);
  });

  it("rejects skipping steps, going back and leaving final states", () => {
    expect(canTransition("PENDING", "DELIVERED")).toBe(false);
    expect(canTransition("IN_DELIVERY", "CONFIRMED")).toBe(false);
    expect(canTransition("DELIVERED", "CANCELLED")).toBe(false);
    expect(canTransition("CANCELLED", "PENDING")).toBe(false);
  });
});

describe("getNextStep", () => {
  it("skips delivery for pickup orders", () => {
    expect(getNextStep("CONFIRMED", "PICKUP")?.status).toBe("DELIVERED");
    expect(getNextStep("CONFIRMED", "DELIVERY")?.status).toBe("IN_DELIVERY");
  });

  it("only suggests transitions that are allowed", () => {
    for (const fulfillment of ["DELIVERY", "PICKUP"] as const) {
      for (const status of ["PENDING", "CONFIRMED", "IN_DELIVERY"] as const) {
        const next = getNextStep(status, fulfillment);
        expect(next && canTransition(status, next.status)).toBe(true);
      }
    }
  });

  it("has no next step for final states", () => {
    expect(getNextStep("DELIVERED", "DELIVERY")).toBeNull();
    expect(getNextStep("CANCELLED", "PICKUP")).toBeNull();
  });
});
