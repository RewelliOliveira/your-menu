export const toCents = (value: number) => Math.round(value * 100);

export const fromCents = (cents: number) => Number(cents) / 100;

export const roundMoney = (value: number) => Math.round(value * 100) / 100;
