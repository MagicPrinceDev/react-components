import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import './Avatar.css';

interface AvatarProps extends RlsComponent {
  rounded?: boolean;
  skeleton?: boolean;
}

export function RlsAvatar({ children, rounded, skeleton, rlsTheme }: AvatarProps) {
  return (
    <div
      className={renderClassStatus('rls-avatar', { rounded, skeleton })}
      rls-theme={rlsTheme}
    >
      {children}
    </div>
  );
}
