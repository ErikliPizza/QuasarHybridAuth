export type MoneyLike = string | number | null | undefined;

type FormatCurrencyOptions = {
  currency?: string;
  locale?: string;
  /** Returned when the value is empty or not a finite number */
  fallback?: string;
};

/**
 * Parses API / form money values into a finite number, or `null` if not usable.
 */
export function parseMoney(value: MoneyLike): number | null {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  const normalized = String(value).replace(/\s/g, '').replace(',', '.');
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

export function formatCurrency(
  value: MoneyLike,
  options: FormatCurrencyOptions = {},
): string {
  const { currency = 'TRY', locale = 'tr-TR', fallback = '-' } = options;
  const amount = parseMoney(value);
  if (amount === null) return fallback;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}
