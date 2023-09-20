import { ReactNode, useState } from 'react';
import ReactDOM from 'react-dom';
import { renderClassStatus } from '../../../utils/css';
import { RlsButton } from '../../atoms';
import { RlsTheme } from '../../definitions';
import './Confirmation.css';

interface ConfirmationAction {
  label: string;
  onClick?: () => void;
}

interface ConfirmationConfig {
  approved?: ConfirmationAction;
  content?: ReactNode;
  reject?: ConfirmationAction;
  subtitle?: string;
  title?: string;
  rlsTheme?: RlsTheme;
}

interface Confirmation extends ConfirmationConfig {
  visible?: boolean;
}

export type FnConfirmation = (props: Confirmation) => void;

export interface ConfirmationService {
  RlsConfirmation: JSX.Element;
  confirmation: FnConfirmation;
}

export function RlsConfirmation({
  approved,
  content,
  reject,
  rlsTheme,
  subtitle,
  title,
  visible
}: Confirmation) {
  return ReactDOM.createPortal(
    <div
      className={renderClassStatus('rls-confirmation', { visible })}
      rls-theme={rlsTheme}
    >
      <div className="rls-confirmation__component">
        <div className="rls-confirmation__header">
          {title && (
            <div className="rls-confirmation__header__title">{title}</div>
          )}
          {subtitle && (
            <div className="rls-confirmation__header__subtitle">{subtitle}</div>
          )}
        </div>

        <div className="rls-confirmation__body">
          {content && (
            <div className="rls-confirmation__body__content">{content}</div>
          )}
        </div>
        {(approved || reject) && (
          <div className="rls-confirmation__footer">
            <div className="rls-confirmation__footer__actions">
              {approved && (
                <RlsButton
                  type="raised"
                  onClick={() => {
                    if (approved.onClick) {
                      approved.onClick();
                    }
                  }}
                >
                  {approved.label}
                </RlsButton>
              )}
              {reject && (
                <RlsButton
                  type="outline"
                  onClick={() => {
                    if (reject.onClick) {
                      reject.onClick();
                    }
                  }}
                >
                  {reject.label}
                </RlsButton>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="rls-confirmation__backdrop"></div>
    </div>,
    document.body
  );
}

type RefactorAction = ConfirmationAction | undefined;

export function useConfirmationService(): ConfirmationService {
  const [config, setConfig] = useState<ConfirmationConfig>({});
  const [visible, setVisible] = useState(false);

  const rlsConfirmation = <RlsConfirmation {...config} visible={visible} />;

  function refactorAction(action?: ConfirmationAction): RefactorAction {
    if (!action) {
      return undefined;
    }

    const { label, onClick } = action;

    return {
      label,
      onClick: () => {
        setVisible(false);

        if (onClick) {
          onClick();
        }
      }
    };
  }

  function confirmation(config: ConfirmationConfig): void {
    const { approved, reject } = config;

    setConfig({
      ...config,
      approved: refactorAction(approved),
      reject: refactorAction(reject)
    });

    setVisible(true);
  }

  return {
    RlsConfirmation: rlsConfirmation,
    confirmation
  };
}
