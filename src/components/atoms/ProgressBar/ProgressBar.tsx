import { renderClassStatus } from '../../../utils/css';
import { RlsComponent } from '../../definitions';
import './ProgressBar.css';

interface ProgressBar extends RlsComponent {
  indeterminate?: boolean;
  percentage?: number;
}

export function RlsProgressBar({
  indeterminate,
  percentage,
  rlsTheme
}: ProgressBar) {
  return (
    <div
      className={renderClassStatus('rls-progress-bar', { indeterminate })}
      rls-theme={rlsTheme}
    >
      <div
        className="rls-progress-bar__component"
        style={{ width: `${percentage || 0}%` }}
      ></div>
    </div>
  );
}
