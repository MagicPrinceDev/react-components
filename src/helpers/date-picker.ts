import { dateIsAfter, dateIsBefore } from '@rolster/helpers-date';

export function dateIsRange(date: Date, min?: Date, max?: Date): Date {
  return min && dateIsBefore(min, date)
    ? min
    : max && dateIsAfter(max, date)
    ? max
    : date;
}
