import { DATE_FORMAT_OPTIONS, DATE_PART_LENGTH, DATE_PART_PADDING } from '@core/constants/date.constant';

export function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(DATE_PART_LENGTH, DATE_PART_PADDING);
  const day = String(date.getDate()).padStart(DATE_PART_LENGTH, DATE_PART_PADDING);
  return `${date.getFullYear()}-${month}-${day}`;
}

export function formatIsoDate(isoDate: string, language: string): string {
  return new Intl.DateTimeFormat(language, DATE_FORMAT_OPTIONS).format(new Date(isoDate));
}
