import { useEffect, useState } from 'react';
import { ReactControl } from '../../../hooks';
import { renderClassStatus } from '../../../utils/css';
import { RlsRadioButton } from '../../atoms';
import { RlsComponent } from '../../definitions';
import './RadioButtonLabel.css';

interface RadioButtonLabel extends RlsComponent {
  disabled?: boolean;
  extended?: boolean;
  formControl?: ReactControl<HTMLElement>;
  value?: any;
}

export function RlsRadioButtonLabel({
  children,
  disabled,
  extended,
  formControl,
  rlsTheme,
  value
}: RadioButtonLabel) {
  const [checked, setChecked] = useState(formControl?.state || false);

  useEffect(() => {
    setChecked(formControl?.state === value);
  }, [formControl?.state]);

  function onSelect(): void {
    if (formControl) {
      formControl?.setState(value);
    }
  }

  return (
    <div
      className={renderClassStatus('rls-radiobutton-label', {
        disabled,
        extended
      })}
      rls-theme={rlsTheme}
    >
      <div className="rls-radiobutton-label__component" onClick={onSelect}>
        <RlsRadioButton checked={checked} disabled={disabled} />
      </div>
      <label className="rls-radiobutton-label__text">{children}</label>
    </div>
  );
}
