import {
  DateRange,
  assignMonth,
  assignYear,
  normalizeMinTime
} from '@rolster/helpers-date';
import { ReactControl, useReactControl } from '@rolster/react-forms';
import { useEffect, useState } from 'react';
import reactI18n from '../../../i18n';
import { renderClassStatus } from '../../../helpers/css';
import { formatRange } from '../../../helpers/date-range-picker';
import { PickerListener, PickerListenerType } from '../../../types';
import { RlsButton } from '../../atoms';
import { RlsComponent } from '../../definitions';
import {
  RlsDayRangePicker,
  RlsMonthPicker,
  RlsMonthTitlePicker,
  RlsYearPicker
} from '../../molecules';
import './DateRangePicker.css';

interface DateRangePickerProps extends RlsComponent {
  automatic?: boolean;
  date?: Date;
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, DateRange>;
  maxDate?: Date;
  minDate?: Date;
  onListener?: (listener: PickerListener<DateRange>) => void;
}

interface VisibilityState {
  month: boolean;
  day: boolean;
  year: boolean;
}

const VISIBILITY_STATE: VisibilityState = {
  month: false,
  day: false,
  year: false
};

type Visibility = Record<'DAY' | 'MONTH' | 'YEAR', VisibilityState>;

const VISIBILITY: Visibility = {
  DAY: {
    ...VISIBILITY_STATE,
    day: true
  },
  MONTH: {
    ...VISIBILITY_STATE,
    month: true
  },
  YEAR: {
    ...VISIBILITY_STATE,
    year: true
  }
};

export function RlsDateRangePicker({
  automatic,
  date: datePicker,
  disabled,
  formControl,
  maxDate,
  minDate,
  rlsTheme,
  onListener
}: DateRangePickerProps) {
  const dateInitial = normalizeMinTime(datePicker || new Date());
  const rangeInitial = formControl?.state || DateRange.now();

  const yearControl = useReactControl({ state: dateInitial.getFullYear() });
  const monthControl = useReactControl({ state: dateInitial.getMonth() });
  const dayControl = useReactControl({ state: rangeInitial });

  const [value, setValue] = useState(rangeInitial);
  const [date, setDate] = useState(dateInitial);
  const [{ day, month, year }, setVisibility] = useState(VISIBILITY.DAY);

  useEffect(() => {
    setDate((prevValue) => {
      return typeof yearControl.state === 'number'
        ? assignYear(prevValue, yearControl.state)
        : prevValue;
    });
  }, [yearControl.state]);

  useEffect(() => {
    setDate((prevValue) => {
      return typeof monthControl.state === 'number'
        ? assignMonth(prevValue, monthControl.state)
        : prevValue;
    });
  }, [monthControl.state]);

  useEffect(() => {
    if (dayControl.state) {
      setValue(dayControl.state);
    }

    setVisibility(VISIBILITY.DAY);
  }, [dayControl.state]);

  function onVisibilityDay(): void {
    setVisibility(VISIBILITY.DAY);
  }

  function onVisibilityMonth(): void {
    setVisibility(VISIBILITY.MONTH);
  }

  function onVisibilityYear(): void {
    setVisibility(VISIBILITY.YEAR);
  }

  function onCancel(): void {
    if (onListener) {
      onListener({ type: PickerListenerType.Cancel });
    }
  }

  function onSelect(): void {
    formControl?.setState(value);

    if (onListener) {
      onListener({ type: PickerListenerType.Select, value });
    }
  }

  return (
    <div className="rls-date-range-picker" rls-theme={rlsTheme}>
      <div className="rls-date-range-picker__header">
        <div className="rls-date-range-picker__title rls-date-range-picker__title--description">
          <span onClick={onVisibilityDay}>{formatRange(value)}</span>
        </div>

        <div className="rls-date-range-picker__title rls-date-range-picker__title--year">
          <span onClick={onVisibilityYear}>{yearControl.state}</span>
        </div>

        <RlsMonthTitlePicker
          monthControl={monthControl}
          yearControl={yearControl}
          date={date}
          maxDate={maxDate}
          minDate={minDate}
          disabled={year}
          type={month ? 'year' : 'month'}
          onClick={onVisibilityMonth}
        />
      </div>

      <div
        className={renderClassStatus('rls-date-range-picker__component', {
          year,
          day,
          month
        })}
      >
        <RlsDayRangePicker
          formControl={dayControl}
          date={date}
          maxDate={maxDate}
          minDate={minDate}
          disabled={disabled}
        />

        <RlsMonthPicker
          formControl={monthControl}
          date={date}
          maxDate={maxDate}
          minDate={minDate}
          disabled={disabled}
          onValue={onVisibilityDay}
        />

        <RlsYearPicker
          formControl={yearControl}
          date={date}
          maxDate={maxDate}
          minDate={minDate}
          disabled={disabled}
          onValue={onVisibilityDay}
        />
      </div>

      <div
        className={renderClassStatus('rls-date-range-picker__footer', {
          automatic
        })}
      >
        <div className="rls-date-range-picker__actions">
          <div className="rls-date-range-picker__actions--cancel">
            <RlsButton type="ghost" onClick={onCancel}>
              {reactI18n('dateActionCancel')}
            </RlsButton>
          </div>

          <div className="rls-date-range-picker__actions--ok">
            <RlsButton type="raised" onClick={onSelect}>
              {reactI18n('dateActionSelect')}
            </RlsButton>
          </div>
        </div>
      </div>
    </div>
  );
}
