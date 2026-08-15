import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from '@shared/api/baseApi';
import { sessionReducer } from '@shared/api';
import {
  sidebarReducer,
  workspaceModalsReducer,
  projectModalsReducer,
  documentModalsReducer,
} from '@/shared/lib';

const rootReducer = combineReducers({
  session: sessionReducer,
  sidebar: sidebarReducer,
  workspaceModals: workspaceModalsReducer,
  projectModals: projectModalsReducer,
  documentModals: documentModalsReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export const makeStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(baseApi.middleware);
    },
  });

  setupListeners(store.dispatch);
  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
