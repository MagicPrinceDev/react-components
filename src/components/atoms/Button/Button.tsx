import { MouseEventHandler } from 'react';
import { RlsComponent } from '../../definitions';
import { RlsIcon } from '../Icon/Icon';
import './Button.css';

export type ButtonType = 'raised' | 'flat' | 'outline' | 'ghost';

interface Button extends RlsComponent {
  type: ButtonType;
  disabled?: boolean;
  prefixIcon?: string;
  suffixIcon?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function RlsButton({
  type,
  children,
  disabled,
  prefixIcon,
  suffixIcon,
  rlsTheme,
  onClick
}: Button) {
  return (
    <button
      className="rls-button"
      onClick={onClick}
      rls-theme={rlsTheme}
      disabled={disabled}
    >
      <div className={`rls-button__content rls-button__content--${type}`}>
        {prefixIcon && <RlsIcon value={prefixIcon} />}
        {children && (
          <div className="rls-button__label truncate">{children}</div>
        )}
        {suffixIcon && <RlsIcon value={suffixIcon} />}
      </div>
    </button>
  );
}
