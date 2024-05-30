import {
  WeekRangeState,
  createDayRangePicker
} from '@rolster/helpers-components';
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
import { DATE_RANGE_FORMAT } from '../../../constants';
import { renderClassStatus } from '../../../helpers/css';
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
  const currentRange = formControl?.state || DateRange.now();
  const currentDate = normalizeMinTime(date || currentRange.minDate);

  const sourceDate = useRef(currentRange.minDate);

  const [weeks, setWeeks] = useState<WeekRangeState[]>([]);
  const [range, setRange] = useState(currentRange);

  useEffect(() => {
    setWeeks(
      createDayRangePicker({
        date: currentDate,
        range,
        sourceDate: sourceDate.current,
        minDate,
        maxDate
      })
    );
  }, [range, date, minDate, maxDate]);

  function onChange(value: number): void {
    const date = assignDayInDate(currentDate, value);

    const range = dateIsBefore(date, sourceDate.current)
      ? new DateRange(sourceDate.current, date)
      : new DateRange(date, sourceDate.current);

    sourceDate.current = date;

    setRange(range);
    formControl?.setState(range);
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
                  onClick={
                    value && !disabledPicker ? () => onChange(value) : undefined
                  }
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
