import {
  changeDay,
  getDateWeight,
  getDaysMonth,
  isBetweenDate
} from '@rolster/typescript-utils';
import { DateRange, DayRangeState, WeekRangeState } from '../models';

interface Props {
  date: Date;
  range: DateRange;
  minDate?: Date;
  maxDate?: Date;
}

class Factory {
  private range: DateRange;

  private date: Date;

  private minDate?: Date;

  private maxDate?: Date;

  protected constructor(props: Props) {
    const { date, range, maxDate, minDate } = props;

    this.date = new Date(date.getTime());
    this.range = range;
    this.maxDate = maxDate;
    this.minDate = minDate;

    this.date.setDate(1);
  }

  public static execute(props: Props): WeekRangeState[] {
    const factory = new Factory(props);

    const firstWeek = factory.createFirstWeek();
    const rightWeeks = factory.createRightWeeks();

    return [firstWeek, ...rightWeeks];
  }

  public createFirstWeek(): WeekRangeState {
    const dayStart = this.date.getDay();
    const days: DayRangeState[] = [];

    let day = 1;

    for (let start = 0; start < dayStart; start++) {
      days.push(this.createDayRangeState());
    }

    for (let end = dayStart; end < 7; end++) {
      days.push(this.createDayRangeState(day));

      day++;
    }

    return { days };
  }

  public createRightWeeks(): WeekRangeState[] {
    const rightWeeks: WeekRangeState[] = [];
    const dayStart = this.date.getDay();

    const dayCount = getDaysMonth(
      this.date.getFullYear(),
      this.date.getMonth()
    );

    let days: DayRangeState[] = [];
    let countDaysWeek = 1;
    let day = 8 - dayStart;

    do {
      days.push(this.createDayRangeState(day));

      day++;
      countDaysWeek++;

      if (countDaysWeek > 7) {
        rightWeeks.push({ days });

        days = [];
        countDaysWeek = 1;
      }
    } while (day <= dayCount);

    const daysPending = this.createDaysPending(days.length);

    rightWeeks.push({ days: [...days, ...daysPending] });

    return rightWeeks;
  }

  private createDaysPending(daysWeek: number): DayRangeState[] {
    const daysPending: DayRangeState[] = [];
    const length = 7 - daysWeek;

    for (let index = 0; index < length; index++) {
      daysPending.push(this.createDayRangeState());
    }

    return daysPending;
  }

  private createDayRangeState(day?: number): DayRangeState {
    return {
      value: day,
      disabled: this.overflowDay(day || 0),
      forbidden: !day,
      ranged: day ? this.isRangedFromDate(day) : false,
      selected: day ? this.isSelected(day) : false
    };
  }

  private isSelected(day: number): boolean {
    return (
      this.isSelectedForDate(this.range.minDate, day) ||
      this.isSelectedForDate(this.range.maxDate, day)
    );
  }

  private isSelectedForDate(date: Date, day: number): boolean {
    return (
      date.getFullYear() === this.date.getFullYear() &&
      date.getMonth() === this.date.getMonth() &&
      day === date.getDate()
    );
  }

  private isRangedFromDate(day: number): boolean {
    return isBetweenDate(
      this.range.minDate,
      this.range.maxDate,
      changeDay(this.date, day)
    );
  }

  private overflowDay(day: number): boolean {
    return this.minOverflowDay(day) || this.maxOverflowDay(day);
  }

  private minOverflowDay(day: number): boolean {
    return this.minDate
      ? getDateWeight(changeDay(this.date, day)) < getDateWeight(this.minDate)
      : false;
  }

  private maxOverflowDay(day: number): boolean {
    return this.maxDate
      ? getDateWeight(changeDay(this.date, day)) > getDateWeight(this.maxDate)
      : false;
  }
}

export function createRangePicker(props: Props): WeekRangeState[] {
  return Factory.execute(props);
}
