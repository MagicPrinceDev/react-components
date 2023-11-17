import { RlsComponent } from '../../definitions';
import { RlsIcon } from '../Icon/Icon';
import './ErrorMessage.css';

interface ErrorMessage extends RlsComponent {
  icon?: string;
}

export function RlsErrorMessage({ icon, children, rlsTheme }: ErrorMessage) {
  return (
    <div className="rls-error-message" rls-theme={rlsTheme}>
      {icon && <RlsIcon value={icon} />}
      <span className="caption-regular truncate">{children}</span>
    </div>
  );
}
