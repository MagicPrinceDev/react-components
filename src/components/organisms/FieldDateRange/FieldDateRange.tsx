import { DateRange } from '@rolster/helpers-date';
import { ReactControl } from '@rolster/react-forms';
import { useState } from 'react';
import { rangeFormatTemplate, renderClassStatus } from '../../../helpers';
import { RlsIcon } from '../../atoms';
import { RlsComponent } from '../../definitions';
import { RlsPickerDateRange } from '../PickerDateRange/PickerDateRange';
import { RlsModal } from '../Modal/Modal';
import './FieldDateRange.css';

interface FieldDateRangeProps extends RlsComponent {
  date?: Date;
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, DateRange>;
  maxDate?: Date;
  minDate?: Date;
  placeholder?: string;
}

export function RlsFieldDateRange({
  children,
  date: datePicker,
  disabled,
  formControl,
  maxDate,
  minDate,
  placeholder,
  rlsTheme
}: FieldDateRangeProps) {
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
    <div className="rls-field-date-range" rls-theme={rlsTheme}>
      <div className={renderClassStatus('rls-field-box', { disabled })}>
        {children && <label className="rls-field-box__label">{children}</label>}

        <div className="rls-field-box__component">
          <div className="rls-field-box__body">
            <input
              className="rls-field-date-range__control"
              type="text"
              value={value ? rangeFormatTemplate(value) : ''}
              readOnly={true}
              placeholder={placeholder}
              onClick={onClickInput}
              disabled={disabled}
            />

            <button
              className="rls-field-date-range__action"
              onClick={onClickAction}
              disabled={disabled}
            >
              <RlsIcon value={value ? 'trash-2' : 'calendar'} />
            </button>
          </div>
        </div>
      </div>

      <RlsModal visible={modalIsVisible} rlsTheme={rlsTheme}>
        <RlsPickerDateRange
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
