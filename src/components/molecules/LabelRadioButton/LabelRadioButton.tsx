import { ReactControl } from '@rolster/react-forms';
import { useEffect, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsRadioButton } from '../../atoms';
import { RlsComponent } from '../../definitions';
import './LabelRadioButton.css';

interface LabelRadioButtonProps extends RlsComponent {
  disabled?: boolean;
  extended?: boolean;
  formControl?: ReactControl<HTMLElement>;
  value?: any;
}

export function RlsLabelRadioButton({
  children,
  disabled,
  extended,
  formControl,
  rlsTheme,
  value
}: LabelRadioButtonProps) {
  const [checked, setChecked] = useState(formControl?.state === value);

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
      className={renderClassStatus('rls-label-radiobutton', {
        disabled,
        extended
      })}
      rls-theme={rlsTheme}
    >
      <div className="rls-label-radiobutton__component" onClick={onSelect}>
        <RlsRadioButton checked={checked} disabled={disabled} />
      </div>
      <label className="rls-label-radiobutton__text">{children}</label>
    </div>
  );
}
