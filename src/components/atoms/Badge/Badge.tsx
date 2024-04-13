import { RlsComponent } from '../../definitions';
import './Badge.css';

export function RlsBadge({ children, rlsTheme }: RlsComponent) {
  return (
    <div className="rls-badge" rls-theme={rlsTheme}>
      {children}
    </div>
  );
}
