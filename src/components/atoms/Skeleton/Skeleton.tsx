import { RlsComponent } from '../../definitions';
import './Skeleton.css';

export function RlsSkeleton({ rlsTheme }: RlsComponent) {
  return <div className="rls-skeleton" rls-theme={rlsTheme}></div>;
}
