import type { BusinessHours } from "../types/restaurant";

export const WEEKDAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"] as const;

export type Weekday = (typeof WEEKDAYS)[number];

export const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

const MINUTES_IN_DAY = 24 * 60;

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function openWindows(day: BusinessHours | undefined, dayOffset: number) {
  if (!day?.isOpen) return [];
  const opening = toMinutes(day.openingTime) + dayOffset;
  let closing = toMinutes(day.closingTime) + dayOffset;
  if (closing <= opening) closing += MINUTES_IN_DAY;
  return [[opening, closing]];
}

export function isWithinBusinessHours(hours: BusinessHours[], date = new Date()) {
  const weekday = date.getDay();
  const findDay = (index: number) => hours.find((day) => day.weekday === WEEKDAYS[(index + 7) % 7]);
  const minute = date.getHours() * 60 + date.getMinutes();
  const windows = [...openWindows(findDay(weekday - 1), -MINUTES_IN_DAY), ...openWindows(findDay(weekday), 0)];
  return windows.some(([opening, closing]) => minute >= opening && minute < closing);
}

export function isAcceptingOrders(restaurant: { isOpen: boolean }, hours: BusinessHours[], date = new Date()) {
  return restaurant.isOpen && isWithinBusinessHours(hours, date);
}
