import { renderClassStatus } from '../../../utils/css';
import { RlsComponent } from '../../definitions';
import './RadioButton.css';

interface RadioButton extends RlsComponent {
  checked: boolean;
  disabled?: boolean;
}

export function RlsRadioButton({ checked, disabled, rlsTheme }: RadioButton) {
  return (
    <div
      className={renderClassStatus('rls-radiobutton', { checked, disabled })}
      rls-theme={rlsTheme}
    >
      <div className="rls-radiobutton__component"></div>
    </div>
  );
}
