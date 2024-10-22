import { itIsDefined } from '@rolster/commons';
import {
  PickerListener,
  PickerListenerType,
  checkDateRange,
  dateOutRange
} from '@rolster/components';
import {
  assignDayInDate,
  assignMonthInDate,
  assignYearInDate,
  dateFormatTemplate
} from '@rolster/dates';
import { ReactControl, useReactControl } from '@rolster/react-forms';
import { useEffect, useState } from 'react';
import { renderClassStatus } from '../../../helpers';
import reactI18n from '../../../i18n';
import { RlsButton } from '../../atoms';
import { RlsComponent } from '../../definitions';
import {
  RlsPickerDay,
  RlsPickerMonth,
  RlsPickerMonthTitle,
  RlsPickerYear
} from '../../molecules';
import './PickerDate.css';

const FORMAT_TITLE = '{dw}, {mx} {dd} de {aa}';

interface PickerDateProps extends RlsComponent {
  automatic?: boolean;
  date?: Date;
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, Date | undefined>;
  maxDate?: Date;
  minDate?: Date;
  onListener?: (listener: PickerListener<Date>) => void;
}

type Visibility = 'DAY' | 'MONTH' | 'YEAR';

export function RlsPickerDate({
  automatic,
  date,
  disabled,
  formControl,
  maxDate,
  minDate,
  onListener,
  rlsTheme
}: PickerDateProps) {
  const today = new Date(); // Initial current date in component

  const dateInitial = formControl?.value || date || today;

  const yearControl = useReactControl(dateInitial.getFullYear());
  const dayControl = useReactControl(dateInitial.getDate());
  const monthControl = useReactControl(dateInitial.getMonth());

  const [value, setValue] = useState(dateInitial);
  const [visibility, setVisibility] = useState<Visibility>('DAY');

  useEffect(() => {
    const dateCheck = checkDateRange({
      date: formControl?.value || date || today,
      minDate,
      maxDate
    });

    setValue(dateCheck);
    formControl?.setValue(dateCheck);
  }, []);

  useEffect(() => {
    if (itIsDefined(yearControl.value)) {
      setValue(assignYearInDate(value, yearControl.value));
    }
  }, [yearControl.value]);

  useEffect(() => {
    if (itIsDefined(monthControl.value)) {
      setValue(assignMonthInDate(value, monthControl.value));
    }
  }, [monthControl.value]);

  useEffect(() => {
    if (itIsDefined(dayControl.value)) {
      setValue(assignDayInDate(value, dayControl.value));
    }
  }, [dayControl.value]);

  function onVisibilityDay(): void {
    setVisibility('DAY');
  }

  function onVisibilityMonth(): void {
    setVisibility('MONTH');
  }

  function onVisibilityYear(): void {
    setVisibility('YEAR');
  }

  function onCancel(): void {
    if (onListener) {
      onListener({ type: PickerListenerType.Cancel });
    }
  }

  function onToday(): void {
    yearControl.setValue(today.getFullYear());
    dayControl.setValue(today.getDate());
    monthControl.setValue(today.getMonth());
    formControl?.setValue(today);

    if (onListener) {
      onListener({ type: PickerListenerType.Now, value: today });
    }
  }

  function onSelect(): void {
    formControl?.setValue(value);

    if (onListener) {
      onListener({ type: PickerListenerType.Select, value });
    }
  }

  return (
    <div className="rls-picker-date" rls-theme={rlsTheme}>
      <div className="rls-picker-date__header">
        <div className="rls-picker-date__title rls-picker-date__title--description">
          <span onClick={onVisibilityDay}>
            {dateFormatTemplate(dateInitial, FORMAT_TITLE)}
          </span>
        </div>

        <div className="rls-picker-date__title rls-picker-date__title--year">
          <span onClick={onVisibilityYear}>{yearControl.value}</span>
        </div>

        <RlsPickerMonthTitle
          monthControl={monthControl}
          yearControl={yearControl}
          date={value}
          maxDate={maxDate}
          minDate={minDate}
          disabled={visibility === 'YEAR'}
          type={'month'}
          onClick={onVisibilityMonth}
        />
      </div>

      <div
        className={renderClassStatus('rls-picker-date__component', {
          day: visibility === 'DAY',
          month: visibility === 'MONTH',
          year: visibility === 'YEAR'
        })}
      >
        <RlsPickerDay
          formControl={dayControl}
          date={dateInitial}
          month={monthControl.value}
          year={yearControl.value}
          maxDate={maxDate}
          minDate={minDate}
          disabled={disabled}
        />

        <RlsPickerMonth
          formControl={monthControl}
          date={dateInitial}
          year={yearControl.value}
          maxDate={maxDate}
          minDate={minDate}
          disabled={disabled}
          onValue={onVisibilityDay}
        />

        <RlsPickerYear
          formControl={yearControl}
          date={dateInitial}
          maxDate={maxDate}
          minDate={minDate}
          disabled={disabled}
          onValue={onVisibilityDay}
        />
      </div>

      {!automatic && (
        <div className="rls-picker-date__footer">
          <div className="rls-picker-date__actions">
            <div className="rls-picker-date__actions--cancel">
              <RlsButton type="ghost" onClick={onCancel}>
                {reactI18n('dateActionCancel')}
              </RlsButton>
            </div>

            <div className="rls-picker-date__actions--today">
              <RlsButton
                type="ghost"
                onClick={onToday}
                disabled={dateOutRange({ date: today, maxDate, minDate })}
              >
                {reactI18n('dateActionToday')}
              </RlsButton>
            </div>

            <div className="rls-picker-date__actions--ok">
              <RlsButton type="raised" onClick={onSelect}>
                {reactI18n('dateActionSelect')}
              </RlsButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
