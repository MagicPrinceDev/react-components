import { RlsComponent } from '../../definitions';
import './Skeleton.css';

export function XftSkeleton({ rlsTheme }: RlsComponent) {
  return <div className="rls-skeleton" rls-theme={rlsTheme}></div>;
}
