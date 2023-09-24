import { PartialSealed } from '@rolster/helpers-advanced';
import { ReactNode, useState } from 'react';
import ReactDOM from 'react-dom';
import { renderClassStatus } from '../../../utils/css';
import { RlsButton } from '../../atoms';
import { RlsTheme } from '../../definitions';
import './Confirmation.css';

class Result extends PartialSealed<
  void,
  void,
  {
    approved: () => void;
    reject: () => void;
  }
> {
  public static approved(): Result {
    return new Result('approved');
  }

  public static reject(): Result {
    return new Result('reject');
  }
}

interface ConfirmationAction {
  label: string;
  onClick: () => void;
}

interface ConfirmationBasic {
  content?: ReactNode;
  subtitle?: string;
  title?: string;
  rlsTheme?: RlsTheme;
}

interface Confirmation extends ConfirmationBasic {
  approved?: ConfirmationAction;
  reject?: ConfirmationAction;
  visible?: boolean;
}

interface ConfirmationConfig extends ConfirmationBasic {
  approved?: string;
  reject?: string;
}

export type FnConfirmation = (props: ConfirmationConfig) => Promise<Result>;

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
  return (
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
    </div>
  );
}

export function useConfirmationService(): ConfirmationService {
  const [config, setConfig] = useState<Confirmation>({});
  const [visible, setVisible] = useState(false);

  const rlsConfirmation = ReactDOM.createPortal(
    <RlsConfirmation {...config} visible={visible} />,
    document.body
  );

  function confirmation(config: ConfirmationConfig): Promise<Result> {
    return new Promise<Result>((resolve) => {
      const { content, rlsTheme, subtitle, title, approved, reject } = config;

      setConfig({
        content,
        rlsTheme,
        subtitle,
        title,
        approved: {
          label: approved || 'Aceptar',
          onClick: () => {
            setVisible(false);
            resolve(Result.approved());
          }
        },
        reject: reject
          ? {
              label: reject,
              onClick: () => {
                setVisible(false);
                resolve(Result.reject());
              }
            }
          : undefined
      });

      setVisible(true);
    });
  }

  return {
    RlsConfirmation: rlsConfirmation,
    confirmation
  };
}
