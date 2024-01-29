import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import './FormNavigation.css';

interface FormNavigationProps extends RlsComponent {
  visible?: boolean;
}

export function RlsFormNavigation({
  children,
  visible,
  rlsTheme
}: FormNavigationProps) {
  return (
    <div
      className={renderClassStatus('rls-form-navigation', { visible })}
      rls-theme={rlsTheme}
    >
      <div className="rls-form-navigation__body">{children}</div>
    </div>
  );
}
