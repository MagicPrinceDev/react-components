import { ReactControl } from '@rolster/react-forms';
import { useEffect, useState } from 'react';
import { renderClassStatus } from '../../../utils/css';
import { RlsSwitch } from '../../atoms';
import { RlsComponent } from '../../definitions';
import './SwitchLabel.css';

interface SwitchLabelProps extends RlsComponent {
  disabled?: boolean;
  extended?: boolean;
  formControl?: ReactControl<HTMLElement, boolean>;
}

export function RlsSwitchLabel({
  children,
  disabled,
  extended,
  formControl,
  rlsTheme
}: SwitchLabelProps) {
  const [checked, setChecked] = useState(formControl?.value || false);

  useEffect(() => {
    setChecked(formControl?.state || false);
  }, [formControl?.state]);

  function onToggle(): void {
    if (formControl) {
      formControl?.setState(!formControl.state);
    } else {
      setChecked(!checked);
    }
  }

  return (
    <div
      className={renderClassStatus('rls-switch-label', { disabled, extended })}
      rls-theme={rlsTheme}
    >
      <div className="rls-switch-label__component" onClick={onToggle}>
        <RlsSwitch checked={checked} disabled={disabled} />
      </div>
      <label className="rls-switch-label__text">{children}</label>
    </div>
  );
}
