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
import './PickerDay.css';

interface PickerDayProps extends RlsComponent {
  date?: Date;
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, number>;
  maxDate?: Date;
  month?: Nulleable<number>;
  minDate?: Date;
  onValue?: (value: number) => void;
  year?: Nulleable<number>;
}

export function RlsPickerDay({
  date,
  disabled: disabledPicker,
  formControl,
  maxDate,
  month,
  minDate,
  onValue,
  rlsTheme,
  year
}: PickerDayProps) {
  const currentDate = date || new Date(); // Initial date

  const [weeks, setWeeks] = useState<WeekState[]>([]);
  const [value, setValue] = useState(
    formControl?.state || currentDate.getDate()
  );

  useEffect(() => {
    const props = createPickerProps();

    const day = checkDayPicker(props);

    day ? setDayValue(day) : setWeeks(createDayPicker(props));
  }, [date, month, year, value, minDate, maxDate]);

  useEffect(() => {
    const day = checkDayPicker(createPickerProps());

    day
      ? formControl?.setState(day)
      : setValue(formControl?.state || currentDate.getDate());
  }, [formControl?.state]);

  function createPickerProps() {
    return {
      date: currentDate,
      day: formControl?.state || value,
      month: itIsDefined(month) ? month : currentDate.getMonth(),
      year: year || currentDate.getFullYear(),
      minDate,
      maxDate
    };
  }

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
    <div className="rls-picker-day" rls-theme={rlsTheme}>
      <div className="rls-picker-day__header">
        {DAY_LABELS().map((title, index) => (
          <label key={index} className="rls-picker-day__label">
            {title}
          </label>
        ))}
      </div>

      <div className="rls-picker-day__component">
        {weeks.map(({ days }, index) => (
          <div key={index} className="rls-picker-day__week">
            {days.map(
              (
                { value, disabled, focused, forbidden, selected, today },
                index
              ) => (
                <div
                  key={index}
                  className={renderClassStatus('rls-picker-day__element', {
                    disabled: disabled || disabledPicker,
                    focused,
                    forbidden,
                    selected,
                    today
                  })}
                  onClick={
                    value && !disabledPicker ? () => onChange(value) : undefined
                  }
                >
                  <span className="rls-picker-day__element__span">
                    {value || '??'}
                  </span>
                </div>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
