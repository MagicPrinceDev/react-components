import { ReactNode } from 'react';
import { RlsComponent } from '../../definitions';
import './Toolbar.scss';

interface Toolbar extends RlsComponent {
  actions?: ReactNode[];
  subtitle?: ReactNode;
}

export function RlsToolbar({ actions, children, subtitle }: Toolbar) {
  return (
    <div className="rls-toolbar">
      <div className="rls-toolbar__description">
        {children && <label className="rls-toolbar__title">{children}</label>}
        {subtitle && (
          <label className="rls-toolbar__subtitle caption-semibold">
            {subtitle}
          </label>
        )}
      </div>
      {actions && (
        <div className="rls-toolbar__actions">
          {actions.map((action, index) => (
            <div key={index}>{action}</div>
          ))}
        </div>
      )}
    </div>
  );
}
