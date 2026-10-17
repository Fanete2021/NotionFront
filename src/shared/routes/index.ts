export const ROUTES = {
  home: '/',
  main: '/main',
  join: '/join',
  login: '/login',
  registration: '/registration',
  resetPassword: '/reset-password',
  documents: '/documents',
  projects: '/projects',
  calendar: '/calendar',
  trash: '/trash',
  settings: '/settings',
  pageSearch: '/search',
  publicFeed: '/feed',
} as const;

export const PUBLIC_ROUTES = [ROUTES.login, ROUTES.registration, ROUTES.publicFeed] as const;

export const PRIVATE_ROUTES = [
  ROUTES.home,
  ROUTES.main,
  ROUTES.join,
  ROUTES.documents,
  ROUTES.projects,
  ROUTES.calendar,
  ROUTES.trash,
  ROUTES.settings,
  ROUTES.pageSearch,
] as const;
