import { RlsComponent } from '../../definitions';

export function RlsLabel({ children, rlsTheme }: RlsComponent) {
  return (
    <label className="rls-label" rls-theme={rlsTheme}>
      {children}
    </label>
  );
}
