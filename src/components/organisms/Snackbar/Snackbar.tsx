import { ReactNode, useEffect, useState } from 'react';
import { renderClassStatus } from '../../../utils/css';
import { RlsIcon } from '../../atoms';
import { RlsTheme } from '../../definitions';
import './Snackbar.css';

const DURATION_ANIMATION = 240;
const DURATION_CHAR = 75;
const DURATION_MAX = 9000;
const DURATION_MIN = 3000;
const DURATION_RESET = 480;

function calculateDuration({ length }: string): number {
  let duration = length * DURATION_CHAR;

  if (duration < DURATION_MIN) {
    duration = DURATION_MIN;
  } else if (duration > DURATION_MAX) {
    duration = DURATION_MAX;
  }

  return duration + DURATION_RESET;
}

interface SnackbarBasic {
  content?: ReactNode;
  title?: string;
}

export interface SnackbarConfig extends SnackbarBasic {
  icon?: string;
  rlsTheme?: RlsTheme;
}

interface Snackbar extends SnackbarConfig {
  visible?: boolean;
}

export type SnackbarCall = (config: SnackbarConfig) => void;

export interface SnackbarService {
  RlsSnackbar: JSX.Element;
  showSnackbar: SnackbarCall;
}

export function RlsSnackbar({
  content,
  icon,
  title,
  visible,
  rlsTheme
}: Snackbar) {
  return (
    <div
      className={renderClassStatus('rls-snackbar', { visible })}
      rls-theme={rlsTheme}
    >
      {icon && (
        <div className="rls-snackbar__avatar">
          <RlsIcon value={icon} />
        </div>
      )}

      <div className="rls-snackbar__component">
        {title && <label className="rls-snackbar__title">{title}</label>}
        <div className="rls-snackbar__message">{content}</div>
      </div>
    </div>
  );
}

export function useSnackbarService(): SnackbarService {
  const [config, setConfig] = useState<SnackbarConfig>({});
  const [duration, setDuration] = useState(4000);
  const [timeoutId, setTimeoutId] = useState<any>();
  const [visible, setVisible] = useState(false);

  const rlsSnackbar = <RlsSnackbar {...config} visible={visible} />;

  useEffect(() => {
    if (visible) {
      const timeoutId = setTimeout(() => {
        setVisible(false);
        setTimeoutId(undefined);
      }, duration);

      setTimeoutId(timeoutId);
    } else if (timeoutId) {
      clearTimeout(timeoutId);

      setTimeout(() => showSnackbar(config), DURATION_ANIMATION);
    }
  }, [visible]);

  function showSnackbar(config: SnackbarConfig): void {
    const { content } = config;

    setConfig(config);

    setDuration(calculateDuration(String(content)));

    setVisible(!visible);
  }

  return {
    RlsSnackbar: rlsSnackbar,
    showSnackbar
  };
}