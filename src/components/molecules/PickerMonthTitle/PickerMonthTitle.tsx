import { itIsDefined } from '@rolster/commons';
import { monthLimitTemplate } from '@rolster/components';
import { MONTH_NAMES, Month } from '@rolster/dates';
import { ReactControl } from '@rolster/react-forms';
import { RlsButtonAction } from '../../atoms';
import './PickerMonthTitle.css';

type PickerMonthTitleType = 'month' | 'year';

interface PickerMonthTitleProps {
  monthControl: ReactControl<HTMLElement, number>;
  type: PickerMonthTitleType;
  yearControl: ReactControl<HTMLElement, number>;
  date?: Date;
  disabled?: boolean;
  maxDate?: Date;
  minDate?: Date;
  onClick?: () => void;
}

export function RlsPickerMonthTitle({
  monthControl,
  type,
  yearControl,
  date,
  disabled,
  maxDate,
  minDate,
  onClick
}: PickerMonthTitleProps) {
  const { limitNext, limitPrevious } = monthLimitTemplate({
    date,
    maxDate,
    minDate,
    month: monthControl.value
  });

  const monthName = MONTH_NAMES()[monthControl.value || 0];

  function onPreviousMonth(): void {
    if (itIsDefined(monthControl.value) && itIsDefined(yearControl.value)) {
      if (monthControl.value > Month.January) {
        monthControl.setValue(monthControl.value - 1);
      } else {
        monthControl.setValue(Month.December);
        yearControl.setValue(yearControl.value - 1);
      }
    }
  }

  function onPreviousYear(): void {
    if (itIsDefined(yearControl.value)) {
      yearControl.setValue(yearControl.value - 1);
    }
  }

  function onPrevious(): void {
    type === 'month' ? onPreviousMonth() : onPreviousYear();
  }

  function onNextMonth(): void {
    if (itIsDefined(monthControl.value) && itIsDefined(yearControl.value)) {
      if (monthControl.value < Month.December) {
        monthControl.setValue(monthControl.value + 1);
      } else {
        monthControl.setValue(Month.January);
        yearControl.setValue(yearControl.value + 1);
      }
    }
  }

  function onNextYear(): void {
    if (itIsDefined(yearControl.value)) {
      yearControl.setValue(yearControl.value + 1);
    }
  }

  function onNext(): void {
    type === 'month' ? onNextMonth() : onNextYear();
  }

  return (
    <div className="rls-picker-month-title">
      <RlsButtonAction
        icon="arrow-ios-left"
        onClick={onPrevious}
        disabled={limitPrevious || disabled}
      />

      <span onClick={onClick}>{monthName}</span>

      <RlsButtonAction
        icon="arrow-ios-right"
        onClick={onNext}
        disabled={limitNext || disabled}
      />
    </div>
  );
}
