import { DateRange, dateFormatTemplate } from '@rolster/helpers-date';
import { DATE_RANGE_FORMAT } from '../constants';

export function rangeFormatTemplate({ maxDate, minDate }: DateRange): string {
  const minFormat = dateFormatTemplate(minDate, DATE_RANGE_FORMAT);
  const maxFormat = dateFormatTemplate(maxDate, DATE_RANGE_FORMAT);

  return `${minFormat} - ${maxFormat}`;
}
