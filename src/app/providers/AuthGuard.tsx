'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGetMeQuery } from '@entities/user';
import { selectSessionStatus } from '@shared/api';
import { useAppSelector } from '@/shared/lib';

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
