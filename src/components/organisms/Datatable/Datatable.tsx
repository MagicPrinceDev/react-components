import { renderClassStatus } from '../../../helpers/css';
import { DatatableHook } from '../../../hooks';
import { RlsComponent } from '../../definitions';

interface DatatableCellProps extends RlsComponent {
  className?: string;
  control?: boolean;
  overflow?: boolean;
}

interface DatatableDataProps extends RlsComponent {
  className?: string;
  error?: boolean;
}

interface DatatableProps extends RlsComponent {
  datatable?: DatatableHook;
  footer?: JSX.Element;
  header?: JSX.Element;
  summary?: JSX.Element;
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
      className={renderClassStatus(
        'rls-datatable__title',
        { control },
        className
      ).trim()}
    >
      {children}
    </th>
  );
}

export function RlsDatatableData({
  children,
  className,
  error
}: DatatableDataProps) {
  return (
    <tr
      className={renderClassStatus(
        'rls-datatable__data',
        { error },
        className
      ).trim()}
    >
      {children}
    </tr>
  );
}

export function RlsDatatableCell({
  children,
  className,
  control,
  overflow
}: DatatableCellProps) {
  return (
    <th
      className={renderClassStatus(
        'rls-datatable__cell',
        { control, overflow },
        className
      ).trim()}
    >
      {children}
    </th>
  );
}

export function RlsDatatableTotals({
  children,
  className,
  error
}: DatatableDataProps) {
  return (
    <div
      className={renderClassStatus(
        'rls-datatable__totals',
        { error },
        className
      ).trim()}
    >
      {children}
    </div>
  );
}

export function RlsDatatableInfo({
  children,
  className,
  control,
  overflow
}: DatatableCellProps) {
  return (
    <div
      className={renderClassStatus(
        'rls-datatable__info',
        { control, overflow },
        className
      ).trim()}
    >
      {children}
    </div>
  );
}

export function RlsDatatable({
  children,
  datatable,
  footer,
  header,
  rlsTheme,
  summary
}: DatatableProps) {
  return (
    <div
      className={renderClassStatus('rls-datatable', {
        scrolleable: datatable?.scrolleable
      })}
      rls-theme={rlsTheme}
    >
      <table>
        {header && <thead className="rls-datatable__thead">{header}</thead>}

        <tbody ref={datatable?.bodyRef} className="rls-datatable__tbody">
          {children}
        </tbody>
      </table>

      {summary && <div className="rls-datatable__tsummary">{summary}</div>}

      {footer && <div className="rls-datatable__tfooter">{footer}</div>}
    </div>
  );
}
