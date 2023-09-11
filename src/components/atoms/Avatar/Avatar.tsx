import { renderClassStatus } from '../../../utils/css';
import { RlsComponent } from '../../definitions';
import './Avatar.css';

interface Avatar extends RlsComponent {
  rounded?: boolean;
  skeleton?: boolean;
}

export function RlsAvatar({ children, rounded, skeleton, rlsTheme }: Avatar) {
  return (
    <div
      className={renderClassStatus('rls-avatar', { rounded, skeleton })}
      rls-theme={rlsTheme}
    >
      {children}
    </div>
  );
}
