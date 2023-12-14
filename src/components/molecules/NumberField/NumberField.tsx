import { ReactControl } from '@rolster/react-forms';
import { renderClassStatus } from '../../../utils/css';
import { RlsMessageIcon, RlsInputNumber } from '../../atoms';
import { RlsComponent } from '../../definitions';
import './NumberField.css';

interface NumberFieldProps extends RlsComponent {
  disabled?: boolean;
  formControl?: ReactControl<HTMLInputElement, number>;
  placeholder?: string;
  value?: number;
  onValue?: (value: number) => void;
}

export function RlsNumberField({
  children,
  disabled,
  formControl,
  placeholder,
  rlsTheme,
  value,
  onValue
}: NumberFieldProps) {
  return (
    <div
      className={renderClassStatus(
        'rls-box-field',
        {
          focused: formControl?.focused,
          error: formControl?.touched && !formControl?.valid,
          disabled: formControl?.disabled || disabled
        },
        'rls-number-field'
      )}
      rls-theme={rlsTheme}
    >
      {children && <label className="rls-box-field__label">{children}</label>}

      <div className="rls-box-field__component">
        <div className="rls-box-field__body">
          <RlsInputNumber
            formControl={formControl}
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            onValue={onValue}
          />
        </div>
      </div>

      {formControl?.touched && formControl?.error && (
        <div className="rls-box-field__error">
          <RlsMessageIcon icon="alert-triangle" rlsTheme="danger">
            {formControl.error.message}
          </RlsMessageIcon>
        </div>
      )}
    </div>
  );
}
