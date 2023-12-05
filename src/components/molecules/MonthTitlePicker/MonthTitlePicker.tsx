import { MONTH_NAMES } from '@rolster/helpers-date';
import { ReactControl } from '@rolster/react-forms';
import { useEffect, useState } from 'react';
import {
  MONTH_MAX_VALUE,
  MONTH_MIN_VALUE,
  isMaxLimitMonth,
  isMinLimitMonth
} from '../../../utils/month-picker';
import { RlsButtonAction } from '../../atoms';
import './MonthTitlePicker.css';

interface MonthTitlePicker {
  monthControl: ReactControl<HTMLElement, number>;
  yearControl: ReactControl<HTMLElement, number>;
  date?: Date;
  maxDate?: Date;
  minDate?: Date;
  onClick?: () => void;
}

export function RlsMonthTitlePicker({
  monthControl,
  yearControl,
  date,
  maxDate,
  minDate,
  onClick
}: MonthTitlePicker) {
  const { state: month } = monthControl;
  const { state: year } = yearControl;

  const [limitMinMonth, setLimitMinMonth] = useState(false);
  const [limitMaxMonth, setLimitMaxMonth] = useState(false);

  const monthName = MONTH_NAMES()[month || 0];

  useEffect(() => {
    if (typeof month === 'number' && date) {
      setLimitMinMonth(isMinLimitMonth(month, date, minDate));
      setLimitMaxMonth(isMaxLimitMonth(month, date, maxDate));
    }
  }, [date]);

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

  return (
    <div className="rls-month-title-picker">
      <RlsButtonAction
        icon="arrow-ios-left"
        onClick={onPreviousMonth}
        disabled={limitMinMonth}
      />

      <span onClick={onClick}>{monthName}</span>

      <RlsButtonAction
        icon="arrow-ios-right"
        onClick={onNextMonth}
        disabled={limitMaxMonth}
      />
    </div>
  );
}
