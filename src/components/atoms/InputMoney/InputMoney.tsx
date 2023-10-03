import { useEffect, useState } from 'react';
import { ReactControl } from '../../../hooks';
import { RlsAmount } from '../Amount/Amount';
import { RlsInput } from '../Input/Input';
import './InputMoney.css';

interface InputMoney {
  decimals?: boolean;
  defaultValue?: number;
  disabled?: boolean;
  formControl?: ReactControl<HTMLInputElement, number>;
  onValue?: (value: number) => void;
  placeholder?: string;
  symbol?: string;
}

export function RlsInputMoney({
  decimals,
  defaultValue,
  disabled,
  formControl,
  onValue,
  placeholder,
  symbol
}: InputMoney) {
  const [value, setValue] = useState(defaultValue || 0);

  useEffect(() => {
    formControl?.subscribe((value) => {
      setValue(value || 0);
    });
  }, []);

  function onMoney(value: number): void {
    if (!formControl) {
      setValue(value);
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
        disabled={disabled}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onValue={onMoney}
      >
        <RlsAmount
          value={formControl?.state || value}
          symbol={symbol}
          decimals={decimals}
        />
      </RlsInput>
    </div>
  );
}
