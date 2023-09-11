import { renderClassStatus } from '../../../utils/css';
import { RlsComponent } from '../../definitions';
import './SkeletonText.css';

interface SkeletonText extends RlsComponent {
  active?: boolean;
}

export function RlsSkeletonText({ active, children, rlsTheme }: SkeletonText) {
  return (
    <div
      className={renderClassStatus('rls-skeleton-text', { active })}
      rls-theme={rlsTheme}
    >
      <span className="rls-skeleton-text__value">{children}</span>
    </div>
  );
}
