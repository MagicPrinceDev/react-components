import {
  getDateFormat,
  getDifference,
  isAfterDate,
  isBeforeDate,
  normalizeMinTime
} from '@rolster/typescript-utils';

const FORMAT_DESCRIPTION = 'dd/mm/aa';

export interface ListFieldElement<T = unknown> {
  description: string;
  title: string;
  value: T;
  code?: string;
  img?: string;
  initials?: string;
  subtitle?: string;

  compareTo(value: T): boolean;

  hasCoincidence(pattern: string): boolean;
}

export interface DayState {
  value?: number;
  disabled: boolean;
  forbidden: boolean;
  selected: boolean;
}

export interface WeekState {
  days: DayState[];
}

export interface DayRangeState {
  value?: number;
  disabled: boolean;
  forbidden: boolean;
  ranged: boolean;
  selected: boolean;
}

export interface WeekRangeState {
  days: DayRangeState[];
}

export interface MonthState {
  value: number;
  label: string;
  disabled: boolean;
  selected: boolean;
}

export interface YearState {
  value?: number;
  disabled: boolean;
  selected: boolean;
}

export class DateRange {
  public readonly description: string;

  public readonly minDate: Date;

  public readonly maxDate: Date;

  constructor(minDate: Date, maxDate?: Date) {
    this.minDate = normalizeMinTime(minDate);

    if (maxDate && isBeforeDate(maxDate, minDate)) {
      this.maxDate = normalizeMinTime(maxDate);
    } else {
      this.maxDate = normalizeMinTime(minDate);
    }

    const minFormat = getDateFormat(this.minDate, FORMAT_DESCRIPTION);
    const maxFormat = getDateFormat(this.maxDate, FORMAT_DESCRIPTION);

    this.description = `${minFormat} - ${maxFormat}`;
  }

  public recalculate(date: Date): DateRange {
    if (isBeforeDate(this.minDate, date)) {
      return new DateRange(date, this.maxDate);
    }

    if (isAfterDate(this.maxDate, date)) {
      return new DateRange(this.minDate, date);
    }

    const minDifference = getDifference(date, this.minDate);
    const maxDifference = getDifference(this.maxDate, date);

    return minDifference > maxDifference
      ? new DateRange(this.minDate, date)
      : new DateRange(date, this.maxDate);
  }

  public static now(): DateRange {
    return new DateRange(new Date());
  }
}
