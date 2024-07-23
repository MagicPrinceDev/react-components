import { itIsDefined } from '@rolster/commons';
import {
  MonthState,
  checkMonthPicker,
  createMonthPicker
} from '@rolster/components';
import { ReactControl } from '@rolster/react-forms';
import { useEffect, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import './PickerMonth.css';

interface PickerMonthProps extends RlsComponent {
  date?: Date;
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, number>;
  maxDate?: Date;
  minDate?: Date;
  onValue?: (value: number) => void;
  year?: Nulleable<number>;
}

export function RlsPickerMonth({
  date,
  disabled: disabledPicker,
  formControl,
  maxDate,
  minDate,
  onValue,
  rlsTheme,
  year
}: PickerMonthProps) {
  const currentDate = date || new Date();

  const [months, setMonths] = useState<MonthState[]>([]);
  const [value, setValue] = useState(
    formControl?.state || currentDate.getMonth()
  );

  useEffect(() => {
    const props = createPickerProps(); // MonthPickerProps

    const month = checkMonthPicker(props);

    month ? setMonthValue(month) : setMonths(createMonthPicker(props));
  }, [date, year, value, minDate, maxDate]);

  useEffect(() => {
    const month = checkMonthPicker(createPickerProps());

    itIsDefined(month)
      ? formControl?.setState(month)
      : setValue(formControl?.state || currentDate.getMonth());
  }, [formControl?.state]);

  function createPickerProps() {
    return {
      date: currentDate,
      month: itIsDefined(formControl?.state) ? formControl?.state : value,
      year: year || currentDate.getFullYear(),
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
    <div className="rls-picker-month" rls-theme={rlsTheme}>
      {months.map(({ label, value, disabled, focused, selected }, index) => (
        <div
          key={index}
          className={renderClassStatus('rls-picker-month__component', {
            disabled: disabled || disabledPicker,
            focused,
            selected
          })}
          onClick={
            !(disabled || disabledPicker) ? () => onChange(value) : undefined
          }
        >
          <span className="rls-picker-month__span">{label}</span>
        </div>
      ))}
    </div>
  );
}
