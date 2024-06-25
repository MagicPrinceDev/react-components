import { ReactControl } from '@rolster/react-forms';
import { RlsMessageIcon } from '../../atoms';

interface MessageFormErrorProps {
  className: string;
  formControl?: ReactControl<HTMLElement>;
}

export function RlsMessageFormError({
  className,
  formControl
}: MessageFormErrorProps) {
  return (
    <>
      {formControl?.wrong && (
        <div className={className}>
          <RlsMessageIcon icon="alert-triangle" rlsTheme="danger">
            {formControl?.error?.message}
          </RlsMessageIcon>
        </div>
      )}
    </>
  );
}
