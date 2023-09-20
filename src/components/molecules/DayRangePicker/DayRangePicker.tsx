import {
  DAYS_NAME_MIN,
  normalizeMinTime,
  refactorDay
} from '@rolster/helpers-date';
import { useEffect, useState } from 'react';
import { DateRange, WeekRangeState } from '../../../models';
import { ReactControl } from '../../../hooks';
import { createRangePicker } from '../../../utils/date-range-picker';
import { renderClassStatus } from '../../../utils/css';
import { RlsComponent } from '../../definitions';
import './DayRangePicker.css';

const titles = DAYS_NAME_MIN;

interface DayRangePicker extends RlsComponent {
  date?: Date;
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, DateRange>;
  maxDate?: Date;
  minDate?: Date;
}

export function RlsDayRangePicker({
  date,
  disabled: disabledPicker,
  formControl,
  maxDate,
  minDate,
  rlsTheme
}: DayRangePicker) {
  const initialRange = formControl?.state || DateRange.now();
  const initialDate = normalizeMinTime(date || initialRange.minDate);

  const [weeks, setWeeks] = useState<WeekRangeState[]>([]);
  const [range, setRange] = useState(initialRange);

  useEffect(() => {
    setWeeks(
      createRangePicker({
        date: initialDate,
        range,
        minDate,
        maxDate
      })
    );
  }, [range, date, minDate, maxDate]);

  function onChange(value: number): void {
    const newRange = range.recalculate(refactorDay(initialDate, value));

    setRange(newRange);
    formControl?.setState(newRange);
  }

  return (
    <div className="rls-day-range-picker" rls-theme={rlsTheme}>
      <div className="rls-day-range-picker__header">
        {titles.map((title, index) => (
          <label key={index} className="rls-day-range-picker__label">
            {title}
          </label>
        ))}
      </div>

      <div className="rls-day-range-picker__component">
        {weeks.map(({ days }, index) => (
          <div key={index} className="rls-day-range-picker__week">
            {days.map(
              ({ value, disabled, forbidden, ranged, selected }, index) => (
                <div
                  key={index}
                  className={renderClassStatus('rls-day-range-picker__day', {
                    disabled: disabled || disabledPicker,
                    forbidden,
                    selected,
                    ranged
                  })}
                  onClick={() => {
                    if (value && !disabled) {
                      onChange(value);
                    }
                  }}
                >
                  <span className="rls-day-range-picker__day__span">
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
