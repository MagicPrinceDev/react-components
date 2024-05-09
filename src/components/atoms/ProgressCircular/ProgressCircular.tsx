import { RlsTheme } from '../../definitions';
import './ProgressCircular.css';

interface ProgressCircularProps {
  rlsTheme?: RlsTheme;
}

export function RlsProgressCircular({ rlsTheme }: ProgressCircularProps) {
  return (
    <div className="rls-progress-circular" rls-theme={rlsTheme}>
      <svg className="rls-progress-circular__svg" viewBox="0 0 36 36">
        <circle
          className="rls-progress-circular__circle"
          cx="18"
          cy="18"
          r="12"
        ></circle>
      </svg>
    </div>
  );
}
