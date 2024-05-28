import { itIsDefined } from '@rolster/helpers-advanced';
import { checkYearPicker, createYearPicker } from '@rolster/helpers-components';
import { ReactControl } from '@rolster/react-forms';
import { useEffect, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsIcon } from '../../atoms';
import { RlsComponent } from '../../definitions';
import './YearPicker.css';

interface YearPickerProps extends RlsComponent {
  date?: Date;
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, number>;
  maxDate?: Date;
  minDate?: Date;
  onValue?: (value: number) => void;
}

export function RlsYearPicker({
  date,
  disabled: disabledPicker,
  formControl,
  maxDate,
  minDate,
  onValue,
  rlsTheme
}: YearPickerProps) {
  const currentDate = date || new Date();

  const [value, setValue] = useState(
    formControl?.state || currentDate.getFullYear()
  );
  const [year, setYear] = useState(
    formControl?.state || currentDate.getFullYear()
  );
  const [template, setTemplate] = useState(
    createYearPicker({
      date: currentDate,
      year: formControl?.state || year,
      minDate,
      maxDate
    })
  );

  useEffect(() => {
    const props = createPickerProps(); // YearPickerProps

    const year = checkYearPicker(props);

    year
      ? setYearValue(year)
      : setTemplate(createYearPicker(createPickerProps()));
  }, [value, minDate, maxDate]);

  useEffect(() => {
    const year = checkYearPicker(createPickerProps());

    itIsDefined(year)
      ? formControl?.setState(year)
      : setValue(formControl?.state || currentDate.getFullYear());
  }, [formControl?.state]);

  function createPickerProps() {
    return {
      date: currentDate,
      year: formControl?.state || year,
      minDate,
      maxDate
    };
  }

  function setYearValue(value: number): void {
    formControl ? formControl.setState(value) : setValue(value);

    setYear(value);
  }

  function onClickPrev(): void {
    setYear(value - 8);
  }

  function onClickNext(): void {
    setYear(value + 8);
  }

  function onChange(value: number): void {
    setYearValue(value);

    if (onValue) {
      onValue(value);
    }
  }

  return (
    <div className="rls-year-picker" rls-theme={rlsTheme}>
      <div className="rls-year-picker__header">
        <div className="rls-year-picker__action rls-year-picker__action--prev">
          <button
            disabled={!template.canPrevious || disabledPicker}
            onClick={onClickPrev}
          >
            <RlsIcon value="arrow-ios-left" />
          </button>
        </div>

        <label className="title-bold">
          {template.minRange} - {template.maxRange}
        </label>

        <div className="rls-year-picker__action rls-year-picker__action--next">
          <button
            disabled={!template.canNext || disabledPicker}
            onClick={onClickNext}
          >
            <RlsIcon value="arrow-ios-right" />
          </button>
        </div>
      </div>

      <div className="rls-year-picker__component">
        {template.years.map(({ value, disabled, selected }, index) => (
          <div
            key={index}
            className={renderClassStatus('rls-year-picker__year', {
              disabled: disabled || disabledPicker,
              selected
            })}
            onClick={
              value && !disabledPicker ? () => onChange(value) : undefined
            }
          >
            <span className="rls-year-picker__year__span body1-medium">
              {value || '????'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
