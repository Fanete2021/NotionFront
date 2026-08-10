import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { sidebarReducer } from './reducers/sidebarReducer';
import { rtkApi } from '@/shared/api/rtkApi';

const rootReducer = combineReducers({
  sidebar: sidebarReducer,
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
