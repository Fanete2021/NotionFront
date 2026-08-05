import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { sidebarReducer } from './reducers/sidebarReducer';

const rootReducer = combineReducers({
  sidebarReducer,
});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
