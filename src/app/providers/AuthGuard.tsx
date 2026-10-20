'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { NotFoundError, UnexpectedError } from '@widgets/error';
import { useGetMeQuery } from '@entities/user';
import { PRIVATE_ROUTES, PUBLIC_ROUTES, ROUTES } from '@shared/routes';
import { Loader } from '@shared/ui/loader';
import { HTTP_STATUS } from '@shared/const/httpStatus';
import { isFetchBaseQueryError } from '@shared/utils/error-utils';

type AuthGuardProps = {
  children: ReactNode;
};

const isPublicRoute = (pathname: string) => PUBLIC_ROUTES.some((route) => pathname === route);

const isPrivateRoute = (pathname: string) =>
  PRIVATE_ROUTES.some(
    (route) => pathname === route || (route !== ROUTES.home && pathname.startsWith(`${route}/`)),
  );

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const isCurrentRoutePublic = pathname !== null && isPublicRoute(pathname);
  const isCurrentRoutePrivate = pathname !== null && isPrivateRoute(pathname);

  const userQuery = useGetMeQuery(undefined, {
    skip: !isCurrentRoutePrivate,
  });

  useEffect(() => {
    if (pathname === '/') {
      router.replace(ROUTES.main);
    }
  }, [pathname, router]);

  useEffect(() => {
    if (!userQuery.isError) return;

    const isUnauthorized =
      isFetchBaseQueryError(userQuery.error) && userQuery.error.status === HTTP_STATUS.UNAUTHORIZED;

    if (isUnauthorized && pathname) {
      router.replace(`${ROUTES.login}?returnTo=${encodeURIComponent(pathname)}`);
    }
  }, [userQuery.isError, userQuery.error, router, pathname]);

  if (pathname === null) {
    return <NotFoundError />;
  }

  if (isCurrentRoutePublic) {
    return children;
  }

  if (!isCurrentRoutePrivate) {
    return <NotFoundError />;
  }

  if (userQuery.isError) {
    const isUnauthorized =
      isFetchBaseQueryError(userQuery.error) && userQuery.error.status === HTTP_STATUS.UNAUTHORIZED;

    if (isUnauthorized) {
      return <Loader />;
    }

    return (
      <UnexpectedError
        code={HTTP_STATUS.INTERNAL_SERVER_ERROR}
        error={new Error('Не удалось проверить сессию')}
        onRetry={() => void userQuery.refetch()}
      />
    );
  }

  if (userQuery.isLoading || userQuery.isUninitialized) {
    return <Loader />;
  }

  return children;
};
