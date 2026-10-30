'use client';

import { useState } from 'react';
import styles from './TelegramConnection.module.css';
import {
  useCreateTelegramConnectCodeMutation,
  useDisconnectTelegramMutation,
  useGetTelegramStatusQuery,
  type TelegramConnectCode,
} from '@entities/telegram';
import { Button } from '@shared/ui/button';
import { Card } from '@shared/ui/card';
import { FormError } from '@shared/ui/form-error';
import { useMutationWithError } from '@shared/lib';
import TelegramIcon from '@shared/assets/icons/telegram.svg';

const STATUS_POLLING_INTERVAL = 3000;

export const TelegramConnection = () => {
  const [isAwaitingConnect, setIsAwaitingConnect] = useState(false);
  const { data: status } = useGetTelegramStatusQuery(undefined, {
    pollingInterval: isAwaitingConnect ? STATUS_POLLING_INTERVAL : 0,
  });
  const isConnected = status?.isConnected ?? false;

  // Бот подтвердил привязку — перестаём опрашивать статус
  if (isAwaitingConnect && isConnected) {
    setIsAwaitingConnect(false);
  }

  const {
    execute: createConnectCode,
    isLoading: isConnecting,
    error: connectError,
  } = useMutationWithError<TelegramConnectCode, void>(useCreateTelegramConnectCodeMutation);
  const {
    execute: disconnect,
    isLoading: isDisconnecting,
    error: disconnectError,
  } = useMutationWithError<void, void>(useDisconnectTelegramMutation);

  const handleClick = async () => {
    try {
      if (isConnected) {
        await disconnect();
        return;
      }

      const { deepLink } = await createConnectCode();
      window.open(deepLink, '_blank', 'noopener');
      setIsAwaitingConnect(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Card className={styles.connectionCard} radius="m">
        <span className={styles.telegramIcon} aria-hidden="true">
          <TelegramIcon />
        </span>
        <div className={styles.account}>
          <span className={styles.accountName}>
            {status?.username ? `@${status.username}` : 'Telegram'}
          </span>
          <span className={styles.connectionStatus} data-connected={isConnected}>
            {isConnected ? 'Подключён' : 'Не подключён'}
          </span>
        </div>
        <Button
          className={styles.connectionButton}
          type="button"
          variant="outline"
          color={isConnected ? 'danger' : 'normal'}
          size="sm"
          onClick={handleClick}
          disabled={!status || isConnecting || isDisconnecting}
        >
          {isConnected ? 'Отключить' : 'Подключить'}
        </Button>
      </Card>
      <FormError message={connectError ?? disconnectError} />
    </>
  );
};
