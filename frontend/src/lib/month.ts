const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const pad = (value: number) => value.toString().padStart(2, "0");

export function toDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function toMonthKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

export function currentMonth() {
  return toMonthKey(new Date());
}

export function isValidMonth(
  value: string | null | undefined,
): value is string {
  return !!value && MONTH_PATTERN.test(value);
}

export function isValidDateKey(value: string) {
  if (!DATE_PATTERN.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getMonth() === month - 1 && date.getDate() === day;
}

export function parseMonth(month: string) {
  const [year, monthIndex] = month.split("-").map(Number);
  return { year, monthIndex: monthIndex - 1 };
}

export function shiftMonth(month: string, delta: number) {
  const { year, monthIndex } = parseMonth(month);
  return toMonthKey(new Date(year, monthIndex + delta, 1));
}

export function daysInMonth(month: string) {
  const { year, monthIndex } = parseMonth(month);
  return new Date(year, monthIndex + 1, 0).getDate();
}

export function formatMonth(month: string) {
  const { year, monthIndex } = parseMonth(month);
  const label = new Date(year, monthIndex, 1).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatMonthShort(month: string) {
  const { year, monthIndex } = parseMonth(month);
  return new Date(year, monthIndex, 1)
    .toLocaleDateString("pt-BR", { month: "short", year: "2-digit" })
    .replace(". de ", "/")
    .replace(".", "");
}

export function formatDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}
