import { createContext } from 'react';
import {
  ConfirmationResult,
  FnConfirmation,
  FnSnackbar,
  useConfirmationService,
  useSnackbarService
} from './components';
import { RlsComponent } from './components/definitions';

interface State {
  confirmation: FnConfirmation;
  snackbar: FnSnackbar;
}

export const RlsContext = createContext<State>({
  confirmation: () => {
    return Promise.resolve(ConfirmationResult.approved());
  },
  snackbar: () => {}
});

export function RlsApplication({ children }: RlsComponent) {
  const { RlsConfirmation, confirmation } = useConfirmationService();
  const { RlsSnackbar, snackbar } = useSnackbarService();

  return (
    <RlsContext.Provider value={{ confirmation, snackbar }}>
      <div className="rls-app__body">{children}</div>
      {RlsSnackbar}
      {RlsConfirmation}
    </RlsContext.Provider>
  );
}
