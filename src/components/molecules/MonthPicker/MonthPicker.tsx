import { ReactControl } from '@rolster/react-forms';
import { useEffect, useState } from 'react';
import { MonthState } from '../../../models';
import { createMonthPicker } from '../../../utils/month-picker';
import { renderClassStatus } from '../../../utils/css';
import { RlsComponent } from '../../definitions';
import './MonthPicker.css';

interface MonthPickerProps extends RlsComponent {
  date?: Date;
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, number>;
  maxDate?: Date;
  minDate?: Date;
  onValue?: (value: number) => void;
}

export function RlsMonthPicker({
  formControl,
  date,
  disabled: disabledPicker,
  maxDate,
  minDate,
  rlsTheme,
  onValue
}: MonthPickerProps) {
  const initialDate = date || new Date();
  const initialMonth = formControl?.state || initialDate.getMonth();

  const [months, setMonths] = useState<MonthState[]>([]);
  const [value, setValue] = useState(initialMonth);

  useEffect(() => {
    setMonths(
      createMonthPicker({
        date: initialDate,
        value: formControl?.state || value,
        minDate,
        maxDate
      })
    );
  }, [value, date, minDate, maxDate]);

  function onChange(value: number): void {
    formControl?.setState(value);
    setValue(value);

    if (onValue) {
      onValue(value);
    }
  }

  return (
    <div className="rls-month-picker" rls-theme={rlsTheme}>
      {months.map(({ label, value, disabled, selected }, index) => (
        <div
          key={index}
          className={renderClassStatus('rls-month-picker__component', {
            disabled: disabled || disabledPicker || false,
            selected
          })}
          onClick={() => {
            if (!disabled) {
              onChange(value);
            }
          }}
        >
          <span className="rls-month-picker__span">{label}</span>
        </div>
      ))}
    </div>
  );
}
