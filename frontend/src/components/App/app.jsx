import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import { configureStore } from 'configureStore';

import RootRouter from 'routes/Root';
import ContextProviders from './components/ContextProviders';
import GlobalStyles from './components/GlobalStyles';

const store = configureStore();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
        <ContextProviders>
          <RootRouter />
          <GlobalStyles />
        </ContextProviders>
      </PersistGate>
    </Provider>
  );
}
