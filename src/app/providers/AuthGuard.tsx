'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { selectSessionStatus } from '../store';
import { NotFoundError } from '@widgets/error';
import { useGetMeQuery } from '@entities/user';
import { useAppSelector } from '@shared/lib';
import { PRIVATE_ROUTES, PUBLIC_ROUTES, ROUTES } from '@shared/routes';

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
  const status = useAppSelector(selectSessionStatus);
  useGetMeQuery(undefined, { skip: status !== 'unknown' });

  const isCurrentRoutePublic = pathname !== null && isPublicRoute(pathname);
  const isCurrentRoutePrivate = pathname !== null && isPrivateRoute(pathname);

  useEffect(() => {
    if (status === 'anonymous' && isCurrentRoutePrivate) {
      router.replace(ROUTES.login);
    }
  }, [isCurrentRoutePrivate, router, status]);

  if (pathname === null || status === 'unknown') {
    return null;
  }

  if (isCurrentRoutePublic) {
    return children;
  }

  if (isCurrentRoutePrivate) {
    return status === 'authenticated' ? children : null;
  }

  return <NotFoundError />;
};
