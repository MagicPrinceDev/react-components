import {
  DAY_LABELS,
  DateRange,
  assignDayInDate,
  dateFormatTemplate,
  dateIsBefore,
  normalizeMinTime
} from '@rolster/helpers-date';
import { ReactControl } from '@rolster/react-forms';
import { useEffect, useRef, useState } from 'react';
import { WeekRangeState } from '../../../models';
import { renderClassStatus } from '../../../helpers/css';
import {
  DATE_RANGE_FORMAT,
  createRangePicker
} from '../../../helpers/date-range-picker';
import { RlsComponent } from '../../definitions';
import './DayRangePicker.css';

interface DayRangePickerProps extends RlsComponent {
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
}: DayRangePickerProps) {
  const initialRange = formControl?.state || DateRange.now();
  const initialDate = normalizeMinTime(date || initialRange.minDate);

  const sourceDate = useRef(initialRange.minDate);

  const [weeks, setWeeks] = useState<WeekRangeState[]>([]);
  const [range, setRange] = useState(initialRange);

  useEffect(() => {
    setWeeks(
      createRangePicker({
        date: initialDate,
        range,
        sourceDate: sourceDate.current,
        minDate,
        maxDate
      })
    );
  }, [range, date, minDate, maxDate]);

  function onChange(value: number): void {
    const newDate = assignDayInDate(initialDate, value);

    const newRange = dateIsBefore(newDate, sourceDate.current)
      ? new DateRange(sourceDate.current, newDate)
      : new DateRange(newDate, sourceDate.current);

    sourceDate.current = newDate;

    setRange(newRange);
    formControl?.setState(newRange);
  }

  return (
    <div className="rls-day-range-picker" rls-theme={rlsTheme}>
      <div className="rls-day-range-picker__title">
        {dateFormatTemplate(sourceDate.current, DATE_RANGE_FORMAT)}
      </div>

      <div className="rls-day-range-picker__header">
        {DAY_LABELS().map((title, index) => (
          <label key={index} className="rls-day-range-picker__label">
            {title}
          </label>
        ))}
      </div>

      <div className="rls-day-range-picker__component">
        {weeks.map(({ days }, index) => (
          <div key={index} className="rls-day-range-picker__week">
            {days.map(
              ({ disabled, end, forbidden, source, ranged, value }, index) => (
                <div
                  key={index}
                  className={renderClassStatus('rls-day-range-picker__day', {
                    disabled: disabled || disabledPicker,
                    end,
                    forbidden,
                    ranged,
                    source
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
