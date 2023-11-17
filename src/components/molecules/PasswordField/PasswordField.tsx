import { useState } from 'react';
import { ReactInputControl } from '../../../hooks';
import { renderClassStatus } from '../../../utils/css';
import {
  RlsButtonAction,
  RlsErrorMessage,
  RlsInputPassword
} from '../../atoms';
import { RlsComponent } from '../../definitions';
import './PasswordField.css';

interface PasswordFieldProps extends RlsComponent {
  disabled?: boolean;
  formControl?: ReactInputControl<string>;
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
      className={renderClassStatus(
        ' rls-box-field',
        {
          active: formControl?.active,
          error: formControl?.touched && !formControl?.valid,
          disabled: formControl?.disabled || disabled
        },
        'rls-password-field'
      )}
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

      {formControl?.touched && formControl?.error && (
        <div className="rls-box-field__error">
          <RlsErrorMessage icon="alert-triangle" rlsTheme="danger">
            {formControl.error.message}
          </RlsErrorMessage>
        </div>
      )}
    </div>
  );
}
