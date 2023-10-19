import { ReactControl } from '../../../hooks';
import { renderClassStatus } from '../../../utils/css';
import { RlsInputMoney } from '../../atoms';
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
      className={
        'rls-money-field ' +
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
      {formControl?.dirty && formControl?.error && (
        <div className="rls-box-field__helper rls-box-field__helper--error">
          <span>{formControl?.error.message}</span>
        </div>
      )}
    </div>
  );
}
