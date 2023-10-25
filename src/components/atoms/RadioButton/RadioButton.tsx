import { renderClassStatus } from '../../../utils/css';
import { RlsComponent } from '../../definitions';
import './RadioButton.css';

interface RadioButton extends RlsComponent {
  checked: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export function RlsRadioButton({
  checked,
  disabled,
  onClick,
  rlsTheme
}: RadioButton) {
  return (
    <div
      className={renderClassStatus('rls-radiobutton', { checked, disabled })}
      onClick={onClick}
      rls-theme={rlsTheme}
    >
      <div className="rls-radiobutton__component"></div>
    </div>
  );
}
