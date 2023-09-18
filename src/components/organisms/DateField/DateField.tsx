import { formatDate } from '@rolster/helpers-date';
import { useEffect, useState } from 'react';
import { ReactControl } from '../../../hooks';
import { RlsIcon } from '../../atoms';
import { RlsComponent } from '../../definitions';
import { RlsDatePicker } from '../DatePicker/DatePicker';
import { RlsModal } from '../Modal/Modal';
import './DateField.css';

interface DateField extends RlsComponent {
  date?: Date;
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, Date>;
  maxDate?: Date;
  minDate?: Date;
  placeholder?: string;
}

export function RlsDateField({
  children,
  date,
  disabled,
  formControl,
  maxDate,
  minDate,
  placeholder,
  rlsTheme
}: DateField) {
  const dateInitial = formControl?.state || date || new Date();

  const [value, setValue] = useState<Date | undefined>(dateInitial);
  const [show, setShow] = useState(false);
  const [description, setDescription] = useState('');

  useEffect(() => {
    setDescription(value ? formatDate(value, 'dd/mx/aa') : '');
  }, [value]);

  function onClickInput(): void {
    setShow(true);
  }

  function onClean(): void {
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

            <button className="rls-date-field__action" onClick={onClean}>
              <RlsIcon value={value ? 'trash-2' : 'calendar'} />
            </button>
          </div>
        </div>
      </div>

      <RlsModal visible={show}>
        <RlsDatePicker
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
