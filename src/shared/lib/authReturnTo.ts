const AUTH_RETURN_TO_KEY = 'auth_return_to';

const isSafeInternalPath = (path: string): boolean =>
  path.startsWith('/') && !path.startsWith('//') && !path.includes('\\');

export const rememberAuthReturnTo = (path: string): void => {
  if (typeof window === 'undefined' || !isSafeInternalPath(path)) return;

  try {
    sessionStorage.setItem(AUTH_RETURN_TO_KEY, path);
  } catch {
    // Private browsing can disable session storage.
  }
};

export const takeAuthReturnTo = (): string | null => {
  if (typeof window === 'undefined') return null;

  try {
    const path = sessionStorage.getItem(AUTH_RETURN_TO_KEY);
    sessionStorage.removeItem(AUTH_RETURN_TO_KEY);
    return path && isSafeInternalPath(path) ? path : null;
  } catch {
    return null;
  }
};
