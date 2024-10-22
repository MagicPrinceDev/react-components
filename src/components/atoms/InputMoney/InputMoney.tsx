import { ReactControl } from '@rolster/react-forms';
import { useState } from 'react';
import { RlsAmount } from '../Amount/Amount';
import { RlsInput } from '../Input/Input';
import './InputMoney.css';

interface InputMoneyProps {
  decimals?: boolean;
  disabled?: boolean;
  formControl?: ReactControl<HTMLInputElement, number>;
  placeholder?: string;
  symbol?: string;
  value?: number;
  onValue?: (value: number) => void;
}

export function RlsInputMoney({
  decimals,
  disabled,
  formControl,
  placeholder,
  symbol,
  value,
  onValue
}: InputMoneyProps) {
  const [valueInput, setValueInput] = useState(value || 0);

  function onChange(value: number): void {
    if (!formControl) {
      setValueInput(value);
    }

    if (onValue) {
      onValue(value);
    }
  }

  return (
    <div className="rls-input-money">
      <RlsInput
        formControl={formControl}
        type="number"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onValue={onChange}
      >
        <RlsAmount
          value={formControl?.value || value || valueInput}
          symbol={symbol}
          decimals={decimals}
        />
      </RlsInput>
    </div>
  );
}
