import { createContext } from 'react';
import {
  ConfirmationCall,
  SnackbarCall,
  useConfirmationService,
  useSnackbarService
} from './components';
import { RlsComponent } from './components/definitions';

interface State {
  showConfirmation: ConfirmationCall;
  showSnackbar: SnackbarCall;
}

const RlsContext = createContext<State>({
  showConfirmation: () => {},
  showSnackbar: () => {}
});

export function RlsApplication({ children }: RlsComponent) {
  const { RlsConfirmation, showConfirmation } = useConfirmationService();
  const { RlsSnackbar, showSnackbar } = useSnackbarService();

  return (
    <RlsContext.Provider value={{ showConfirmation, showSnackbar }}>
      <div className="rls-app__body">{children}</div>
      {RlsSnackbar}
      {RlsConfirmation}
    </RlsContext.Provider>
  );
}

export default RlsContext;
