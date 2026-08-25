'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { selectSessionStatus } from '../store';
import { useGetMeQuery } from '@entities/user';
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
