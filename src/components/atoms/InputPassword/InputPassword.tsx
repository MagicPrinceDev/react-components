import { ReactControl } from '@rolster/react-forms';
import { useState } from 'react';
import { renderClassStatus } from '../../../utils/css';
import { RlsComponent } from '../../definitions';
import './InputPassword.css';

type InputPasswordType = 'password' | 'text';

interface InputPasswordProps extends RlsComponent {
  disabled?: boolean;
  formControl?: ReactControl<HTMLInputElement, string>;
  placeholder?: string;
  type?: InputPasswordType;
  onValue?: (value: string) => void;
}

export function RlsInputPassword({
  disabled,
  formControl,
  placeholder,
  type,
  onValue
}: InputPasswordProps) {
  const [focused, setFocused] = useState(false);

  function onChange(event: any): void {
    formControl?.setState(event.target.value);

    if (onValue) {
      onValue(event.target.value);
    }
  }

  function onFocus() {
    formControl?.focus();
    setFocused(true);
  }

  function onBlur() {
    if (formControl && !formControl.touched) {
      formControl.touch();
    }

    formControl?.blur();
    setFocused(false);
  }

  return (
    <div
      className={renderClassStatus('rls-input-password', {
        focused: formControl?.focused || focused,
        disabled
      })}
    >
      <input
        className="rls-input-password__component"
        autoComplete="off"
        type={type || 'password'}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={onChange}
      />
    </div>
  );
}
