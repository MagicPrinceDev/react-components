import { MONTH_NAMES, Month } from '@rolster/helpers-date';
import { MonthState } from '../models';

interface FactoryProps {
  value: number;
  date: Date;
  minDate?: Date;
  maxDate?: Date;
}

export const MONTH_MAX_VALUE = Month.December;
export const MONTH_MIN_VALUE = Month.January;

class MonthPickerFactory {
  private value: number;

  private date: Date;

  private minDate?: Date;

  private maxDate?: Date;

  protected constructor(props: FactoryProps) {
    const { date, value, maxDate, minDate } = props;
    this.value = value;
    this.date = new Date(date.getTime());
    this.maxDate = maxDate;
    this.minDate = minDate;
  }

  public static execute(props: FactoryProps): MonthState[] {
    const factory = new MonthPickerFactory(props);

    return [
      factory.createMonth(Month.January),
      factory.createMonth(Month.February),
      factory.createMonth(Month.March),
      factory.createMonth(Month.April),
      factory.createMonth(Month.May),
      factory.createMonth(Month.June),
      factory.createMonth(Month.July),
      factory.createMonth(Month.August),
      factory.createMonth(Month.September),
      factory.createMonth(Month.October),
      factory.createMonth(Month.November),
      factory.createMonth(Month.December)
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

export function createMonthPicker(props: FactoryProps): MonthState[] {
  return MonthPickerFactory.execute(props);
}
