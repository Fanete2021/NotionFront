'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loggedOut, selectSessionStatus } from '../store';
import { useGetMeQuery } from '@entities/user';
import { useAppDispatch, useAppSelector } from '@/shared/lib';
import { Loader } from '@/shared/ui/loader';

type AuthGuardProps = {
  children: React.ReactNode;
};

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();
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

  useEffect(() => {
    if (status === 'anonymous') {
      router.replace('/login');
    }
  }, [router, status]);

  if (!isClient) {
    return <Loader />;
  }

  if (status === 'unknown' || status === 'anonymous') {
    return <Loader />;
  }

  return children;
};
