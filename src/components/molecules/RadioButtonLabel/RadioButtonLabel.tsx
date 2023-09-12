import { useEffect, useState } from 'react';
import { ReactControl } from '../../../hooks';
import { renderClassStatus } from '../../../utils/css';
import { RlsRadioButton } from '../../atoms';
import { RlsComponent } from '../../definitions';
import './RadioButtonLabel.css';

interface RadioButtonLabel extends RlsComponent {
  disabled?: false;
  formControl?: ReactControl<HTMLElement>;
  value?: any;
}

export function RlsRadioButtonLabel({
  children,
  disabled,
  formControl,
  rlsTheme,
  value
}: RadioButtonLabel) {
  const [checked, setChecked] = useState(formControl?.value || false);

  useEffect(() => {
    setChecked(formControl?.value === value);
  }, [formControl?.value]);

  function onToggle(): void {
    if (formControl) {
      formControl?.setState(value);
    }
  }

  return (
    <div
      className={renderClassStatus('rls-radiobutton-label', { disabled })}
      rls-theme={rlsTheme}
    >
      <div className="rls-radiobutton-label__component" onClick={onToggle}>
        <RlsRadioButton checked={checked} disabled={disabled} />
      </div>
      <label className="rls-radiobutton-label__text">{children}</label>
    </div>
  );
}
