import { itIsDefined } from '@rolster/helpers-advanced';
import {
  WeekState,
  checkDayPicker,
  createDayPicker
} from '@rolster/helpers-components';
import { DAY_LABELS } from '@rolster/helpers-date';
import { ReactControl } from '@rolster/react-forms';
import { useEffect, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import './DayPicker.css';

interface DayPickerProps extends RlsComponent {
  date?: Date;
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, number>;
  maxDate?: Date;
  month?: Nulleable<number>;
  minDate?: Date;
  onValue?: (value: number) => void;
  year?: Nulleable<number>;
}

export function RlsDayPicker({
  date,
  disabled: disabledPicker,
  formControl,
  maxDate,
  month,
  minDate,
  onValue,
  rlsTheme,
  year
}: DayPickerProps) {
  const currentDate = date || new Date(); // Initial date

  const [weeks, setWeeks] = useState<WeekState[]>([]);
  const [value, setValue] = useState(
    formControl?.state || currentDate.getDate()
  );

  useEffect(() => {
    const props = {
      date: currentDate,
      month: itIsDefined(month) ? month : currentDate.getMonth(),
      year: year || currentDate.getFullYear(),
      day: formControl?.state || value,
      minDate,
      maxDate
    };

    const day = checkDayPicker(props);

    day ? setDayValue(day) : setWeeks(createDayPicker(props));
  }, [month, year, value, minDate, maxDate]);

  useEffect(() => {
    const day = checkDayPicker({
      date: currentDate,
      month: currentDate.getMonth(),
      year: currentDate.getFullYear(),
      day: formControl?.state || value,
      minDate,
      maxDate
    });

    day
      ? formControl?.setState(day)
      : setValue(formControl?.state || currentDate.getDate());
  }, [formControl?.state]);

  function setDayValue(value: number): void {
    formControl ? formControl.setState(value) : setValue(value);
  }

  function onChange(value: number): void {
    setDayValue(value);

    if (onValue) {
      onValue(value);
    }
  }

  return (
    <div className="rls-day-picker" rls-theme={rlsTheme}>
      <div className="rls-day-picker__header">
        {DAY_LABELS().map((title, index) => (
          <label key={index} className="rls-day-picker__label">
            {title}
          </label>
        ))}
      </div>

      <div className="rls-day-picker__component">
        {weeks.map(({ days }, index) => (
          <div key={index} className="rls-day-picker__week">
            {days.map(({ value, disabled, forbidden, selected }, index) => (
              <div
                key={index}
                className={renderClassStatus('rls-day-picker__day', {
                  disabled: disabled || disabledPicker,
                  forbidden,
                  selected
                })}
                onClick={
                  value && !disabledPicker ? () => onChange(value) : undefined
                }
              >
                <span className="rls-day-picker__day__span">
                  {value || '??'}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
