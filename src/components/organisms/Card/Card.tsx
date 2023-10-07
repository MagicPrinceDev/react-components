import { renderClassStatus } from '../../../utils/css';
import { RlsComponent } from '../../definitions';
import './Card.css';

interface Card extends RlsComponent {
  outline?: boolean;
}

export function RlsCard({ children, outline, rlsTheme }: Card) {
  return (
    <div
      className={renderClassStatus('rls-card', { outline })}
      rls-theme={rlsTheme}
    >
      <div className="rls-card__content">{children}</div>
    </div>
  );
}
