import { renderClassStatus } from '../../../utils/css';
import { RlsComponent } from '../../definitions';
import './CheckBox.css';

interface CheckBox extends RlsComponent {
  checked: boolean;
  disabled?: boolean;
}

export function RlsCheckBox({ checked, disabled, rlsTheme }: CheckBox) {
  return (
    <div
      className={renderClassStatus('rls-checkbox', { checked, disabled })}
      rls-theme={rlsTheme}
    >
      <div className="rls-checkbox__component"></div>
    </div>
  );
}
