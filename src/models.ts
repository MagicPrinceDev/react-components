import {
  formatDate,
  isAfter,
  isBefore,
  normalizeMinTime,
  timeDifference
} from '@rolster/helpers-date';

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

export class ListFieldCollection<T = unknown> {
  constructor(public readonly value: ListFieldElement<T>[]) {}

  public findElement(value: T): Undefined<ListFieldElement<T>> {
    return this.value.find((element) => element.compareTo(value));
  }
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

    if (maxDate && isBefore(maxDate, minDate)) {
      this.maxDate = normalizeMinTime(maxDate);
    } else {
      this.maxDate = normalizeMinTime(minDate);
    }

    const minFormat = formatDate(this.minDate, FORMAT_DESCRIPTION);
    const maxFormat = formatDate(this.maxDate, FORMAT_DESCRIPTION);

    this.description = `${minFormat} - ${maxFormat}`;
  }

  public recalculate(date: Date): DateRange {
    if (isBefore(this.minDate, date)) {
      return new DateRange(date, this.maxDate);
    }

    if (isAfter(this.maxDate, date)) {
      return new DateRange(this.minDate, date);
    }

    const minDifference = timeDifference(date, this.minDate);
    const maxDifference = timeDifference(this.maxDate, date);

    return minDifference > maxDifference
      ? new DateRange(this.minDate, date)
      : new DateRange(date, this.maxDate);
  }

  public static now(): DateRange {
    return new DateRange(new Date());
  }
}
