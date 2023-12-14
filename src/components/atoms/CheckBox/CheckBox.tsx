import { ReactControl } from '@rolster/react-forms';
import { renderClassStatus } from '../../../utils/css';
import { RlsComponent } from '../../definitions';
import './CheckBox.css';

interface CheckBoxProps extends RlsComponent {
  checked: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

interface CheckBoxControlProps extends RlsComponent {
  disabled?: boolean;
  formControl: ReactControl<HTMLElement, boolean>;
}

export function RlsCheckBox({
  checked,
  disabled,
  onClick,
  rlsTheme
}: CheckBoxProps) {
  return (
    <div
      className={renderClassStatus('rls-checkbox', { checked, disabled })}
      onClick={onClick}
      rls-theme={rlsTheme}
    >
      <div className="rls-checkbox__component"></div>
    </div>
  );
}

export function RlsCheckBoxControl({
  formControl,
  disabled,
  rlsTheme
}: CheckBoxControlProps) {
  return (
    <RlsCheckBox
      checked={formControl.state || false}
      disabled={disabled}
      onClick={() => {
        formControl.setState(!formControl.state);
      }}
      rlsTheme={rlsTheme}
    />
  );
}
