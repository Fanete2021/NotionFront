'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../redux';
import { useGetMeQuery } from '@entities/user';
import { selectSessionStatus } from '@shared/api';

type AuthGuardProps = {
  children: React.ReactNode;
};

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();

  const status = useAppSelector(selectSessionStatus);

  const { isError, refetch } = useGetMeQuery(undefined, {
    skip: status !== 'unknown',
  });

  useEffect(() => {
    if (status === 'anonymous') {
      router.replace('/login');
    }
  }, [router, status]);

  if (status === 'unknown') {
    if (isError) {
      return (
        <div>
          <p>Не удалось проверить сессию</p>
          <button onClick={refetch}>Повторить</button>
        </div>
      );
    }

    return <div>Проверяем авторизацию...</div>;
  }

  if (status === 'anonymous') {
    return null;
  }

  return children;
};
