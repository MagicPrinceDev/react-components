import { RlsComponent } from '../../definitions';
import './Poster.css';

export function RlsPoster({ children, rlsTheme }: RlsComponent) {
  return (
    <div className="rls-poster" rls-theme={rlsTheme}>
      {children}
    </div>
  );
}
