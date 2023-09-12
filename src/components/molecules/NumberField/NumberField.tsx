import { ReactControl } from '../../../hooks';
import { renderClassStatus } from '../../../utils/css';
import { RlsInputNumber } from '../../atoms';
import { RlsComponent } from '../../definitions';
import './NumberField.css';

interface NumberField extends RlsComponent {
  disabled?: boolean;
  formControl?: ReactControl<HTMLInputElement, number>;
  placeholder?: string;
}

export function RlsNumberField({
  children,
  disabled,
  formControl,
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
          disabled
        })
      }
      rls-theme={rlsTheme}
    >
      {children && <label className="rls-box-field__label">{children}</label>}
      <div className="rls-box-field__component">
        <div className="rls-box-field__body">
          <RlsInputNumber
            formControl={formControl}
            disabled={disabled}
            placeholder={placeholder}
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
