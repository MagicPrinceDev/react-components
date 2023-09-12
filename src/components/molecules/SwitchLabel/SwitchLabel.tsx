import { useEffect, useState } from 'react';
import { ReactControl } from '../../../hooks';
import { renderClassStatus } from '../../../utils/css';
import { RlsSwitch } from '../../atoms';
import { RlsComponent } from '../../definitions';
import './SwitchLabel.css';

interface SwitchLabelProps extends RlsComponent {
  disabled?: false;
  formControl?: ReactControl<HTMLElement, boolean>;
}

export function RlsSwitchLabel({
  children,
  disabled,
  formControl,
  rlsTheme
}: SwitchLabelProps) {
  const [checked, setChecked] = useState(formControl?.value || false);

  useEffect(() => {
    setChecked(formControl?.value || false);
  }, [formControl?.value]);

  function onToggle(): void {
    if (formControl) {
      formControl?.setState(!formControl.value);
    } else {
      setChecked(!checked);
    }
  }

  return (
    <div
      className={renderClassStatus('rls-switch-label', { disabled })}
      rls-theme={rlsTheme}
    >
      <div className="rls-switch-label__component" onClick={onToggle}>
        <RlsSwitch checked={checked} disabled={disabled} />
      </div>
      <label className="rls-switch-label__text">{children}</label>
    </div>
  );
}
