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

  useGetMeQuery(undefined, { skip: status !== 'unknown' });

  useEffect(() => {
    if (status === 'anonymous') {
      router.replace('/login');
    }
  }, [router, status]);

  return children;
};
