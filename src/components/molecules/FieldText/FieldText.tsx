import { ReactControl } from '@rolster/react-forms';
import { renderClassStatus } from '../../../helpers/css';
import { RlsInputText } from '../../atoms';
import { RlsComponent } from '../../definitions';
import { RlsMessageFormError } from '../MessageFormError/MessageFormError';
import './FieldText.css';

interface FieldTextProps extends RlsComponent {
  disabled?: boolean;
  formControl?: ReactControl<HTMLInputElement, string>;
  placeholder?: string;
  value?: string;
  onValue?: (value: string) => void;
}

export function RlsFieldText({
  children,
  disabled,
  formControl,
  placeholder,
  rlsTheme,
  value,
  onValue
}: FieldTextProps) {
  return (
    <div
      className={renderClassStatus(
        'rls-field-box',
        {
          focused: formControl?.focused,
          error: formControl?.wrong,
          disabled: formControl?.disabled || disabled
        },
        'rls-field-text'
      )}
      rls-theme={rlsTheme}
    >
      {children && <label className="rls-field-box__label">{children}</label>}

      <div className="rls-field-box__component">
        <div className="rls-field-box__body">
          <RlsInputText
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
