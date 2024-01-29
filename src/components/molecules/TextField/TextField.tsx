import { ReactControl } from '@rolster/react-forms';
import { renderClassStatus } from '../../../helpers/css';
import { RlsMessageIcon, RlsInputText } from '../../atoms';
import { RlsComponent } from '../../definitions';
import './TextField.css';

interface TextFieldProps extends RlsComponent {
  disabled?: boolean;
  formControl?: ReactControl<HTMLInputElement, string>;
  placeholder?: string;
  value?: string;
  onValue?: (value: string) => void;
}

export function RlsTextField({
  children,
  disabled,
  formControl,
  placeholder,
  rlsTheme,
  value,
  onValue
}: TextFieldProps) {
  return (
    <div
      className={renderClassStatus(
        'rls-box-field',
        {
          focused: formControl?.focused,
          error: formControl?.wrong,
          disabled: formControl?.disabled || disabled
        },
        'rls-text-field'
      )}
      rls-theme={rlsTheme}
    >
      {children && <label className="rls-box-field__label">{children}</label>}

      <div className="rls-box-field__component">
        <div className="rls-box-field__body">
          <RlsInputText
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
