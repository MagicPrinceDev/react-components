import { isAfter, isBefore } from '@rolster/helpers-date';

export function verifyDateRange(date: Date, min?: Date, max?: Date): Date {
  return min && isBefore(min, date)
    ? min
    : max && isAfter(max, date)
    ? max
    : date;
}
