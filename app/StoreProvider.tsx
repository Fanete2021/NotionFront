'use client';

import { Provider } from 'react-redux';
import { useState, type ReactNode } from 'react';
import { makeStore, AppStore } from '@shared/lib';

type StoreProviderProps = {
  children: ReactNode;
};

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const [store] = useState<AppStore>(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
};
