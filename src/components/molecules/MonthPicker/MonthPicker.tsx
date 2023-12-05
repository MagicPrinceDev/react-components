import { ReactControl } from '@rolster/react-forms';
import { useEffect, useState } from 'react';
import { RlsComponent } from '../../definitions';
import './MonthPicker.css';
import { MonthState } from '../../../models';
import { createMonthPicker } from '../../../utils/month-picker';
import { renderClassStatus } from '../../../utils/css';

interface MonthPicker extends RlsComponent {
  date?: Date;
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, number>;
  maxDate?: Date;
  minDate?: Date;
}

export function RlsMonthPicker({
  formControl,
  date,
  disabled: disabledPicker,
  maxDate,
  minDate,
  rlsTheme
}: MonthPicker) {
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
            formControl?.setState(value);
            setValue(value);
          }}
        >
          <span className="rls-month-picker__span">{label}</span>
        </div>
      ))}
    </div>
  );
}
