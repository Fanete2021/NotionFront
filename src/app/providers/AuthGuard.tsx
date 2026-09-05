'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { loggedOut, selectSessionStatus } from '../store';
import { NotFoundError } from '@widgets/error';
import { useGetMeQuery } from '@entities/user';
import { PRIVATE_ROUTES, PUBLIC_ROUTES, ROUTES } from '@shared/routes';
import { useAppDispatch, useAppSelector } from '@/shared/lib';
import { Loader } from '@/shared/ui/loader';
import { toast } from '@/shared/ui/toast';

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
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectSessionStatus);
  const [isClient, setIsClient] = useState(false);

  const { isError } = useGetMeQuery(undefined, {
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
    if (status === 'anonymous' && isCurrentRoutePrivate) {
      router.replace(ROUTES.login);
      toast.add({
        type: 'error',
        title: 'Ошибка перехода на страницу!',
        description: 'Пожалуйста войдите в аккаунт или создайте новый для доступа к этой странице',
      });
    }
  }, [isCurrentRoutePrivate, router, status]);

  if (!isClient) {
    return <Loader />;
  }

  if (status === 'unknown' || status === 'anonymous') {
    return <Loader />;
  }

  if (pathname === null) {
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
