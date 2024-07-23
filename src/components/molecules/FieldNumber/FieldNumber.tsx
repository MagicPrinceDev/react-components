import { ReactControl } from '@rolster/react-forms';
import { renderClassStatus } from '../../../helpers/css';
import { RlsInputNumber } from '../../atoms';
import { RlsComponent } from '../../definitions';
import { RlsMessageFormError } from '../MessageFormError/MessageFormError';
import './FieldNumber.css';

interface FieldNumberProps extends RlsComponent {
  disabled?: boolean;
  formControl?: ReactControl<HTMLInputElement, number>;
  placeholder?: string;
  value?: number;
  onValue?: (value: number) => void;
}

export function RlsFieldNumber({
  children,
  disabled,
  formControl,
  placeholder,
  rlsTheme,
  value,
  onValue
}: FieldNumberProps) {
  return (
    <div
      className={renderClassStatus(
        'rls-field-box',
        {
          focused: formControl?.focused,
          error: formControl?.wrong,
          disabled: formControl?.disabled || disabled
        },
        'rls-field-number'
      )}
      rls-theme={rlsTheme}
    >
      {children && <label className="rls-field-box__label">{children}</label>}

      <div className="rls-field-box__component">
        <div className="rls-field-box__body">
          <RlsInputNumber
            formControl={formControl}
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            onValue={onValue}
          />
        </div>
      </div>

      <RlsMessageFormError
        className="rls-field-box__error"
        formControl={formControl}
      />
    </div>
  );
}
