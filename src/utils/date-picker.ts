import { isAfterDate, isBeforeDate } from '@rolster/typescript-utils';

export function verifyDateRange(date: Date, min?: Date, max?: Date): Date {
  return min && isBeforeDate(min, date)
    ? min
    : max && isAfterDate(max, date)
    ? max
    : date;
}
