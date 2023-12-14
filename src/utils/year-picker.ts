import { YearState } from '../models';

export const COUNT_YEAR_RANGE = 4;

interface FactoryProps {
  value: number;
  year: number;
  minDate?: Date;
  maxDate?: Date;
}

interface YearPickerTemplate {
  hasNext: boolean;
  hasPrevious: boolean;
  maxRange: number;
  minRange: number;
  years: YearState[];
}

class YearPickerFactory {
  private minDate?: Date;

  private maxDate?: Date;

  private value: number;

  private declare minYearRange: number;

  private declare maxYearRange: number;

  protected constructor(props: FactoryProps) {
    const { value, maxDate, minDate } = props;
    this.value = value;
    this.maxDate = maxDate;
    this.minDate = minDate;
  }

  public static execute(props: FactoryProps): YearPickerTemplate {
    const factory = new YearPickerFactory(props);

    let year = props.year;

    if (factory.minOverflowYear(year)) {
      year = factory.minYear;
    } else if (factory.maxOverflowYear(year)) {
      year = factory.maxYear;
    }

    const years = factory.createYears(year);

    return {
      hasNext: factory.hasNext,
      hasPrevious: factory.hasPrevious,
      maxRange: factory.maxYearRange,
      minRange: factory.minYearRange,
      years
    };
  }

  private createYears(year: number): YearState[] {
    const prevYears: YearState[] = [];
    const nextYears: YearState[] = [];

    this.minYearRange = year;
    this.maxYearRange = year;

    for (let index = 0; index < COUNT_YEAR_RANGE; index++) {
      const yearPrev = year - COUNT_YEAR_RANGE + index;
      const yearNext = year + index + 1;

      const valuePrev = yearPrev >= this.minYear ? yearPrev : undefined;
      const valueNext = yearNext <= this.maxYear ? yearNext : undefined;

      const prevState = this.createYear(valuePrev);
      const nextState = this.createYear(valueNext);

      prevYears.push(prevState);
      nextYears.push(nextState);

      this.recalculateRange(prevState, nextState);
    }

    const yearCenter = this.createYear(year);

    return [...prevYears, yearCenter, ...nextYears];
  }

  private minOverflowYear(year: number): boolean {
    return year < this.minYear;
  }

  private maxOverflowYear(year: number): boolean {
    return year > this.maxYear;
  }

  private get minYear(): number {
    return this.minDate?.getFullYear() || 0;
  }

  private get maxYear(): number {
    return this.maxDate?.getFullYear() || 10000;
  }

  private get hasPrevious(): boolean {
    return this.minYear < this.minYearRange;
  }

  private get hasNext(): boolean {
    return this.maxYear > this.maxYearRange;
  }

  private createYear(value?: number): YearState {
    return {
      value,
      disabled: !value,
      selected: value === this.value
    };
  }

  private recalculateRange(prev: YearState, next: YearState): void {
    if (!!prev.value && this.minYearRange > prev.value) {
      this.minYearRange = prev.value;
    }

    if (!!next.value && this.maxYearRange < next.value) {
      this.maxYearRange = next.value;
    }
  }
}

export function createYearPicker(props: FactoryProps): YearPickerTemplate {
  return YearPickerFactory.execute(props);
}
