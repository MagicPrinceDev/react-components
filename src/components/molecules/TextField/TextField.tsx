import { ReactInputControl } from '../../../hooks';
import { renderClassStatus } from '../../../utils/css';
import { RlsErrorMessage, RlsInputText } from '../../atoms';
import { RlsComponent } from '../../definitions';
import './TextField.css';

interface TextField extends RlsComponent {
  disabled?: boolean;
  formControl?: ReactInputControl<string>;
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
          active: formControl?.active,
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
          <RlsErrorMessage icon="alert-triangle" rlsTheme="danger">
            {formControl.error.message}
          </RlsErrorMessage>
        </div>
      )}
    </div>
  );
}
