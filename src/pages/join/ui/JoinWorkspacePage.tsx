'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { UnexpectedError } from '@widgets/error';
import { useRedeemWorkspaceInviteMutation } from '@entities/workspace-invite';
import type { RedeemWorkspaceInviteDto, WorkspaceMember } from '@entities/workspace-invite';
import { setCurrentWorkspace } from '@entities/workspace';
import { useAppDispatch, useMutationWithError } from '@shared/lib';
import { Loader } from '@shared/ui/loader';
import { ROUTES } from '@shared/routes';

export const JoinWorkspacePage = () => {
  const params = useParams<{ token: string }>();
  const attemptRef = useRef<string | null>(null);
  const [responseError, setResponseError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const token = params?.token ?? '';

  const {
    execute: redeemToken,
    error: redeemTokenError,
    resetError,
  } = useMutationWithError<WorkspaceMember, RedeemWorkspaceInviteDto>(
    useRedeemWorkspaceInviteMutation,
  );

  useEffect(() => {
    const attemptKey = `${token}:${attempt}`;
    if (!token || attemptRef.current === attemptKey) return;

    attemptRef.current = attemptKey;
    const performMutation = async () => {
      try {
        const member = await redeemToken({ token });
        if (typeof member?.workspaceId !== 'string' || !member.workspaceId) {
          setResponseError('Сервер не вернул ID рабочего пространства');
          return;
        }

        dispatch(setCurrentWorkspace(member.workspaceId));
        router.replace(ROUTES.main);
      } catch {
        // useMutationWithError displays the request error.
      }
    };

    void performMutation();
  }, [attempt, dispatch, redeemToken, router, token]);

  const handleRetry = () => {
    setResponseError(null);
    resetError();
    setAttempt((current) => current + 1);
  };

  const errorMessage = !token
    ? 'Некорректная ссылка приглашения'
    : (responseError ?? redeemTokenError);

  if (errorMessage) {
    return <UnexpectedError code="INVITE" error={new Error(errorMessage)} onRetry={handleRetry} />;
  }
  return <Loader />;
};
