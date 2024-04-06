import { DateRange } from '@rolster/helpers-date';
import { ReactControl } from '@rolster/react-forms';
import { useEffect, useState } from 'react';
import { formatRange } from '../../../helpers/date-range-picker';
import { RlsIcon } from '../../atoms';
import { RlsComponent } from '../../definitions';
import { RlsDateRangePicker } from '../DateRangePicker/DateRangePicker';
import { RlsModal } from '../Modal/Modal';
import './DateRangeField.css';

interface DateRangeFieldProps extends RlsComponent {
  date?: Date;
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, DateRange>;
  maxDate?: Date;
  minDate?: Date;
  placeholder?: string;
}

export function RlsDateRangeField({
  children,
  date: datePicker,
  disabled,
  formControl,
  maxDate,
  minDate,
  placeholder,
  rlsTheme
}: DateRangeFieldProps) {
  const rangeInitial = formControl?.state || DateRange.now();
  const dateInitial = datePicker || new Date();

  const [value, setValue] = useState<DateRange | undefined>(rangeInitial);
  const [date] = useState<Date | undefined>(dateInitial);
  const [show, setShow] = useState(false);
  const [description, setDescription] = useState('');

  useEffect(() => {
    setDescription(value ? formatRange(value) : '');
  }, [value]);

  function onClickInput(): void {
    setShow(true);
  }

  function onClickAction(): void {
    if (value) {
      formControl?.setState(undefined);
      setValue(undefined);
    } else {
      setShow(true);
    }
  }

  return (
    <div className="rls-date-field" rls-theme={rlsTheme}>
      <div className="rls-box-field">
        {children && <label className="rls-box-field__label">{children}</label>}

        <div className="rls-box-field__component">
          <div className="rls-box-field__body">
            <input
              className="rls-date-field__control"
              type="text"
              value={description}
              readOnly={true}
              placeholder={placeholder}
              onClick={onClickInput}
            />

            <button className="rls-date-field__action" onClick={onClickAction}>
              <RlsIcon value={value ? 'trash-2' : 'calendar'} />
            </button>
          </div>
        </div>
      </div>

      <RlsModal visible={show} rlsTheme={rlsTheme}>
        <RlsDateRangePicker
          formControl={formControl}
          date={date}
          disabled={disabled}
          maxDate={maxDate}
          minDate={minDate}
          onListener={({ value }) => {
            if (value) {
              setValue(value);
            }

            setShow(false);
          }}
        />
      </RlsModal>
    </div>
  );
}
