import { STORAGE_KEY } from '../../const/storageKeys';

export const loadCurrentWorkspace = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(STORAGE_KEY) || null;
  }
  return null;
};

const TOKEN_KEY = 'accessToken';

export const loadAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY) || null;
  }
  return null;
};

export const saveAccessToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const removeAccessToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
};
