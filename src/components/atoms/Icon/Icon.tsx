import { renderClassStatus } from '../../../helpers/css';
import './Icon.css';

interface IconProps {
  value: string;
  skeleton?: boolean;
}

export function RlsIcon({ value, skeleton }: IconProps) {
  return (
    <div className={renderClassStatus('rls-icon', { skeleton })}>
      <i className={`rls-icon-${value}`}></i>
    </div>
  );
}
