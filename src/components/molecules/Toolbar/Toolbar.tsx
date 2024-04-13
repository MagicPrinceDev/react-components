import { ReactNode } from 'react';
import { RlsComponent } from '../../definitions';
import './Toolbar.css';

interface ToolbarProps extends RlsComponent {
  actions?: ReactNode[];
  subtitle?: ReactNode;
}

export function RlsToolbar({ actions, children, subtitle }: ToolbarProps) {
  return (
    <div className="rls-toolbar">
      <div className="rls-toolbar__description">
        {children && <label className="rls-toolbar__title">{children}</label>}
        {subtitle && (
          <label className="rls-toolbar__subtitle smalltext-semibold">
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
