import { after, before } from '@rolster/helpers-date';

export function verifyDateRange(date: Date, min?: Date, max?: Date): Date {
  return min && before(min, date) ? min : max && after(max, date) ? max : date;
}
