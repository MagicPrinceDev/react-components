import { renderClassStatus } from '../../../utils/css';
import { RlsComponent } from '../../definitions';
import './Switch.css';

interface Switch extends RlsComponent {
  checked: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export function RlsSwitch({
  checked,
  disabled,
  rlsTheme,
  onClick
}: Switch) {
  return (
    <div
      className={renderClassStatus('rls-switch', { checked, disabled })}
      onClick={onClick}
      rls-theme={rlsTheme}
    >
      <div className="rls-switch__component"></div>
    </div>
  );
}
