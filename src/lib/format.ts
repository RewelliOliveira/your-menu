const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

const compactCurrencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatCompactCurrency(value: number) {
  return compactCurrencyFormatter.format(value);
}

export function formatPercent(value: number, fractionDigits = 1) {
  return `${(value * 100).toLocaleString("pt-BR", { maximumFractionDigits: fractionDigits })}%`;
}

export function maskCurrency(raw: string) {
  const digits = raw
    .replace(/\D/g, "")
    .replace(/^0+(?=\d)/, "")
    .slice(0, 9);
  if (!digits) return "";
  const cents = digits.padStart(3, "0");
  const integer = Number(cents.slice(0, -2)).toLocaleString("pt-BR");
  return `${integer},${cents.slice(-2)}`;
}

export function parseCurrency(masked: string) {
  const value = Number(masked.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(value) ? value : 0;
}

export function toCurrencyMask(value: number) {
  return maskCurrency(Math.round(value * 100).toString());
}

export function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function maskPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return digits.replace(/^(\d{2})(\d+)/, "($1) $2");
  if (digits.length <= 10)
    return digits.replace(/^(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
  return digits.replace(/^(\d{2})(\d{5})(\d+)/, "($1) $2-$3");
}

export function maskCep(value: string) {
  return onlyDigits(value)
    .slice(0, 8)
    .replace(/^(\d{5})(\d)/, "$1-$2");
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const relativeFormatter = new Intl.RelativeTimeFormat("pt-BR", {
  numeric: "auto",
});

export function formatRelative(iso: string, now = Date.now()) {
  const minutes = Math.round((new Date(iso).getTime() - now) / 60_000);
  if (Math.abs(minutes) < 1) return "agora";
  if (Math.abs(minutes) < 60)
    return relativeFormatter.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return relativeFormatter.format(hours, "hour");
  return relativeFormatter.format(Math.round(hours / 24), "day");
}

export function isSameDay(iso: string, reference = new Date()) {
  return new Date(iso).toDateString() === reference.toDateString();
}

export function pluralize(
  count: number,
  singular: string,
  plural = `${singular}s`,
) {
  return `${count} ${count === 1 ? singular : plural}`;
}
