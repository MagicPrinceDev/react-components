import { renderClassStatus } from '../../../utils/css';
import { RlsComponent } from '../../definitions';

interface DatatableCell extends RlsComponent {
  className?: string;
  control?: boolean;
}

interface DatatableRow extends RlsComponent {
  className?: string;
}

interface Datatable extends RlsComponent {
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
}: DatatableCell) {
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

export function RlsDatatableData({ children, className }: DatatableRow) {
  return <tr className={`rls-datatable__data ${className}`}>{children}</tr>;
}

export function RlsDatatableCell({
  children,
  className,
  control
}: DatatableCell) {
  return (
    <th
      className={
        `${className} ` + renderClassStatus('rls-datatable__cell', { control })
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
}: Datatable) {
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
