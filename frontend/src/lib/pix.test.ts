import { describe, expect, it } from "vitest";

import { buildPixPayload, crc16 } from "./pix";

const input = {
  key: "contato@yourburger.com.br",
  merchantName: "YourBurger Artesanal",
  merchantCity: "São Paulo",
  amount: 42.5,
  txid: "abc-123",
};

function parseFields(payload: string) {
  const fields: Record<string, string> = {};
  for (let i = 0; i < payload.length; ) {
    const id = payload.slice(i, i + 2);
    const length = Number(payload.slice(i + 2, i + 4));
    fields[id] = payload.slice(i + 4, i + 4 + length);
    i += 4 + length;
  }
  return fields;
}

describe("buildPixPayload", () => {
  it("encodes the EMV fields of a static Pix charge", () => {
    const fields = parseFields(buildPixPayload(input));
    expect(fields["00"]).toBe("01");
    expect(fields["26"]).toBe("0014br.gov.bcb.pix0125contato@yourburger.com.br");
    expect(fields["53"]).toBe("986");
    expect(fields["54"]).toBe("42.50");
    expect(fields["58"]).toBe("BR");
    expect(fields["62"]).toBe("0506abc123");
  });

  it("strips accents and symbols from merchant name and city and truncates them", () => {
    const fields = parseFields(buildPixPayload({ ...input, merchantName: "Café & Pão — Açaí da Esquina Ltda", merchantCity: "São José dos Campos" }));
    expect(fields["59"]).toBe("CAFE  PAO  ACAI DA ESQUIN");
    expect(fields["60"]).toBe("SAO JOSE DOS CA");
  });

  it("falls back when name, city or txid are empty after normalization", () => {
    const fields = parseFields(buildPixPayload({ ...input, merchantName: "!!!", merchantCity: "", txid: "-" }));
    expect(fields["59"]).toBe("RESTAURANTE");
    expect(fields["60"]).toBe("BRASIL");
    expect(fields["62"]).toBe("0503***");
  });

  it("ends with the CRC of everything before it", () => {
    const payload = buildPixPayload(input);
    expect(payload.slice(-8, -4)).toBe("6304");
    expect(payload.slice(-4)).toBe(crc16(payload.slice(0, -4)));
  });
});

describe("crc16", () => {
  it("matches the CRC-16/CCITT-FALSE check value", () => {
    expect(crc16("123456789")).toBe("29B1");
  });

  it("matches the Banco Central reference payload", () => {
    expect(
      crc16(
        "00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-4266554400005204000053039865802BR5913Fulano de Tal6008BRASILIA62070503***6304",
      ),
    ).toBe("1D3D");
  });
});
