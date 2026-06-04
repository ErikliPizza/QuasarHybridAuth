export type DateLike = string | number | Date | null | undefined;

export type FormatDateTimeOptions = {
  includeTime?: boolean;
  /** Appends Turkish weekday (e.g. `… 2026 Perşembe`). */
  includeWeekday?: boolean;
};

const MONTH_NAMES_TR = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
];

const WEEKDAY_NAMES_TR = [
  'Pazar',
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
];

export function formatDateTime(
  value: DateLike,
  fallback = '-',
  options: FormatDateTimeOptions = {},
): string {
  if (!value) return fallback;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  const day = date.getDate();
  const month = MONTH_NAMES_TR[date.getMonth()] ?? '';
  const year = date.getFullYear();
  const includeTime = options.includeTime ?? false;
  const includeWeekday = options.includeWeekday ?? false;
  const weekday = includeWeekday ? ` ${WEEKDAY_NAMES_TR[date.getDay()] ?? ''}` : '';

  if (!includeTime) {
    return `${day} ${month}, ${year}${weekday}`;
  }

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day} ${month}, ${year}${weekday}, ${hours}:${minutes}`;
}
