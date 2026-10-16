'use client';

import { useEffect, useRef, useState } from 'react';
import { YjsSocketProvider } from './YjsSocketProvider';
import { useSocket } from '@shared/lib';

interface UseYjsProviderOptions {
  user?: { name: string; color: string } | null;
}

export const useYjsProvider = (pageId: string, options: UseYjsProviderOptions = {}) => {
  const { socket } = useSocket();
  const [provider, setProvider] = useState<YjsSocketProvider | null>(null);
  const providerRef = useRef<{ pageId: string; instance: YjsSocketProvider } | null>(null);
  const userRef = useRef(options.user);

  useEffect(() => {
    userRef.current = options.user;
  }, [options.user]);

  useEffect(() => {
    if (!socket || !pageId) return;

    const current = providerRef.current;
    if (current && current.pageId === pageId) return;

    const instance = new YjsSocketProvider({ socket, pageId, user: userRef.current });
    providerRef.current = { pageId, instance };
    setProvider(instance);

    return () => {
      if (providerRef.current?.instance === instance) {
        instance.destroy();
        providerRef.current = null;
        setProvider(null);
      }
    };
  }, [socket, pageId]);

  return provider;
};
