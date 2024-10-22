import { ReactControl } from '@rolster/react-forms';
import { useEffect, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsSwitch } from '../../atoms';
import { RlsComponent } from '../../definitions';
import './LabelSwitch.css';

interface LabelSwitchProps extends RlsComponent {
  disabled?: boolean;
  extended?: boolean;
  formControl?: ReactControl<HTMLElement, boolean>;
}

export function RlsLabelSwitch({
  children,
  disabled,
  extended,
  formControl,
  rlsTheme
}: LabelSwitchProps) {
  const [checked, setChecked] = useState(!!formControl?.value);

  useEffect(() => {
    setChecked(!!formControl?.value);
  }, [formControl?.value]);

  function onToggle(): void {
    if (formControl) {
      formControl?.setValue(!formControl.value);
    } else {
      setChecked(!checked);
    }
  }

  return (
    <div
      className={renderClassStatus('rls-label-switch', { disabled, extended })}
      rls-theme={rlsTheme}
    >
      <div className="rls-label-switch__component" onClick={onToggle}>
        <RlsSwitch checked={checked} disabled={disabled} />
      </div>
      <label className="rls-label-switch__text">{children}</label>
    </div>
  );
}
