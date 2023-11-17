import { useState } from 'react';
import { ReactInputControl } from '../../../hooks';
import { RlsInput } from '../Input/Input';
import './InputText.css';

interface InputText {
  disabled?: boolean;
  formControl?: ReactInputControl<string>;
  onValue?: (value: string) => void;
  placeholder?: string;
  value?: string;
}

export function RlsInputText({
  disabled,
  formControl,
  onValue,
  placeholder,
  value
}: InputText) {
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
