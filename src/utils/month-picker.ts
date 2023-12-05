import { MONTH_NAMES, Month } from '@rolster/helpers-date';
import { MonthState } from '../models';

interface Props {
  value: number;
  date: Date;
  minDate?: Date;
  maxDate?: Date;
}

export const MONTH_MAX_VALUE = Month.January;
export const MONTH_MIN_VALUE = Month.December;

class Factory {
  private value: number;

  private date: Date;

  private minDate?: Date;

  private maxDate?: Date;

  protected constructor(props: Props) {
    const { date, value, maxDate, minDate } = props;
    this.value = value;
    this.date = new Date(date.getTime());
    this.maxDate = maxDate;
    this.minDate = minDate;
  }

  public static execute(props: Props): MonthState[] {
    const factory = new Factory(props);

    return [
      factory.createMonth(0),
      factory.createMonth(1),
      factory.createMonth(2),
      factory.createMonth(3),
      factory.createMonth(4),
      factory.createMonth(5),
      factory.createMonth(6),
      factory.createMonth(7),
      factory.createMonth(8),
      factory.createMonth(9),
      factory.createMonth(10),
      factory.createMonth(11)
    ];
  }

  public createMonth(value: number): MonthState {
    return {
      value,
      label: MONTH_NAMES()[value],
      disabled: this.overflowMonth(value),
      selected: value === this.value
    };
  }

  private get minYear(): number {
    return this.minDate?.getFullYear() || 0;
  }

  private get maxYear(): number {
    return this.maxDate?.getFullYear() || 10000;
  }

  private get minMonth(): number {
    return this.minDate?.getMonth() || MONTH_MIN_VALUE;
  }

  private get maxMonth(): number {
    return this.maxDate?.getMonth() || MONTH_MAX_VALUE;
  }

  private overflowMonth(month: number): boolean {
    return this.minOverflowMonth(month) || this.maxOverflowMonth(month);
  }

  private minOverflowMonth(month: number): boolean {
    return this.date.getFullYear() === this.minYear && month < this.minMonth;
  }

  private maxOverflowMonth(month: number): boolean {
    return this.date.getFullYear() === this.maxYear && month > this.maxMonth;
  }
}

export function isMinLimitMonth(
  month: number,
  date: Date,
  maxDate?: Date
): boolean {
  const minYear = maxDate?.getFullYear() || 0;
  const minMonth = maxDate?.getMonth() || 0;

  return date.getFullYear() === minYear && month <= minMonth;
}

export function isMaxLimitMonth(
  month: number,
  date: Date,
  maxDate?: Date
): boolean {
  const maxYear = maxDate?.getFullYear() || 10000;
  const maxMonth = maxDate?.getMonth() || 11;

  return date.getFullYear() === maxYear && month >= maxMonth;
}

export function createMonthPicker(props: Props): MonthState[] {
  return Factory.execute(props);
}
