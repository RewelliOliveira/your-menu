import { describe, expect, it } from "vitest";

import {
  formatCurrency,
  formatRelative,
  maskCep,
  maskCurrency,
  maskPhone,
  normalizeText,
  parseCurrency,
  pluralize,
  toCurrencyMask,
} from "./format";

describe("currency", () => {
  it("formats values as BRL", () => {
    expect(formatCurrency(1234.5)).toBe("R$ 1.234,50");
  });

  it("masks typed digits as cents", () => {
    expect(maskCurrency("")).toBe("");
    expect(maskCurrency("5")).toBe("0,05");
    expect(maskCurrency("0012345")).toBe("123,45");
    expect(maskCurrency("R$ 1.234,56")).toBe("1.234,56");
  });

  it("round-trips between numbers and masks", () => {
    expect(parseCurrency("1.234,56")).toBe(1234.56);
    expect(parseCurrency("")).toBe(0);
    expect(toCurrencyMask(19.9)).toBe("19,90");
    expect(parseCurrency(toCurrencyMask(0.1 + 0.2))).toBe(0.3);
  });
});

describe("masks", () => {
  it("masks landline and mobile phones as they are typed", () => {
    expect(maskPhone("")).toBe("");
    expect(maskPhone("11")).toBe("(11");
    expect(maskPhone("1199")).toBe("(11) 99");
    expect(maskPhone("1133334444")).toBe("(11) 3333-4444");
    expect(maskPhone("11999998888")).toBe("(11) 99999-8888");
    expect(maskPhone("1199999888877")).toBe("(11) 99999-8888");
  });

  it("masks CEPs", () => {
    expect(maskCep("01310")).toBe("01310");
    expect(maskCep("01310100")).toBe("01310-100");
    expect(maskCep("01310-1009")).toBe("01310-100");
  });
});

describe("text", () => {
  it("normalizes accents and case for search", () => {
    expect(normalizeText("  Açaí GRANDE ")).toBe("acai grande");
  });

  it("pluralizes by count", () => {
    expect(pluralize(1, "item", "itens")).toBe("1 item");
    expect(pluralize(2, "item", "itens")).toBe("2 itens");
    expect(pluralize(0, "pedido")).toBe("0 pedidos");
  });

  it("describes relative times", () => {
    const now = new Date(2026, 9, 20, 12).getTime();
    expect(formatRelative(new Date(now - 20_000).toISOString(), now)).toBe("agora");
    expect(formatRelative(new Date(now - 5 * 60_000).toISOString(), now)).toBe("há 5 minutos");
    expect(formatRelative(new Date(now - 3 * 3_600_000).toISOString(), now)).toBe("há 3 horas");
    expect(formatRelative(new Date(now - 24 * 3_600_000).toISOString(), now)).toBe("ontem");
  });
});
