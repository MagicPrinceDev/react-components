import { ReactNode, useEffect, useRef, useState } from 'react';
import { renderClassStatus } from '../../../utils/css';
import { ButtonType, RlsButton } from '../../atoms';
import { RlsComponent } from '../../definitions';
import './ButtonToggle.css';

export interface ButtonToggleOption {
  label: ReactNode;
  value: string;
}

interface ButtonToggleProps extends RlsComponent {
  options: ButtonToggleOption[];
  type: ButtonType;
  disabled?: boolean;
  onAction?: (value: string) => void;
}

export function RlsButtonToggle({
  options,
  type,
  disabled,
  rlsTheme,
  onAction
}: ButtonToggleProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const [firstAction] = options;

  const [action, setAction] = useState(firstAction);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onCloseMenu({ target }: any) {
      if (!contentRef?.current?.contains(target)) {
        setVisible(false);
      }
    }

    document.addEventListener('click', onCloseMenu);

    return () => {
      document.removeEventListener('click', onCloseMenu);
    };
  }, []);

  function onClickMenu(): void {
    setVisible((prevValue) => !prevValue);
  }

  function onSelectAction(action: ButtonToggleOption): void {
    setAction(action);
    setVisible(false);
  }

  return (
    <div className="rls-button-toggle" ref={contentRef} rls-theme={rlsTheme}>
      <div className="rls-button-toggle__content">
        {action && (
          <div className="rls-button-toggle__action">
            <RlsButton
              disabled={disabled}
              type={type}
              onClick={() => {
                if (onAction) {
                  onAction(action.value);
                }
              }}
            >
              {action.label}
            </RlsButton>
          </div>
        )}

        <div className="rls-button-toggle__icon">
          <RlsButton
            type={type}
            prefixIcon="arrow-ios-down"
            disabled={disabled}
            onClick={onClickMenu}
          />
        </div>
      </div>

      <div
        className={renderClassStatus('rls-button-toggle__list', {
          visible,
          hide: !visible
        })}
      >
        <ul>
          {options.map((action, index) => (
            <li
              className="truncate"
              key={index}
              onClick={() => {
                onSelectAction(action);
              }}
            >
              {action.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
