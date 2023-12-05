import {
  formatDate,
  refactorDay,
  refactorMonth,
  refactorYear
} from '@rolster/helpers-date';
import { ReactControl, useReactControl } from '@rolster/react-forms';
import { useEffect, useState } from 'react';
import { PickerListener, PickerListenerType } from '../../../types';
import { renderClassStatus } from '../../../utils/css';
import { verifyDateRange } from '../../../utils/date-picker';
import { RlsButton } from '../../atoms';
import { RlsComponent } from '../../definitions';
import {
  RlsDayPicker,
  RlsMonthPicker,
  RlsMonthTitlePicker,
  RlsYearPicker
} from '../../molecules';
import './DatePicker.css';

const FORMAT_DESCRIPTION = '{dw}, {mx} {dd} de {aa}';

interface DatePicker extends RlsComponent {
  automatic?: boolean;
  date?: Date;
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, Date>;
  maxDate?: Date;
  minDate?: Date;
  onListener?: (listener: PickerListener<Date>) => void;
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

export function RlsDatePicker({
  automatic,
  date,
  formControl,
  disabled,
  maxDate,
  minDate,
  onListener,
  rlsTheme
}: DatePicker) {
  const dateInitial = formControl?.state || date || new Date();

  const yearControl = useReactControl({ state: dateInitial.getFullYear() });
  const dayControl = useReactControl({ state: dateInitial.getDate() });
  const monthControl = useReactControl({ state: dateInitial.getMonth() });

  const [value, setValue] = useState(dateInitial);
  const [{ day, month, year }, setVisibility] = useState(VISIBILITY.DAY);

  const title = formatDate(value, FORMAT_DESCRIPTION);

  useEffect(() => {
    setValue((prevValue) => {
      return typeof yearControl.state === 'number'
        ? verifyDateRange(
            refactorYear(prevValue, yearControl.state),
            minDate,
            maxDate
          )
        : prevValue;
    });

    setVisibility(VISIBILITY.DAY);
  }, [yearControl.state]);

  useEffect(() => {
    setValue((prevValue) => {
      return typeof monthControl.state === 'number'
        ? verifyDateRange(
            refactorMonth(prevValue, monthControl.state),
            minDate,
            maxDate
          )
        : prevValue;
    });

    setVisibility(VISIBILITY.DAY);
  }, [monthControl.state]);

  useEffect(() => {
    setValue((prevValue) => {
      return typeof dayControl.state === 'number'
        ? verifyDateRange(
            refactorDay(prevValue, dayControl.state),
            minDate,
            maxDate
          )
        : prevValue;
    });
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

  function onToday(): void {
    const value = new Date(); // Today date

    formControl?.setState(value);
    setValue(value);
    yearControl.setState(value.getFullYear());
    dayControl.setState(value.getDate());
    monthControl.setState(value.getMonth());

    if (onListener) {
      onListener({ type: PickerListenerType.Now, value });
    }
  }

  function onSelect(): void {
    formControl?.setState(value);

    if (onListener) {
      onListener({ type: PickerListenerType.Select, value });
    }
  }

  return (
    <div className="rls-date-picker" rls-theme={rlsTheme}>
      <div className="rls-date-picker__header">
        <div className="rls-date-picker__title rls-date-picker__title--description">
          <span onClick={onVisibilityDay}>{title}</span>
        </div>

        <div className="rls-date-picker__title rls-date-picker__title--year">
          <span onClick={onVisibilityYear}>{yearControl.value}</span>
        </div>

        <RlsMonthTitlePicker
          monthControl={monthControl}
          yearControl={yearControl}
          date={value}
          maxDate={maxDate}
          minDate={minDate}
          onClick={onVisibilityMonth}
        />
      </div>

      <div
        className={renderClassStatus('rls-date-picker__component', {
          year,
          day,
          month
        })}
      >
        <RlsDayPicker
          formControl={dayControl}
          date={value}
          maxDate={maxDate}
          minDate={minDate}
          disabled={disabled}
        />

        <RlsMonthPicker
          formControl={monthControl}
          date={value}
          maxDate={maxDate}
          minDate={minDate}
          disabled={disabled}
        />

        <RlsYearPicker
          formControl={yearControl}
          date={value}
          maxDate={maxDate}
          minDate={minDate}
          disabled={disabled}
        />
      </div>

      <div
        className={renderClassStatus('rls-date-picker__footer', { automatic })}
      >
        <div className="rls-date-picker__actions">
          <div className="rls-date-picker__actions--cancel">
            <RlsButton type="ghost" onClick={onCancel}>
              Cancelar
            </RlsButton>
          </div>

          <div className="rls-date-picker__actions--today">
            <RlsButton type="ghost" onClick={onToday}>
              Hoy
            </RlsButton>
          </div>

          <div className="rls-date-picker__actions--ok">
            <RlsButton type="raised" onClick={onSelect}>
              Establecer
            </RlsButton>
          </div>
        </div>
      </div>
    </div>
  );
}
