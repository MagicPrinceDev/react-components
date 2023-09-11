import { MouseEventHandler } from 'react';
import { RlsComponent } from '../../definitions';
import { RlsIcon } from '../Icon/Icon';
import './ButtonAction.css';

interface ButtonAction extends RlsComponent {
  icon: string;
  disabled?: boolean;
  tooltip?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function RlsButtonAction({
  icon,
  disabled,
  tooltip,
  onClick
}: ButtonAction) {
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
