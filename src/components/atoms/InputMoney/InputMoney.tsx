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
  placeholder?: string;
  symbol?: string;
}

export function RlsInputMoney({
  decimals,
  defaultValue,
  disabled,
  formControl,
  placeholder,
  symbol
}: InputMoney) {
  const [value, setValue] = useState(defaultValue || 0);

  useEffect(() => {
    formControl?.subscribe((value) => {
      setValue(value || 0);
    });
  }, []);

  return (
    <div className="rls-input-money">
      <RlsInput
        formControl={formControl}
        type="number"
        disabled={disabled}
        placeholder={placeholder}
        defaultValue={defaultValue}
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
