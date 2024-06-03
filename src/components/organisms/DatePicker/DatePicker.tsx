import { itIsDefined } from '@rolster/helpers-advanced';
import {
  PickerListener,
  PickerListenerType,
  checkDateRange,
  dateOutRange
} from '@rolster/helpers-components';
import {
  assignDayInDate,
  assignMonthInDate,
  assignYearInDate,
  dateFormatTemplate
} from '@rolster/helpers-date';
import { ReactControl, useReactControl } from '@rolster/react-forms';
import { useEffect, useState } from 'react';
import { renderClassStatus } from '../../../helpers';
import reactI18n from '../../../i18n';
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

interface DatePickerProps extends RlsComponent {
  automatic?: boolean;
  date?: Date;
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, Date>;
  maxDate?: Date;
  minDate?: Date;
  onListener?: (listener: PickerListener<Date>) => void;
}

type Visibility = 'DAY' | 'MONTH' | 'YEAR';

export function RlsDatePicker({
  automatic,
  date,
  disabled,
  formControl,
  maxDate,
  minDate,
  onListener,
  rlsTheme
}: DatePickerProps) {
  const today = new Date(); // Initial current date in component

  const dateInitial = formControl?.state || date || today;

  const yearControl = useReactControl(dateInitial.getFullYear());
  const dayControl = useReactControl(dateInitial.getDate());
  const monthControl = useReactControl(dateInitial.getMonth());

  const [value, setValue] = useState(dateInitial);
  const [visibility, setVisibility] = useState<Visibility>('DAY');

  useEffect(() => {
    const dateCheck = checkDateRange({
      date: formControl?.state || date || today,
      minDate,
      maxDate
    });

    setValue(dateCheck);
    formControl?.setState(dateCheck);
  }, []);

  useEffect(() => {
    setValue((prevValue) =>
      itIsDefined(yearControl.state)
        ? assignYearInDate(prevValue, yearControl.state)
        : prevValue
    );
  }, [yearControl.state]);

  useEffect(() => {
    setValue((prevValue) =>
      itIsDefined(monthControl.state)
        ? assignMonthInDate(prevValue, monthControl.state)
        : prevValue
    );
  }, [monthControl.state]);

  useEffect(() => {
    setValue((prevValue) =>
      itIsDefined(dayControl.state)
        ? assignDayInDate(prevValue, dayControl.state)
        : prevValue
    );
  }, [dayControl.state]);

  function onVisibilityDay(): void {
    setVisibility('DAY');
  }

  function onVisibilityMonth(): void {
    setVisibility('MONTH');
  }

  function onVisibilityYear(): void {
    setVisibility('YEAR');
  }

  function onCancel(): void {
    if (onListener) {
      onListener({ type: PickerListenerType.Cancel });
    }
  }

  function onToday(): void {
    yearControl.setState(today.getFullYear());
    dayControl.setState(today.getDate());
    monthControl.setState(today.getMonth());
    formControl?.setState(today);

    if (onListener) {
      onListener({ type: PickerListenerType.Now, value: today });
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
          <span onClick={onVisibilityDay}>
            {dateFormatTemplate(dateInitial, FORMAT_DESCRIPTION)}
          </span>
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
          disabled={visibility === 'YEAR'}
          type={'month'}
          onClick={onVisibilityMonth}
        />
      </div>

      <div
        className={renderClassStatus('rls-date-picker__component', {
          day: visibility === 'DAY',
          month: visibility === 'MONTH',
          year: visibility === 'YEAR'
        })}
      >
        <RlsDayPicker
          formControl={dayControl}
          date={dateInitial}
          month={monthControl.state}
          year={yearControl.state}
          maxDate={maxDate}
          minDate={minDate}
          disabled={disabled}
        />

        <RlsMonthPicker
          formControl={monthControl}
          date={dateInitial}
          year={yearControl.state}
          maxDate={maxDate}
          minDate={minDate}
          disabled={disabled}
          onValue={onVisibilityDay}
        />

        <RlsYearPicker
          formControl={yearControl}
          date={dateInitial}
          maxDate={maxDate}
          minDate={minDate}
          disabled={disabled}
          onValue={onVisibilityDay}
        />
      </div>

      <div
        className={renderClassStatus('rls-date-picker__footer', { automatic })}
      >
        <div className="rls-date-picker__actions">
          <div className="rls-date-picker__actions--cancel">
            <RlsButton type="ghost" onClick={onCancel}>
              {reactI18n('dateActionCancel')}
            </RlsButton>
          </div>

          <div className="rls-date-picker__actions--today">
            <RlsButton
              type="ghost"
              onClick={onToday}
              disabled={dateOutRange({ date: today, maxDate, minDate })}
            >
              {reactI18n('dateActionToday')}
            </RlsButton>
          </div>

          <div className="rls-date-picker__actions--ok">
            <RlsButton type="raised" onClick={onSelect}>
              {reactI18n('dateActionSelect')}
            </RlsButton>
          </div>
        </div>
      </div>
    </div>
  );
}
