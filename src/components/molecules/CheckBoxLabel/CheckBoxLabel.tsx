import { useEffect, useState } from 'react';
import { renderClassStatus } from '../../../utils/css';
import { ReactControl } from '../../../hooks';
import { RlsCheckBox } from '../../atoms';
import { RlsComponent } from '../../definitions';
import './CheckBoxLabel.css';

interface CheckBoxLabel extends RlsComponent {
  disabled?: boolean;
  extended?: boolean;
  formControl?: ReactControl<HTMLElement, boolean>;
}

export function RlsCheckBoxLabel({
  children,
  disabled,
  extended,
  formControl,
  rlsTheme
}: CheckBoxLabel) {
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
      className={renderClassStatus('rls-checkbox-label', {
        disabled,
        extended
      })}
      rls-theme={rlsTheme}
    >
      <div className="rls-checkbox-label__component" onClick={onToggle}>
        <RlsCheckBox checked={checked} disabled={disabled} />
      </div>
      <label className="rls-checkbox-label__text">{children}</label>
    </div>
  );
}
