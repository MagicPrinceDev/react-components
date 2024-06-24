import { ReactControl } from '@rolster/react-forms';
import { useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsButtonAction, RlsMessageIcon, RlsInputPassword } from '../../atoms';
import { RlsComponent } from '../../definitions';
import './FieldPassword.css';

interface FieldPasswordProps extends RlsComponent {
  disabled?: boolean;
  formControl?: ReactControl<HTMLInputElement, string>;
  placeholder?: string;
}

export function RlsFieldPassword({
  children,
  disabled,
  formControl,
  placeholder,
  rlsTheme
}: FieldPasswordProps) {
  const [password, setPassword] = useState(true);

  function onToggleInput(): void {
    setPassword(!password);
  }

  return (
    <div
      className={renderClassStatus(
        ' rls-field-box',
        {
          focused: formControl?.focused,
          error: formControl?.wrong,
          disabled: formControl?.disabled || disabled
        },
        'rls-field-password'
      )}
      rls-theme={rlsTheme}
    >
      {children && <label className="rls-field-box__label">{children}</label>}

      <div className="rls-field-box__component">
        <div className="rls-field-box__body">
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
        <div className="rls-field-box__error">
          <RlsMessageIcon icon="alert-triangle" rlsTheme="danger">
            {formControl.error.message}
          </RlsMessageIcon>
        </div>
      )}
    </div>
  );
}
