import { useState } from 'react';
import { ReactControl } from '../../../hooks';
import { renderClassStatus } from '../../../utils/css';
import { RlsComponent } from '../../definitions';
import './InputPassword.css';

type InputPasswordType = 'password' | 'text';

interface InputPassword extends RlsComponent {
  disabled?: boolean;
  formControl?: ReactControl<HTMLInputElement, string>;
  onValue?: (value: string) => void;
  placeholder?: string;
  type?: InputPasswordType;
}

export function RlsInputPassword({
  disabled,
  formControl,
  onValue,
  placeholder,
  type
}: InputPassword) {
  const [active, setActive] = useState(false);

  function onChange(event: any): void {
    formControl?.setState(event.target.value);

    if (onValue) {
      onValue(event.target.value);
    }
  }

  function onFocus() {
    formControl?.setActive(true);
    setActive(true);
  }

  function onBlur() {
    if (formControl && !formControl.touched) {
      formControl.setTouched(true);
    }

    formControl?.setActive(false);
    setActive(false);
  }

  return (
    <div
      className={renderClassStatus('rls-input-password', {
        active: formControl?.active || active,
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
