import { ReactControl } from '@rolster/react-forms';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import './Switch.css';

interface SwitchProps extends RlsComponent {
  checked: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

interface Props extends RlsComponent {
  disabled?: boolean;
  formControl: ReactControl<HTMLElement, boolean>;
}

export function RlsSwitch({
  checked,
  disabled,
  rlsTheme,
  onClick
}: SwitchProps) {
  return (
    <div
      className={renderClassStatus('rls-switch', { checked, disabled })}
      onClick={onClick}
      rls-theme={rlsTheme}
    >
      <div className="rls-switch__component">
        <div className="rls-switch__component__element"></div>
        <div className="rls-switch__component__bar"></div>
      </div>
    </div>
  );
}

export function RlsSwitchControl({ formControl, disabled, rlsTheme }: Props) {
  return (
    <RlsSwitch
      checked={formControl.value || false}
      disabled={disabled}
      onClick={() => {
        formControl.setValue(!formControl.value);
      }}
      rlsTheme={rlsTheme}
    />
  );
}
