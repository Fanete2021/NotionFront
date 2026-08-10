import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { sidebarReducer } from './slices/sidebarSlice';
import { modalsReducer } from './slices/modalsSlice';
import { rtkApi } from '@/shared/api/rtkApi';

const rootReducer = combineReducers({
  sidebar: sidebarReducer,
  modals: modalsReducer,
  [rtkApi.reducerPath]: rtkApi.reducer,
});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(rtkApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
