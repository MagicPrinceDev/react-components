import { renderClassStatus } from '../../../utils/css';
import './Icon.css';

interface Icon {
  value: string;
  skeleton?: boolean;
}

export function RlsIcon({ value, skeleton }: Icon) {
  return (
    <div className={renderClassStatus('rls-icon', { skeleton })}>
      <i className={`rls-icon-${value}`}></i>
    </div>
  );
}
