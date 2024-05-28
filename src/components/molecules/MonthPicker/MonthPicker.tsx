import { itIsDefined } from '@rolster/helpers-advanced';
import {
  MonthState,
  checkMonthPicker,
  createMonthPicker
} from '@rolster/helpers-components';
import { ReactControl } from '@rolster/react-forms';
import { useEffect, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import './MonthPicker.css';

interface MonthPickerProps extends RlsComponent {
  date?: Date;
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, number>;
  maxDate?: Date;
  minDate?: Date;
  onValue?: (value: number) => void;
  year?: Nulleable<number>;
}

export function RlsMonthPicker({
  date,
  disabled: disabledPicker,
  formControl,
  maxDate,
  minDate,
  onValue,
  rlsTheme,
  year
}: MonthPickerProps) {
  const currentDate = date || new Date();

  const [months, setMonths] = useState<MonthState[]>([]);
  const [value, setValue] = useState(
    formControl?.state || currentDate.getMonth()
  );

  useEffect(() => {
    const props = createPickerProps(); // MonthPickerProps

    const month = checkMonthPicker(props);

    month ? setMonthValue(month) : setMonths(createMonthPicker(props));
  }, [year, value, minDate, maxDate]);

  useEffect(() => {
    const month = checkMonthPicker(createPickerProps());

    itIsDefined(month)
      ? formControl?.setState(month)
      : setValue(formControl?.state || currentDate.getMonth());
  }, [formControl?.state]);

  function createPickerProps() {
    return {
      date: currentDate,
      year: year || currentDate.getFullYear(),
      month: itIsDefined(formControl?.state) ? formControl?.state : value,
      minDate,
      maxDate
    };
  }

  function setMonthValue(value: number): void {
    formControl ? formControl.setState(value) : setValue(value);
  }

  function onChange(value: number): void {
    setMonthValue(value);

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
            disabled: disabled || disabledPicker,
            selected
          })}
          onClick={
            !(disabled || disabledPicker) ? () => onChange(value) : undefined
          }
        >
          <span className="rls-month-picker__span">{label}</span>
        </div>
      ))}
    </div>
  );
}
