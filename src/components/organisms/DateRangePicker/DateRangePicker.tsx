import {
  changeMonth,
  changeYear,
  normalizeMinTime
} from '@rolster/typescript-utils';
import { useEffect, useState } from 'react';
import { ReactControl, useFormControl } from '../../../hooks';
import { DateRange } from '../../../models';
import { renderClassStatus } from '../../../utils/css';
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

interface DateRangePicker extends RlsComponent {
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
}: DateRangePicker) {
  const dateInitial = normalizeMinTime(datePicker || new Date());
  const rangeInitial = formControl?.state || DateRange.now();

  const yearControl = useFormControl({ state: dateInitial.getFullYear() });
  const monthControl = useFormControl({ state: dateInitial.getMonth() });
  const dayControl = useFormControl({ state: rangeInitial });

  const [value, setValue] = useState(rangeInitial);
  const [date, setDate] = useState(dateInitial);
  const [{ day, month, year }, setVisibility] = useState(VISIBILITY.DAY);

  useEffect(() => {
    setDate((prevValue) => {
      return typeof yearControl.value === 'number'
        ? changeYear(prevValue, yearControl.value)
        : prevValue;
    });

    setVisibility(VISIBILITY.DAY);
  }, [yearControl.value]);

  useEffect(() => {
    setDate((prevValue) => {
      return typeof monthControl.value === 'number'
        ? changeMonth(prevValue, monthControl.value)
        : prevValue;
    });

    setVisibility(VISIBILITY.DAY);
  }, [monthControl.value]);

  useEffect(() => {
    if (dayControl.value) {
      setValue(dayControl.value);
    }

    setVisibility(VISIBILITY.DAY);
  }, [dayControl.value]);

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
          <span onClick={onVisibilityDay}>{value.description}</span>
        </div>

        <div className="rls-date-range-picker__title rls-date-range-picker__title--year">
          <span onClick={onVisibilityYear}>{yearControl.value}</span>
        </div>

        <RlsMonthTitlePicker
          monthControl={monthControl}
          yearControl={yearControl}
          date={date}
          maxDate={maxDate}
          minDate={minDate}
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
        />

        <RlsYearPicker
          formControl={yearControl}
          date={date}
          maxDate={maxDate}
          minDate={minDate}
          disabled={disabled}
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
              Cancelar
            </RlsButton>
          </div>

          <div className="rls-date-range-picker__actions--ok">
            <RlsButton type="raised" onClick={onSelect}>
              Establecer
            </RlsButton>
          </div>
        </div>
      </div>
    </div>
  );
}