import { useEffect, useState } from 'react';
import { ReactControl } from '../../../hooks';
import { RlsInput } from '../Input/Input';
import './InputNumber.css';

interface InputNumber {
  disabled?: boolean;
  defaultValue?: number;
  formControl?: ReactControl<HTMLInputElement, number>;
  placeholder?: string;
}

export function RlsInputNumber({
  disabled,
  defaultValue,
  formControl,
  placeholder
}: InputNumber) {
  const [value, setValue] = useState(defaultValue || 0);

  useEffect(() => {
    formControl?.subscribe((value) => {
      setValue(value || 0);
    });
  }, []);

  return (
    <div className="rls-input-number">
      <RlsInput
        formControl={formControl}
        type="number"
        disabled={disabled}
        placeholder={placeholder}
      >
        {formControl?.state || value}
      </RlsInput>
    </div>
  );
}
