import { PickerListenerType, checkDateRange } from '@rolster/components';
import { dateFormatTemplate } from '@rolster/dates';
import { ReactControl } from '@rolster/react-forms';
import { useEffect, useState } from 'react';
import { DATE_RANGE_FORMAT } from '../../../constants';
import { renderClassStatus } from '../../../helpers';
import { RlsIcon } from '../../atoms';
import { RlsComponent } from '../../definitions';
import { RlsMessageFormError } from '../../molecules';
import { RlsModal } from '../Modal/Modal';
import { RlsPickerDate } from '../PickerDate/PickerDate';
import './FieldDate.css';

interface FieldDateProps extends RlsComponent {
  date?: Date;
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, Date | undefined>;
  maxDate?: Date;
  minDate?: Date;
  onValue?: (value?: Date) => void;
  placeholder?: string;
}

export function RlsFieldDate({
  children,
  date,
  disabled,
  formControl,
  maxDate,
  minDate,
  onValue,
  placeholder,
  rlsTheme
}: FieldDateProps) {
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
      formControl?.touch();
      onChange(undefined);
    } else {
      setModalIsVisible(true);
    }
  }

  return (
    <div className="rls-field-date" rls-theme={rlsTheme}>
      <div className={renderClassStatus('rls-field-box', { disabled })}>
        {children && <label className="rls-field-box__label">{children}</label>}

        <div className="rls-field-box__component">
          <div className="rls-field-box__body">
            <input
              className="rls-field-date__control"
              type="text"
              value={value ? dateFormatTemplate(value, DATE_RANGE_FORMAT) : ''}
              readOnly={true}
              placeholder={placeholder}
              onClick={onClickInput}
              disabled={disabled}
            />

            <button
              className="rls-field-date__action"
              onClick={onClean}
              disabled={disabled}
            >
              <RlsIcon value={value ? 'trash-2' : 'calendar'} />
            </button>
          </div>
        </div>

        <RlsMessageFormError
          className="rls-field-box__error"
          formControl={formControl}
        />
      </div>

      <RlsModal visible={modalIsVisible} rlsTheme={rlsTheme}>
        <RlsPickerDate
          formControl={formControl}
          date={date}
          disabled={disabled}
          maxDate={maxDate}
          minDate={minDate}
          onListener={({ value, type }) => {
            if (type !== PickerListenerType.Cancel) {
              onChange(value, true);
            }

            formControl?.touch();
            setModalIsVisible(false);
          }}
        />
      </RlsModal>
    </div>
  );
}
