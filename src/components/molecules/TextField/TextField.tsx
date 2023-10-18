import { ReactControl } from '../../../hooks';
import { renderClassStatus } from '../../../utils/css';
import { RlsInputText } from '../../atoms';
import { RlsComponent } from '../../definitions';
import './TextField.css';

interface TextField extends RlsComponent {
  defaultValue?: string;
  disabled?: boolean;
  formControl?: ReactControl<HTMLInputElement, string>;
  onValue?: (value: string) => void;
  placeholder?: string;
}

export function RlsTextField({
  children,
  defaultValue,
  disabled,
  formControl,
  onValue,
  placeholder,
  rlsTheme
}: TextField) {
  return (
    <div
      className={
        'rls-text-field ' +
        renderClassStatus('rls-box-field', {
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
          <RlsInputText
            defaultValue={defaultValue}
            formControl={formControl}
            disabled={disabled}
            placeholder={placeholder}
            onValue={onValue}
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
