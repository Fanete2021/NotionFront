'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@shared/lib';
import { selectSessionStatus } from '@shared/api';

type AuthGuardProps = {
  children: React.ReactNode;
};

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();

  const status = useAppSelector(selectSessionStatus);

  useEffect(() => {
    if (status === 'anonymous' || status === 'unknown') {
      router.replace('/login');
    }
  }, [router, status]);

  return children;
};
