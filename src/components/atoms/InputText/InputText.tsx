import { useEffect, useState } from 'react';
import { ReactControl } from '../../../hooks';
import { RlsInput } from '../Input/Input';
import './InputText.css';

interface InputText {
  defaultValue?: string;
  disabled?: boolean;
  formControl?: ReactControl<HTMLInputElement, string>;
  placeholder?: string;
}

export function RlsInputText({
  defaultValue,
  disabled,
  formControl,
  placeholder
}: InputText) {
  const [value, setValue] = useState(defaultValue || '');

  useEffect(() => {
    formControl?.subscribe((value) => {
      setValue(value || '');
    });
  }, []);

  return (
    <div className="rls-input-text">
      <RlsInput
        formControl={formControl}
        type="text"
        disabled={disabled}
        placeholder={placeholder}
      >
        {formControl?.state || value}
      </RlsInput>
    </div>
  );
}
