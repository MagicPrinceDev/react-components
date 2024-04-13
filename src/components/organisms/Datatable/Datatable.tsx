import { RefObject } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';

interface DatatableCellProps extends RlsComponent {
  className?: string;
  control?: boolean;
  overflow?: boolean;
}

interface DatatableDateProps extends RlsComponent {
  className?: string;
  error?: boolean;
}

interface DatatableProps extends RlsComponent {
  bodyRef?: RefObject<HTMLTableSectionElement>;
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
      className={(
        renderClassStatus('rls-datatable__title', { control }) +
        ` ${className || ''}`
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
}: DatatableDateProps) {
  return (
    <tr
      className={(
        renderClassStatus('rls-datatable__data', { error }) +
        ` ${className || ''}`
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
      className={(
        renderClassStatus('rls-datatable__cell', { control, overflow }) +
        ` ${className || ''}`
      ).trim()}
    >
      {children}
    </th>
  );
}

export function RlsDatatable({
  bodyRef,
  children,
  footer,
  header,
  rlsTheme
}: DatatableProps) {
  return (
    <div className="rls-datatable" rls-theme={rlsTheme}>
      <table>
        {header && <thead className="rls-datatable__thead">{header}</thead>}

        <tbody ref={bodyRef} className="rls-datatable__tbody">
          {children}
        </tbody>
      </table>

      {footer && <div className="rls-datatable__tfooter">{footer}</div>}
    </div>
  );
}
