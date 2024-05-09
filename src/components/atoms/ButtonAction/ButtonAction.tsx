import { MouseEventHandler } from 'react';
import { RlsComponent } from '../../definitions';
import { RlsIcon } from '../Icon/Icon';
import './ButtonAction.css';

interface ButtonActionProps extends RlsComponent {
  icon: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  tooltip?: string;
}

export function RlsButtonAction({
  icon,
  disabled,
  tooltip,
  onClick
}: ButtonActionProps) {
  return (
    <button className="rls-button-action" onClick={onClick} disabled={disabled}>
      <div className="rls-button-action__content">
        <RlsIcon value={icon} />
      </div>
      {tooltip && (
        <div className="rls-button-action__tooltip caption-semibold">
          <span>{tooltip}</span>
        </div>
      )}
    </button>
  );
}
