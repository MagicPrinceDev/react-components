import { ReactControl } from '@rolster/react-forms';
import { useState } from 'react';
import { RlsInput } from '../Input/Input';
import './InputNumber.css';

interface InputNumber {
  disabled?: boolean;
  formControl?: ReactControl<HTMLInputElement, number>;
  onValue?: (value: number) => void;
  placeholder?: string;
  value?: number;
}

export function RlsInputNumber({
  disabled,
  formControl,
  onValue,
  placeholder,
  value
}: InputNumber) {
  const [valueInput, setValueInput] = useState(value || 0);

  function onNumber(value: number): void {
    if (!formControl) {
      setValueInput(value);
    }

    if (onValue) {
      onValue(value);
    }
  }

  return (
    <div className="rls-input-number">
      <RlsInput
        formControl={formControl}
        type="number"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onValue={onNumber}
      >
        {formControl?.state || value || valueInput}
      </RlsInput>
    </div>
  );
}
