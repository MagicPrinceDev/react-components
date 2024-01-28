import { ReactControl } from '@rolster/react-forms';
import { renderClassStatus } from '../../../utils/css';
import { RlsMessageIcon, RlsInputMoney } from '../../atoms';
import { RlsComponent } from '../../definitions';
import './MoneyField.css';

interface MoneyFieldProps extends RlsComponent {
  decimals?: boolean;
  disabled?: boolean;
  formControl?: ReactControl<HTMLInputElement, number>;
  placeholder?: string;
  symbol?: string;
  value?: number;
  onValue?: (value: number) => void;
}

export function RlsMoneyField({
  children,
  decimals,
  disabled,
  formControl,
  placeholder,
  symbol,
  rlsTheme,
  value,
  onValue
}: MoneyFieldProps) {
  return (
    <div
      className={renderClassStatus(
        'rls-box-field',
        {
          focused: formControl?.focused,
          error: formControl?.wrong,
          disabled: formControl?.disabled || disabled
        },
        'rls-money-field'
      )}
      rls-theme={rlsTheme}
    >
      {children && <label className="rls-box-field__label">{children}</label>}

      <div className="rls-box-field__component">
        <div className="rls-box-field__body">
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
        <div className="rls-box-field__error">
          <RlsMessageIcon icon="alert-triangle" rlsTheme="danger">
            {formControl.error.message}
          </RlsMessageIcon>
        </div>
      )}
    </div>
  );
}
