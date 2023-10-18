import { HTMLInputTypeAttribute, useState } from 'react';
import { ReactControl } from '../../../hooks';
import { renderClassStatus } from '../../../utils/css';
import { RlsComponent } from '../../definitions';
import './Input.css';

interface Input extends RlsComponent {
  defaultValue?: any;
  disabled?: boolean;
  formControl?: ReactControl<HTMLInputElement>;
  onValue?: (value: any) => void;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
}

export function RlsInput({
  children,
  defaultValue,
  disabled,
  formControl,
  onValue,
  placeholder,
  type
}: Input) {
  const [active, setActive] = useState(false);

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
    formControl?.setActive(true);
    setActive(true);
  }

  function onBlur(): void {
    formControl?.setDirty(true);
    formControl?.setActive(false);
    setActive(false);
  }

  return (
    <div
      className={renderClassStatus('rls-input', {
        active: formControl?.active || active,
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
        value={formControl?.state || defaultValue || ''}
      />
      <span className="rls-input__value">{children}</span>
    </div>
  );
}
