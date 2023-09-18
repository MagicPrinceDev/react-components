import { fetchMonthDays, refactorDay, weight } from '@rolster/helpers-date';
import { DayState, WeekState } from '../models';

interface Props {
  value: number;
  date: Date;
  minDate?: Date;
  maxDate?: Date;
}

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

    this.date.setDate(1);
  }

  public static execute(props: Props): WeekState[] {
    const factory = new Factory(props);

    const firstWeek = factory.createFirstWeek();
    const rightWeeks = factory.createRightWeeks();

    return [firstWeek, ...rightWeeks];
  }

  public createFirstWeek(): WeekState {
    const dayStart = this.date.getDay();
    const days: DayState[] = [];

    let day = 1;

    for (let start = 0; start < dayStart; start++) {
      days.push(this.createDayState());
    }

    for (let end = dayStart; end < 7; end++) {
      days.push(this.createDayState(day));

      day++;
    }

    return { days };
  }

  public createRightWeeks(): WeekState[] {
    const dayStart = this.date.getDay();
    const rightWeeks: WeekState[] = [];

    const dayCount = fetchMonthDays(
      this.date.getFullYear(),
      this.date.getMonth()
    );

    let days: DayState[] = [];
    let countDaysWeek = 1;
    let day = 8 - dayStart;

    do {
      days.push(this.createDayState(day));

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

  private createDaysPending(daysWeek: number): DayState[] {
    const daysPending: DayState[] = [];
    const length = 7 - daysWeek;

    for (let index = 0; index < length; index++) {
      daysPending.push(this.createDayState());
    }

    return daysPending;
  }

  private createDayState(value?: number): DayState {
    return {
      disabled: this.overflowDay(value || 0),
      forbidden: !value,
      selected: value === this.value,
      value
    };
  }

  private overflowDay(day: number): boolean {
    return this.minOverflowDay(day) || this.maxOverflowDay(day);
  }

  private minOverflowDay(day: number): boolean {
    return this.minDate
      ? weight(refactorDay(this.date, day)) < weight(this.minDate)
      : false;
  }

  private maxOverflowDay(day: number): boolean {
    return this.maxDate
      ? weight(refactorDay(this.date, day)) > weight(this.maxDate)
      : false;
  }
}

export function createDayPicker(props: Props): WeekState[] {
  return Factory.execute(props);
}
