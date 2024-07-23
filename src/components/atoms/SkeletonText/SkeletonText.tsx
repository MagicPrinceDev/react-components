import { RlsComponent } from '../../definitions';
import { RlsSkeleton } from '../Skeleton/Skeleton';
import './SkeletonText.css';

interface SkeletonTextProps extends RlsComponent {
  active?: boolean;
}

export function RlsSkeletonText({
  active,
  children,
  rlsTheme
}: SkeletonTextProps) {
  return (
    <div className="rls-skeleton-text" rls-theme={rlsTheme}>
      {active ? (
        <RlsSkeleton />
      ) : (
        <span className="rls-skeleton-text__value">{children}</span>
      )}
    </div>
  );
}
