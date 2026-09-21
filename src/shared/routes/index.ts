export const ROUTES = {
  home: '/',
  main: '/main',
  login: '/login',
  registration: '/registration',
  resetPassword: '/reset-password',
  documents: '/documents',
  projects: '/projects',
  calendar: '/calendar',
  trash: '/trash',
  settings: '/settings',
  pageSearch: '/search',
} as const;

export const PUBLIC_ROUTES = [ROUTES.login, ROUTES.registration] as const;

export const PRIVATE_ROUTES = [
  ROUTES.home,
  ROUTES.main,
  ROUTES.documents,
  ROUTES.projects,
  ROUTES.calendar,
  ROUTES.trash,
  ROUTES.settings,
  ROUTES.pageSearch,
] as const;
