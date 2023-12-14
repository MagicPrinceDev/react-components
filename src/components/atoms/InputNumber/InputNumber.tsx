import { ReactControl } from '@rolster/react-forms';
import { useState } from 'react';
import { RlsInput } from '../Input/Input';
import './InputNumber.css';

interface InputNumberProps {
  disabled?: boolean;
  formControl?: ReactControl<HTMLInputElement, number>;
  placeholder?: string;
  value?: number;
  onValue?: (value: number) => void;
}

export function RlsInputNumber({
  disabled,
  formControl,
  placeholder,
  value,
  onValue
}: InputNumberProps) {
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
