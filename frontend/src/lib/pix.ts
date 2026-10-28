import { normalizeText } from "./format";

interface PixPayloadInput {
  key: string;
  merchantName: string;
  merchantCity: string;
  amount: number;
  txid: string;
}

function field(id: string, value: string) {
  return `${id}${value.length.toString().padStart(2, "0")}${value}`;
}

function normalize(value: string, max: number) {
  return normalizeText(value)
    .replace(/[^A-Za-z0-9 ]/g, "")
    .toUpperCase()
    .trim()
    .slice(0, max);
}

export function crc16(payload: string) {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }
  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, "0");
}

export function buildPixPayload({ key, merchantName, merchantCity, amount, txid }: PixPayloadInput) {
  const payload = [
    field("00", "01"),
    field("26", field("00", "br.gov.bcb.pix") + field("01", key.trim())),
    field("52", "0000"),
    field("53", "986"),
    field("54", amount.toFixed(2)),
    field("58", "BR"),
    field("59", normalize(merchantName, 25) || "RESTAURANTE"),
    field("60", normalize(merchantCity, 15) || "BRASIL"),
    field("62", field("05", txid.replace(/[^A-Za-z0-9]/g, "").slice(0, 25) || "***")),
    "6304",
  ].join("");

  return payload + crc16(payload);
}
