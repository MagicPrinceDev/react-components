import { DateRange } from '@rolster/helpers-date';
import { ReactControl } from '@rolster/react-forms';
import { useState } from 'react';
import { rangeFormatTemplate, renderClassStatus } from '../../../helpers';
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
  const currentRange = formControl?.state || DateRange.now();
  const currentDate = datePicker || new Date();

  const [value, setValue] = useState<Undefined<DateRange>>(currentRange);
  const [modalIsVisible, setModalIsVisible] = useState(false);

  function onClickInput(): void {
    setModalIsVisible(true);
  }

  function onClickAction(): void {
    if (value) {
      formControl?.setState(undefined);
      setValue(undefined);
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
              value={value ? rangeFormatTemplate(value) : ''}
              readOnly={true}
              placeholder={placeholder}
              onClick={onClickInput}
              disabled={disabled}
            />

            <button
              className="rls-date-field__action"
              onClick={onClickAction}
              disabled={disabled}
            >
              <RlsIcon value={value ? 'trash-2' : 'calendar'} />
            </button>
          </div>
        </div>
      </div>

      <RlsModal visible={modalIsVisible} rlsTheme={rlsTheme}>
        <RlsDateRangePicker
          formControl={formControl}
          date={currentDate}
          disabled={disabled}
          maxDate={maxDate}
          minDate={minDate}
          onListener={({ value }) => {
            if (value) {
              setValue(value);
            }

            setModalIsVisible(false);
          }}
        />
      </RlsModal>
    </div>
  );
}
