import { ReactControl } from '../../../hooks';
import { renderClassStatus } from '../../../utils/css';
import { RlsMessageIcon, RlsInputMoney } from '../../atoms';
import { RlsComponent } from '../../definitions';
import './MoneyField.css';

interface MoneyField extends RlsComponent {
  decimals?: boolean;
  disabled?: boolean;
  formControl?: ReactControl<HTMLInputElement, number>;
  onValue?: (value: number) => void;
  placeholder?: string;
  symbol?: string;
  value?: number;
}

export function RlsMoneyField({
  children,
  decimals,
  disabled,
  formControl,
  onValue,
  placeholder,
  symbol,
  rlsTheme,
  value
}: MoneyField) {
  return (
    <div
      className={renderClassStatus(
        'rls-box-field',
        {
          focused: formControl?.focused,
          error: formControl?.touched && !formControl?.valid,
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
