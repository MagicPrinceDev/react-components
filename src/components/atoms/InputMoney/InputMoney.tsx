import { useState } from 'react';
import { ReactInputControl } from '../../../hooks';
import { RlsAmount } from '../Amount/Amount';
import { RlsInput } from '../Input/Input';
import './InputMoney.css';

interface InputMoney {
  decimals?: boolean;
  disabled?: boolean;
  formControl?: ReactInputControl<number>;
  onValue?: (value: number) => void;
  placeholder?: string;
  symbol?: string;
  value?: number;
}

export function RlsInputMoney({
  decimals,
  disabled,
  formControl,
  onValue,
  placeholder,
  symbol,
  value
}: InputMoney) {
  const [valueInput, setValueInput] = useState(value || 0);

  function onMoney(value: number): void {
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
        onValue={onMoney}
      >
        <RlsAmount
          value={formControl?.state || value || valueInput}
          symbol={symbol}
          decimals={decimals}
        />
      </RlsInput>
    </div>
  );
}
