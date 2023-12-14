import { renderClassStatus } from '../../../utils/css';
import { RlsComponent } from '../../definitions';

interface DatatableCellProps extends RlsComponent {
  className?: string;
  control?: boolean;
  overflow?: boolean;
}

interface DatatableRowProps extends RlsComponent {
  className?: string;
}

interface DatatableProps extends RlsComponent {
  footer?: JSX.Element;
  header?: JSX.Element;
}

export function RlsDatatableHeader({ children }: RlsComponent) {
  return <tr className="rls-datatable__header">{children}</tr>;
}

export function RlsDatatableTitle({
  children,
  className,
  control
}: DatatableCellProps) {
  return (
    <th
      className={
        `${className} ` + renderClassStatus('rls-datatable__title', { control })
      }
    >
      {children}
    </th>
  );
}

export function RlsDatatableData({ children, className }: DatatableRowProps) {
  return <tr className={`rls-datatable__data ${className}`}>{children}</tr>;
}

export function RlsDatatableCell({
  children,
  className,
  control,
  overflow
}: DatatableCellProps) {
  return (
    <th
      className={
        `${className} ` +
        renderClassStatus('rls-datatable__cell', { control, overflow })
      }
    >
      {children}
    </th>
  );
}

export function RlsDatatable({
  children,
  footer,
  header,
  rlsTheme
}: DatatableProps) {
  return (
    <div className="rls-datatable" rls-theme={rlsTheme}>
      <table>
        {header && <thead className="rls-datatable__thead">{header}</thead>}

        <tbody className="rls-datatable__tbody">{children}</tbody>
      </table>

      {footer && <div className="rls-datatable__tfooter">{footer}</div>}
    </div>
  );
}
