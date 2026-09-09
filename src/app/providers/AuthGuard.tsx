'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { loggedOut, selectSessionStatus } from '../store';
import { NotFoundError, UnexpectedError } from '@widgets/error';
import { useGetMeQuery } from '@entities/user';
import { PRIVATE_ROUTES, PUBLIC_ROUTES, ROUTES } from '@shared/routes';
import { useAppSelector } from '@/shared/lib';
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
  const status = useAppSelector(selectSessionStatus);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setIsClient(true);
  }, []);

  const isCurrentRoutePublic = pathname !== null && isPublicRoute(pathname);
  const isCurrentRoutePrivate = pathname !== null && isPrivateRoute(pathname);

  const userQuery = useGetMeQuery(undefined, {
    skip: !isCurrentRoutePrivate || status === 'anonymous',
  });

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

  if (pathname === null) {
    return <Loader />;
  }

  if (isCurrentRoutePublic) {
    return children;
  }

  if (!isCurrentRoutePrivate) {
    return <NotFoundError />;
  }

  if (status === 'anonymous') {
    return <Loader />;
  }

  if (userQuery.isError) {
    return (
      <UnexpectedError
        code={500}
        error={new Error('Не удалось проверить сессию')}
        onRetry={() => void userQuery.refetch()}
      />
    );
  }

  if (status === 'unknown' || userQuery.isLoading || userQuery.isUninitialized) {
    return <Loader />;
  }

  if (status === 'authenticated' && userQuery.data) {
    return children;
  }

  return <Loader />;
};
