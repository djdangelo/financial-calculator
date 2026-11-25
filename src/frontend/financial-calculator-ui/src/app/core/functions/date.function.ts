import {
  DATE_FORMAT_OPTIONS,
  DATE_PART_LENGTH,
  DATE_PART_PADDING,
  ISO_DATE_LENGTH,
  ISO_DATE_PATTERN,
  ISO_DATE_SEPARATOR
} from '@core/constants/date.constant';

export function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(DATE_PART_LENGTH, DATE_PART_PADDING);
  const day = String(date.getDate()).padStart(DATE_PART_LENGTH, DATE_PART_PADDING);
  return `${date.getFullYear()}-${month}-${day}`;
}

export function formatIsoDate(isoDate: string, language: string): string {
  return new Intl.DateTimeFormat(language, DATE_FORMAT_OPTIONS).format(new Date(isoDate));
}

export function isIsoDate(value: string): boolean {
  return ISO_DATE_PATTERN.test(value) && !Number.isNaN(Date.parse(value));
}

export function addMonthsToIsoDate(isoDate: string, months: number): string {
  const [year, month, day] = isoDate.split(ISO_DATE_SEPARATOR).map(Number);
  const target = new Date(Date.UTC(year, month - 1 + months, 1));
  const lastDayOfMonth = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(day, lastDayOfMonth));
  return target.toISOString().slice(0, ISO_DATE_LENGTH);
}
