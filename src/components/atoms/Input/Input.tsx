import { ReactControl } from '@rolster/react-forms';
import { HTMLInputTypeAttribute, useState } from 'react';
import { renderClassStatus } from '../../../utils/css';
import { RlsComponent } from '../../definitions';
import './Input.css';

interface Input extends RlsComponent {
  disabled?: boolean;
  formControl?: ReactControl<HTMLInputElement>;
  onValue?: (value: any) => void;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  value?: any;
}

export function RlsInput({
  children,
  disabled,
  formControl,
  onValue,
  placeholder,
  type,
  value
}: Input) {
  const [focused, setFocused] = useState(false);

  function onChange(event: any): void {
    switch (type) {
      case 'number':
        setState(+event.target.value);
        break;
      default:
        setState(event.target.value);
        break;
    }
  }

  function setState(value: string | number): void {
    formControl?.setState(value);

    if (onValue) {
      onValue(value);
    }
  }

  function onFocus(): void {
    formControl?.focus();
    setFocused(true);
  }

  function onBlur(): void {
    if (formControl && !formControl.touched) {
      formControl.touch();
    }

    formControl?.blur();
    setFocused(false);
  }

  return (
    <div
      className={renderClassStatus('rls-input', {
        focused: formControl?.focused || focused,
        disabled: formControl?.disabled || disabled
      })}
    >
      <input
        ref={formControl?.elementRef}
        className="rls-input__component"
        autoComplete="off"
        type={type || 'text'}
        placeholder={placeholder}
        disabled={formControl?.disabled || disabled}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={onChange}
        value={formControl?.state || value || ''}
      />
      <span className="rls-input__value">{children}</span>
    </div>
  );
}
