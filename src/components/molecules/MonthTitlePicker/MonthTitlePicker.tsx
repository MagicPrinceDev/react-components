import { MONTH_NAMES } from '@rolster/helpers-date';
import { ReactControl } from '@rolster/react-forms';
import {
  MONTH_MAX_VALUE,
  MONTH_MIN_VALUE,
  isMaxLimitMonth,
  isMinLimitMonth
} from '../../../helpers/month-picker';
import { RlsButtonAction } from '../../atoms';
import './MonthTitlePicker.css';

type MonthTitlePickerType = 'month' | 'year';

interface MonthTitlePickerProps {
  monthControl: ReactControl<HTMLElement, number>;
  type: MonthTitlePickerType;
  yearControl: ReactControl<HTMLElement, number>;
  date?: Date;
  disabled?: boolean;
  maxDate?: Date;
  minDate?: Date;
  onClick?: () => void;
}

export function RlsMonthTitlePicker({
  date,
  disabled,
  monthControl,
  maxDate,
  minDate,
  onClick,
  type,
  yearControl
}: MonthTitlePickerProps) {
  const { state: month } = monthControl;
  const { state: year } = yearControl;

  const monthName = MONTH_NAMES()[month || 0];

  function onPreviousMonth(): void {
    if (typeof month === 'number' && typeof year === 'number') {
      if (month > MONTH_MIN_VALUE) {
        monthControl.setState(month - 1);
      } else {
        monthControl.setState(MONTH_MAX_VALUE);
        yearControl.setState(year - 1);
      }
    }
  }

  function onPreviousYear(): void {
    if (typeof year === 'number') {
      yearControl.setState(year - 1);
    }
  }

  function onPrevious(): void {
    type === 'month' ? onPreviousMonth() : onPreviousYear();
  }

  function onNextMonth(): void {
    if (typeof month === 'number' && typeof year === 'number') {
      if (month < MONTH_MAX_VALUE) {
        monthControl.setState(month + 1);
      } else {
        monthControl.setState(MONTH_MIN_VALUE);
        yearControl.setState(year + 1);
      }
    }
  }

  function onNextYear(): void {
    if (typeof year === 'number') {
      yearControl.setState(year + 1);
    }
  }

  function onNext(): void {
    type === 'month' ? onNextMonth() : onNextYear();
  }

  return (
    <div className="rls-month-title-picker">
      <RlsButtonAction
        icon="arrow-ios-left"
        onClick={onPrevious}
        disabled={isMinLimitMonth(month, date, minDate) || disabled}
      />

      <span onClick={onClick}>{monthName}</span>

      <RlsButtonAction
        icon="arrow-ios-right"
        onClick={onNext}
        disabled={isMaxLimitMonth(month, date, maxDate) || disabled}
      />
    </div>
  );
}
