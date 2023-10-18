import { ReactControl } from '../../../hooks';
import { renderClassStatus } from '../../../utils/css';
import { RlsInputNumber } from '../../atoms';
import { RlsComponent } from '../../definitions';
import './NumberField.css';

interface NumberField extends RlsComponent {
  defaultValue?: number;
  disabled?: boolean;
  formControl?: ReactControl<HTMLInputElement, number>;
  onValue?: (value: number) => void;
  placeholder?: string;
}

export function RlsNumberField({
  children,
  defaultValue,
  disabled,
  formControl,
  onValue,
  placeholder,
  rlsTheme
}: NumberField) {
  return (
    <div
      className={
        'rls-number-field ' +
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
          <RlsInputNumber
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
