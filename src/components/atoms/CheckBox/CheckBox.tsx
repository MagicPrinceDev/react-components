import { renderClassStatus } from '../../../utils/css';
import { RlsComponent } from '../../definitions';
import './CheckBox.css';

interface CheckBox extends RlsComponent {
  checked: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export function RlsCheckBox({
  checked,
  disabled,
  onClick,
  rlsTheme
}: CheckBox) {
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
