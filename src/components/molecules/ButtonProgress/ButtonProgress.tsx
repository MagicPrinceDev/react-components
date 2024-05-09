import { MouseEventHandler } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsButtonAction, RlsProgressCircular } from '../../atoms';
import { RlsTheme } from '../../definitions';
import './ButtonProgress.css';

interface ButtonProgressProps {
  icon: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  progressing?: boolean;
  rlsTheme?: RlsTheme;
}

export function RlsButtonProgress({
  icon,
  disabled,
  onClick,
  progressing,
  rlsTheme
}: ButtonProgressProps) {
  return (
    <div
      className={renderClassStatus('rls-button-progress', { progressing })}
      rls-theme={rlsTheme}
    >
      {!progressing && (
        <RlsButtonAction icon={icon} onClick={onClick} disabled={disabled} />
      )}
      {progressing && <RlsProgressCircular />}
    </div>
  );
}
