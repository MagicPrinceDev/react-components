import { ReactControl } from '@rolster/react-forms';
import { renderClassStatus } from '../../../helpers/css';
import { RlsMessageIcon, RlsInputMoney } from '../../atoms';
import { RlsComponent } from '../../definitions';
import './FieldMoney.css';

interface FieldMoneyProps extends RlsComponent {
  decimals?: boolean;
  disabled?: boolean;
  formControl?: ReactControl<HTMLInputElement, number>;
  placeholder?: string;
  symbol?: string;
  value?: number;
  onValue?: (value: number) => void;
}

export function RlsFieldMoney({
  children,
  decimals,
  disabled,
  formControl,
  placeholder,
  symbol,
  rlsTheme,
  value,
  onValue
}: FieldMoneyProps) {
  return (
    <div
      className={renderClassStatus(
        'rls-field-box',
        {
          focused: formControl?.focused,
          error: formControl?.wrong,
          disabled: formControl?.disabled || disabled
        },
        'rls-field-money'
      )}
      rls-theme={rlsTheme}
    >
      {children && <label className="rls-field-box__label">{children}</label>}

      <div className="rls-field-box__component">
        <div className="rls-field-box__body">
          <RlsInputMoney
            formControl={formControl}
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            symbol={symbol}
            decimals={decimals}
            onValue={onValue}
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
