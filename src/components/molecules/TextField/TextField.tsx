import { ReactControl } from '@rolster/react-forms';
import { renderClassStatus } from '../../../utils/css';
import { RlsMessageIcon, RlsInputText } from '../../atoms';
import { RlsComponent } from '../../definitions';
import './TextField.css';

interface TextField extends RlsComponent {
  disabled?: boolean;
  formControl?: ReactControl<HTMLInputElement, string>;
  onValue?: (value: string) => void;
  placeholder?: string;
  value?: string;
}

export function RlsTextField({
  children,
  disabled,
  formControl,
  onValue,
  placeholder,
  rlsTheme,
  value
}: TextField) {
  return (
    <div
      className={renderClassStatus(
        'rls-box-field',
        {
          focused: formControl?.focused,
          error: formControl?.touched && !formControl?.valid,
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
