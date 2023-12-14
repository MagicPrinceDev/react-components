import ReactDOM from 'react-dom';
import { renderClassStatus } from '../../../utils/css';
import { RlsComponent } from '../../definitions';
import './Modal.css';

interface ModalProps extends RlsComponent {
  visible?: boolean;
}

export function RlsModal({ children, visible, rlsTheme }: ModalProps) {
  return ReactDOM.createPortal(
    <div
      className={renderClassStatus('rls-modal', { visible })}
      rls-theme={rlsTheme}
    >
      <div className="rls-modal__component">{children}</div>

      <div className="rls-modal__backdrop"></div>
    </div>,
    document.body
  );
}
