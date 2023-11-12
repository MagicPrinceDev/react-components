import { ReactControl } from '../../../hooks';
import { renderClassStatus } from '../../../utils/css';
import { RlsComponent } from '../../definitions';
import './Switch.css';

interface Switch extends RlsComponent {
  checked: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

interface SwitchControl extends RlsComponent {
  disabled?: boolean;
  formControl: ReactControl<HTMLElement, boolean>;
}

export function RlsSwitch({ checked, disabled, onClick, rlsTheme }: Switch) {
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

export function RlsSwitchControl({
  formControl,
  disabled,
  rlsTheme
}: SwitchControl) {
  return (
    <RlsSwitch
      checked={formControl.state || false}
      disabled={disabled}
      onClick={() => {
        formControl.setState(!formControl.state);
      }}
      rlsTheme={rlsTheme}
    />
  );
}
