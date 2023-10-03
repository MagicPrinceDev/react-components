import { useEffect, useState } from 'react';
import { ReactControl } from '../../../hooks';
import { RlsInput } from '../Input/Input';
import './InputText.css';

interface InputText {
  defaultValue?: string;
  disabled?: boolean;
  formControl?: ReactControl<HTMLInputElement, string>;
  onValue?: (value: string) => void;
  placeholder?: string;
}

export function RlsInputText({
  defaultValue,
  disabled,
  formControl,
  onValue,
  placeholder
}: InputText) {
  const [value, setValue] = useState(defaultValue || '');

  useEffect(() => {
    formControl?.subscribe((value) => {
      setValue(value || '');
    });
  }, []);

  function onText(value: string): void {
    if (!formControl) {
      setValue(value);
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
        disabled={disabled}
        placeholder={placeholder}
        onValue={onText}
      >
        {formControl?.state || value}
      </RlsInput>
    </div>
  );
}
