'use client';

import { createContext, useContext } from 'react';

export type DndItemType = 'group' | 'document';

interface SidebarDndContextValue {
  activeId: string | null;
  overId: string | null;
  activeType: DndItemType | null;
}

const SidebarDndContext = createContext<SidebarDndContextValue>({
  activeId: null,
  overId: null,
  activeType: null,
});

export const SidebarDndProvider = SidebarDndContext.Provider;

export function useSidebarDnd() {
  return useContext(SidebarDndContext);
}
