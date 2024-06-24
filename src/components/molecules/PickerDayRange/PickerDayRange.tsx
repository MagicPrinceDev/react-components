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
import './PickerDayRange.css';

interface PickerDayRangeProps extends RlsComponent {
  date?: Date;
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, DateRange>;
  maxDate?: Date;
  minDate?: Date;
}

export function RlsPickerDayRange({
  date,
  disabled: disabledPicker,
  formControl,
  maxDate,
  minDate,
  rlsTheme
}: PickerDayRangeProps) {
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
    <div className="rls-picker-day-range" rls-theme={rlsTheme}>
      <div className="rls-picker-day-range__title">
        {dateFormatTemplate(sourceDate.current, DATE_RANGE_FORMAT)}
      </div>

      <div className="rls-picker-day-range__header">
        {DAY_LABELS().map((title, index) => (
          <label key={index} className="rls-picker-day-range__label">
            {title}
          </label>
        ))}
      </div>

      <div className="rls-picker-day-range__component">
        {weeks.map(({ days }, index) => (
          <div key={index} className="rls-picker-day-range__week">
            {days.map(
              ({ disabled, end, forbidden, source, ranged, value }, index) => (
                <div
                  key={index}
                  className={renderClassStatus(
                    'rls-picker-day-range__element',
                    {
                      disabled: disabled || disabledPicker,
                      end,
                      forbidden,
                      ranged,
                      source
                    }
                  )}
                  onClick={
                    value && !disabledPicker ? () => onChange(value) : undefined
                  }
                >
                  <span className="rls-picker-day-range__element__span">
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
