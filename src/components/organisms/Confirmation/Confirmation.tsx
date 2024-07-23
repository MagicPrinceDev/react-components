import { PartialSealed } from '@rolster/commons';
import { ReactNode, useState } from 'react';
import ReactDOM from 'react-dom';
import reactI18n from '../../../i18n';
import { renderClassStatus } from '../../../helpers/css';
import { RlsButton } from '../../atoms';
import { RlsTheme } from '../../definitions';
import './Confirmation.css';

export class ConfirmationResult extends PartialSealed<
  void,
  void,
  {
    approved: () => void;
    reject: () => void;
  }
> {
  public static approved(): ConfirmationResult {
    return new ConfirmationResult('approved');
  }

  public static reject(): ConfirmationResult {
    return new ConfirmationResult('reject');
  }
}

type Result = Promise<ConfirmationResult>;

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

interface ConfirmationProps extends ConfirmationBasic {
  approved?: ConfirmationAction;
  reject?: ConfirmationAction;
  visible?: boolean;
}

interface ConfirmationConfig extends ConfirmationBasic {
  approved?: string;
  reject?: string;
}

export type Confirmation = (props: ConfirmationConfig) => Result;

export interface ConfirmationService {
  RlsConfirmation: JSX.Element;
  confirmation: Confirmation;
}

export function RlsConfirmation({
  approved,
  content,
  reject,
  rlsTheme,
  subtitle,
  title,
  visible
}: ConfirmationProps) {
  return (
    <div
      className={renderClassStatus('rls-confirmation', { visible })}
      rls-theme={rlsTheme}
    >
      <div className="rls-confirmation__component">
        <div className="rls-confirmation__header">
          {title && <div className="rls-confirmation__title">{title}</div>}
          {subtitle && (
            <div className="rls-confirmation__subtitle">{subtitle}</div>
          )}
        </div>

        <div className="rls-confirmation__body">
          {content && (
            <div className="rls-confirmation__message">{content}</div>
          )}
        </div>

        {(approved || reject) && (
          <div className="rls-confirmation__footer">
            <div className="rls-confirmation__actions">
              {approved && (
                <RlsButton type="raised" onClick={approved.onClick}>
                  {approved.label}
                </RlsButton>
              )}
              {reject && (
                <RlsButton type="outline" onClick={reject.onClick}>
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
  const [config, setConfig] = useState<ConfirmationProps>({});
  const [visible, setVisible] = useState(false);

  const rlsConfirmation = ReactDOM.createPortal(
    <RlsConfirmation {...config} visible={visible} />,
    document.body
  );

  function confirmation(config: ConfirmationConfig): Result {
    return new Promise<ConfirmationResult>((resolve) => {
      const { content, rlsTheme, subtitle, title, approved, reject } = config;

      setConfig({
        content,
        rlsTheme,
        subtitle,
        title,
        approved: {
          label: approved || reactI18n('confirmationActionApproved'),
          onClick: () => {
            setVisible(false);
            resolve(ConfirmationResult.approved());
          }
        },
        reject: reject
          ? {
              label: reject,
              onClick: () => {
                setVisible(false);
                resolve(ConfirmationResult.reject());
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
