'use client';

import { createContext, useContext } from 'react';

interface SidebarDndContextValue {
  activeId: string | null;
  overId: string | null;
}

const SidebarDndContext = createContext<SidebarDndContextValue>({
  activeId: null,
  overId: null,
});

export const SidebarDndProvider = SidebarDndContext.Provider;

export function useSidebarDnd() {
  return useContext(SidebarDndContext);
}
