import { ReactControl } from '@rolster/react-forms';
import { useState } from 'react';
import { RlsInput } from '../Input/Input';
import './InputText.css';

interface InputTextProps {
  disabled?: boolean;
  formControl?: ReactControl<HTMLInputElement, string>;
  placeholder?: string;
  value?: string;
  onValue?: (value: string) => void;
}

export function RlsInputText({
  disabled,
  formControl,
  placeholder,
  value,
  onValue
}: InputTextProps) {
  const [valueInput, setValueInput] = useState(value || '');

  function onText(value: string): void {
    if (!formControl) {
      setValueInput(value);
    }

    if (onValue) {
      onValue(value);
    }
  }

  return (
    <div className="rls-input-text">
      <RlsInput
        formControl={formControl}
        type="text"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onValue={onText}
      >
        {formControl?.state || value || valueInput}
      </RlsInput>
    </div>
  );
}
