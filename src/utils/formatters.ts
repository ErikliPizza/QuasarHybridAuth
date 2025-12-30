import type { Gender } from 'src/types/profile';

/**
 * Formats a date string to a readable format
 *
 * @param date - Date string in Y-m-d or ISO format, or null
 * @returns Formatted date string or '—' if null
 */
export function formatDate(date: string | null): string {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-EN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formats a gender value to a capitalized string
 *
 * @param gender - Gender value or null
 * @returns Capitalized gender string or '—' if null
 */
export function formatGender(gender: Gender | null): string {
  if (!gender) return '—';
  return gender.charAt(0).toUpperCase() + gender.slice(1);
}


/**
 * Formats a boolean value to a readable string
 *
 * @param value - Boolean value or null
 * @returns 'Yes', 'No', or '—' if null
 */
export function formatBoolean(value: boolean | null): string {
  if (value === null) return '—';
  return value ? 'Yes' : 'No';
}
