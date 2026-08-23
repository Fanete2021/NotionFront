import { STORAGE_KEY } from '../../const/storageKeys';

export const loadCurrentWorkspace = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(STORAGE_KEY) || null;
  }
  return null;
};
