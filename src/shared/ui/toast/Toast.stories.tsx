import { type ReactNode, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { Button } from '@shared/ui/Button';
import { createToastManager, Toaster } from './Toast';

type ToastManager = ReturnType<typeof createToastManager>;

function ToastStory({
  children,
  showToast,
}: {
  children: ReactNode;
  showToast: (manager: ToastManager) => void;
}) {
  const [manager] = useState(createToastManager);

  return (
    <>
      <Button onClick={() => showToast(manager)}>{children}</Button>
      <Toaster toastManager={manager} />
    </>
  );
}

const meta = {
  title: 'shared/Toast',
  component: Toaster,

  tags: ['autodocs'],
} satisfies Meta<typeof Toaster>;

export default meta;

type Story = StoryObj<typeof meta>;

function asyncShowToast(manager: ToastManager) {
  manager.promise(
    new Promise<{ name: string }>((resolve) => {
      window.setTimeout(() => resolve({ name: 'Данные' }), 2000);
    }),
    {
      loading: 'Загрузка данных...',
      success: (data) => `${data.name} загружены.`,
      error: 'Не удалось загрузить данные',
    },
  );
}

export const Default: Story = {
  render: () => (
    <ToastStory
      showToast={(manager) =>
        manager.add({
          title: 'Уведомление',
          description: 'Операция выполнена',
        })
      }
    >
      Default Toast
    </ToastStory>
  ),
};

export const Success: Story = {
  render: () => (
    <ToastStory
      showToast={(manager) =>
        manager.add({
          type: 'success',
          title: 'Уведомление',
          description: 'Операция выполнена успешно',
        })
      }
    >
      Success Toast
    </ToastStory>
  ),
};

export const Error: Story = {
  render: () => (
    <ToastStory
      showToast={(manager) =>
        manager.add({
          type: 'error',
          title: 'Уведомление',
          description: 'Операция выполнена с ошибкой',
        })
      }
    >
      Error Toast
    </ToastStory>
  ),
};

export const Warning: Story = {
  render: () => (
    <ToastStory
      showToast={(manager) =>
        manager.add({
          type: 'warning',
          title: 'Уведомление',
          description: 'Операция выполнена с получением предупреждения',
        })
      }
    >
      Warning Toast
    </ToastStory>
  ),
};

export const Info: Story = {
  render: () => (
    <ToastStory
      showToast={(manager) =>
        manager.add({
          type: 'info',
          title: 'Уведомление',
          description: 'Операция выполнена, информация получена',
        })
      }
    >
      Info Toast
    </ToastStory>
  ),
};

export const AsyncToast: Story = {
  render: () => <ToastStory showToast={asyncShowToast}>Async Toast</ToastStory>,
};

export const ToastWithAction: Story = {
  render: () => (
    <ToastStory
      showToast={(manager) =>
        manager.add({
          type: 'info',
          title: 'Уведомление',
          description: 'Операция выполнена',
          actionProps: {
            children: 'Отменить',
            onClick() {
              manager.close();
            },
          },
        })
      }
    >
      Toast with action
    </ToastStory>
  ),
};
