import { RlsComponent } from '../../definitions';
import './Card.css';

export function RlsCard({ children, rlsTheme }: RlsComponent) {
  return (
    <div className="rls-card" rls-theme={rlsTheme}>
      <div className="rls-card__content">{children}</div>
    </div>
  );
}
