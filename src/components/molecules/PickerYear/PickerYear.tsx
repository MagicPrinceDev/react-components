import { itIsDefined } from '@rolster/commons';
import { checkYearPicker, createYearPicker } from '@rolster/components';
import { ReactControl } from '@rolster/react-forms';
import { useEffect, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsButtonAction } from '../../atoms';
import { RlsComponent } from '../../definitions';
import './PickerYear.css';

interface PickerYearProps extends RlsComponent {
  date?: Date;
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, number>;
  maxDate?: Date;
  minDate?: Date;
  onValue?: (value: number) => void;
}

export function RlsPickerYear({
  date,
  disabled: disabledPicker,
  formControl,
  maxDate,
  minDate,
  onValue,
  rlsTheme
}: PickerYearProps) {
  const currentDate = date || new Date();

  const [value, setValue] = useState(
    formControl?.state || currentDate.getFullYear()
  );
  const [year, setYear] = useState(
    formControl?.state || currentDate.getFullYear()
  );
  const [template, setTemplate] = useState(
    createYearPicker(createPickerProps())
  );

  useEffect(() => {
    const props = createPickerProps(); // YearPickerProps

    const year = checkYearPicker(props);

    year
      ? setYearValue(year)
      : setTemplate(createYearPicker(createPickerProps()));
  }, [date, year, value, minDate, maxDate]);

  useEffect(() => {
    const year = checkYearPicker(createPickerProps());

    itIsDefined(year)
      ? formControl?.setState(year)
      : setValue(formControl?.state || currentDate.getFullYear());
  }, [formControl?.state]);

  function createPickerProps() {
    return {
      date: currentDate,
      year,
      minDate,
      maxDate
    };
  }

  function setYearValue(value: number): void {
    formControl ? formControl.setState(value) : setValue(value);

    setYear(value);
  }

  function onClickPrev(): void {
    setYear(year - 8);
  }

  function onClickNext(): void {
    setYear(year + 8);
  }

  function onChange(value: number): void {
    setYearValue(value);

    if (onValue) {
      onValue(value);
    }
  }

  return (
    <div className="rls-picker-year" rls-theme={rlsTheme}>
      <div className="rls-picker-year__header">
        <div className="rls-picker-year__action rls-picker-year__action--prev">
          <RlsButtonAction
            icon="arrow-ios-left"
            onClick={onClickPrev}
            disabled={!template.canPrevious || disabledPicker}
          />
        </div>

        <label className="rls-title-bold">
          {template.minRange} - {template.maxRange}
        </label>

        <div className="rls-picker-year__action rls-picker-year__action--next">
          <RlsButtonAction
            icon="arrow-ios-right"
            onClick={onClickNext}
            disabled={!template.canNext || disabledPicker}
          />
        </div>
      </div>

      <div className="rls-picker-year__component">
        {template.years.map(({ value, disabled, focused, selected }, index) => (
          <div
            key={index}
            className={renderClassStatus('rls-picker-year__year', {
              disabled: disabled || disabledPicker,
              focused,
              selected
            })}
            onClick={
              value && !disabledPicker ? () => onChange(value) : undefined
            }
          >
            <span className="rls-picker-year__year__span rls-body1-medium">
              {value || '????'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
