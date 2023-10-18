import { useState } from 'react';
import { ReactControl } from '../../../hooks';
import { renderClassStatus } from '../../../utils/css';
import { RlsButtonAction, RlsInputPassword } from '../../atoms';
import { RlsComponent } from '../../definitions';
import './PasswordField.css';

interface PasswordFieldProps extends RlsComponent {
  disabled?: boolean;
  formControl?: ReactControl<HTMLInputElement, string>;
  placeholder?: string;
}

export function RlsPasswordField({
  children,
  disabled,
  formControl,
  placeholder,
  rlsTheme
}: PasswordFieldProps) {
  const [password, setPassword] = useState(true);

  function onToggleInput(): void {
    setPassword(!password);
  }

  return (
    <div
      className={
        'rls-password-field ' +
        renderClassStatus(' rls-box-field', {
          active: formControl?.active,
          error: formControl?.dirty && !formControl?.valid,
          disabled: formControl?.disabled || disabled
        })
      }
      rls-theme={rlsTheme}
    >
      {children && <label className="rls-box-field__label">{children}</label>}
      <div className="rls-box-field__component">
        <div className="rls-box-field__body">
          <RlsInputPassword
            formControl={formControl}
            disabled={disabled}
            placeholder={placeholder}
            type={password ? 'password' : 'text'}
          />

          <RlsButtonAction
            icon={password ? 'eye' : 'eye-off'}
            onClick={onToggleInput}
          />
        </div>
      </div>
      {formControl?.dirty && formControl?.error && (
        <div className="rls-box-field__helper rls-box-field__helper--error">
          <span>{formControl?.error.message}</span>
        </div>
      )}
    </div>
  );
}
