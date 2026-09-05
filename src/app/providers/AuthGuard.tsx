'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { selectSessionStatus } from '../store';
import { NotFoundError } from '@widgets/error';
import { useGetMeQuery } from '@entities/user';
import { useAppSelector } from '@shared/lib';
import { PRIVATE_ROUTES, PUBLIC_ROUTES, ROUTES } from '@shared/routes';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loggedOut, selectSessionStatus } from '../store';
import { useGetMeQuery } from '@entities/user';
import { useAppDispatch, useAppSelector } from '@/shared/lib';
import { Loader } from '@/shared/ui/loader';

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
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectSessionStatus);
  const [isClient, setIsClient] = useState(false);

  const { isLoading, isError } = useGetMeQuery(undefined, {
    skip: status !== 'unknown',
  });

  useEffect(() => {
    // eslint-disable-next-line
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isError && status === 'unknown') {
      dispatch(loggedOut());
    }
  }, [isError, status, dispatch]);

  const isCurrentRoutePublic = pathname !== null && isPublicRoute(pathname);
  const isCurrentRoutePrivate = pathname !== null && isPrivateRoute(pathname);

  useEffect(() => {
    if (status !== 'authenticated') {
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
  
  if (!isClient) {
    return <Loader />;
  }

  if (status === 'unknown' || status === 'anonymous') {
    return <Loader />;
  }

  return <NotFoundError />;
};
