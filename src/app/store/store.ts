import { combineReducers, configureStore, Reducer } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { sessionReducer } from './slices/sessionSlice';
import { WorkspaceModalsState } from '@/features/switch-workspace';
import { ProjectModalsState } from '@/features/manage-project';
import { DocumentModalsState } from '@/features/create-document';
import { currentWorkspaceReducer } from '@/entities/workspace';
import { baseApi } from '@shared/api/baseApi';

const staticReducers = {
  session: sessionReducer,
  currentWorkspace: currentWorkspaceReducer,
  [baseApi.reducerPath]: baseApi.reducer,
};

export type StaticRootState = ReturnType<typeof combineReducers<typeof staticReducers>>;

export const makeStore = () => {
  const store = configureStore({
    reducer: combineReducers(staticReducers),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
  });

  const asyncReducers: Record<string, Reducer> = {};

  const injectReducer = (key: string, reducer: Reducer) => {
    if (asyncReducers[key]) return;
    asyncReducers[key] = reducer;
    store.replaceReducer(
      combineReducers({
        ...staticReducers,
        ...asyncReducers,
      }),
    );
  };

  const extendedStore = {
    ...store,
    asyncReducers,
    injectReducer,
  };

  setupListeners(store.dispatch);
  return extendedStore;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = StaticRootState & {
  session: ReturnType<typeof sessionReducer>;
  currentWorkspace: ReturnType<typeof currentWorkspaceReducer>;
  workspaceModals?: WorkspaceModalsState;
  projectModals?: ProjectModalsState;
  documentModals?: DocumentModalsState;
};
export type AppDispatch = AppStore['dispatch'];
