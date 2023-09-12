import { renderClassStatus } from '../../../utils/css';
import { RlsComponent } from '../../definitions';
import './FormNavigation.css';

interface FormNavigation extends RlsComponent {
  visible?: boolean;
}

export function RlsFormNavigation({
  children,
  visible,
  rlsTheme
}: FormNavigation) {
  return (
    <div
      className={renderClassStatus('rls-form-navigation', { visible })}
      rls-theme={rlsTheme}
    >
      <div className="rls-form-navigation__body">{children}</div>
    </div>
  );
}
