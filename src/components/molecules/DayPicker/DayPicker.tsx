import { DAY_LABELS } from '@rolster/helpers-date';
import { ReactControl } from '@rolster/react-forms';
import { useEffect, useState } from 'react';
import { renderClassStatus } from '../../../utils/css';
import { createDayPicker } from '../../../utils/day-picker';
import { WeekState } from '../../../models';
import { RlsComponent } from '../../definitions';
import './DayPicker.css';

interface DayPickerProps extends RlsComponent {
  date?: Date;
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, number>;
  maxDate?: Date;
  minDate?: Date;
  onValue?: (value: number) => void;
}

export function RlsDayPicker({
  date,
  disabled: disabledPicker,
  formControl,
  maxDate,
  minDate,
  rlsTheme,
  onValue
}: DayPickerProps) {
  const initialDate = date || new Date();
  const initialDay = formControl?.state || initialDate.getDate();

  const [weeks, setWeeks] = useState<WeekState[]>([]);
  const [value, setValue] = useState(initialDay);

  useEffect(() => {
    setWeeks(
      createDayPicker({
        date: initialDate,
        value: formControl?.state || value,
        minDate,
        maxDate
      })
    );
  }, [value, date, minDate, maxDate]);

  useEffect(() => {
    if (date && date.getDate() !== value) {
      onChange(date.getDate());
    }
  }, [date]);

  function onChange(value: number): void {
    setValue(value);
    formControl?.setState(value);

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
                onClick={() => {
                  if (value && !disabled) {
                    onChange(value);
                  }
                }}
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
