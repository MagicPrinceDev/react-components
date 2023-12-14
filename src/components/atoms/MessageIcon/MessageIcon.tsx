import { RlsComponent } from '../../definitions';
import { RlsIcon } from '../Icon/Icon';
import './MessageIcon.css';

interface MessageIconProps extends RlsComponent {
  icon?: string;
}

export function RlsMessageIcon({ icon, children, rlsTheme }: MessageIconProps) {
  return (
    <div className="rls-message-icon" rls-theme={rlsTheme}>
      {icon && <RlsIcon value={icon} />}
      <span className="caption-regular truncate">{children}</span>
    </div>
  );
}
