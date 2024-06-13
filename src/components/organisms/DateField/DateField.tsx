import {
  PickerListenerType,
  checkDateRange
} from '@rolster/helpers-components';
import { dateFormatTemplate } from '@rolster/helpers-date';
import { ReactControl } from '@rolster/react-forms';
import { useEffect, useState } from 'react';
import { DATE_RANGE_FORMAT } from '../../../constants';
import { renderClassStatus } from '../../../helpers';
import { RlsMessageIcon, RlsIcon } from '../../atoms';
import { RlsComponent } from '../../definitions';
import { RlsDatePicker } from '../DatePicker/DatePicker';
import { RlsModal } from '../Modal/Modal';
import './DateField.css';

interface DateFieldProps extends RlsComponent {
  date?: Date;
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, Date>;
  maxDate?: Date;
  minDate?: Date;
  onValue?: (value?: Date) => void;
  placeholder?: string;
}

export function RlsDateField({
  children,
  date,
  disabled,
  formControl,
  maxDate,
  minDate,
  onValue,
  placeholder,
  rlsTheme
}: DateFieldProps) {
  const today = new Date(); // Initial current date in component

  const [value, setValue] = useState<Undefined<Date>>();
  const [modalIsVisible, setModalIsVisible] = useState(false);

  useEffect(() => {
    const dateCheck = checkDateRange({
      date: formControl?.state || date || today,
      minDate,
      maxDate
    });

    setValue(dateCheck);
    formControl?.setState(dateCheck);
  }, []);

  function onClickInput(): void {
    setModalIsVisible(true);
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
      setModalIsVisible(true);
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
              value={value ? dateFormatTemplate(value, DATE_RANGE_FORMAT) : ''}
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

      <RlsModal visible={modalIsVisible} rlsTheme={rlsTheme}>
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

            setModalIsVisible(false);

            if (!formControl?.touched) {
              formControl?.touch();
            }
          }}
        />
      </RlsModal>
    </div>
  );
}
