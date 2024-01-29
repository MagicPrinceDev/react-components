import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import './Card.css';

interface CardProps extends RlsComponent {
  outline?: boolean;
}

export function RlsCard({ children, outline, rlsTheme }: CardProps) {
  return (
    <div
      className={renderClassStatus('rls-card', { outline })}
      rls-theme={rlsTheme}
    >
      <div className="rls-card__content">{children}</div>
    </div>
  );
}
