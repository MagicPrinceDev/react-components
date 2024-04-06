import { formatDate } from '@rolster/helpers-date';
import { ReactControl } from '@rolster/react-forms';
import { useEffect, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsMessageIcon, RlsIcon } from '../../atoms';
import { RlsComponent } from '../../definitions';
import { RlsDatePicker } from '../DatePicker/DatePicker';
import { RlsModal } from '../Modal/Modal';
import './DateField.css';
import { PickerListenerType } from '../../../types';

interface DateFieldProps extends RlsComponent {
  date?: Date;
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, Date>;
  maxDate?: Date;
  minDate?: Date;
  placeholder?: string;
  onValue?: (value?: Date) => void;
}

export function RlsDateField({
  children,
  date,
  disabled,
  formControl,
  maxDate,
  minDate,
  placeholder,
  rlsTheme,
  onValue
}: DateFieldProps) {
  const dateInitial = formControl?.state || date || new Date();

  const [value, setValue] = useState<Date | undefined>(dateInitial);
  const [show, setShow] = useState(false);
  const [description, setDescription] = useState('');

  useEffect(() => {
    setDescription(value ? formatDate(value, '{dd}/{mx}/{aa}') : '');
  }, [value]);

  function onClickInput(): void {
    setShow(true);
  }

  function onChange(value?: Date, ignoreControl = false): void {
    if (!ignoreControl) {
      formControl?.setState(value);
    }

    setValue(value);

    if (onValue) {
      onValue(value);
    }
  }

  function onClean(): void {
    if (value) {
      onChange(undefined);

      if (formControl && !formControl.touched) {
        formControl.touch();
      }
    } else {
      setShow(true);
    }
  }

  return (
    <div className="rls-date-field" rls-theme={rlsTheme}>
      <div className={renderClassStatus('rls-box-field', { disabled })}>
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
              disabled={disabled}
            />

            <button
              className="rls-date-field__action"
              onClick={onClean}
              disabled={disabled}
            >
              <RlsIcon value={value ? 'trash-2' : 'calendar'} />
            </button>
          </div>
        </div>

        {formControl?.touched && formControl?.error && (
          <div className="rls-box-field__error">
            <RlsMessageIcon icon="alert-triangle" rlsTheme="danger">
              {formControl.error.message}
            </RlsMessageIcon>
          </div>
        )}
      </div>

      <RlsModal visible={show} rlsTheme={rlsTheme}>
        <RlsDatePicker
          formControl={formControl}
          date={date}
          disabled={disabled}
          maxDate={maxDate}
          minDate={minDate}
          onListener={({ value, type }) => {
            if (type !== PickerListenerType.Cancel) {
              onChange(value, true);
            }

            setShow(false);

            if (formControl && !formControl.touched) {
              formControl.touch();
            }
          }}
        />
      </RlsModal>
    </div>
  );
}
