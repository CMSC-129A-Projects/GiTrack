import { createStore } from 'redux';
import { persistReducer } from 'redux-persist';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet';
import storage from 'redux-persist/lib/storage';
import rootReducer from './ducks/index';

export const configureStore = () => {
  const persistConfig = {
    key: 'root',
    storage,
    stateReconciler: hardSet,
  };
  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(persistedReducer);

  return store;
};
