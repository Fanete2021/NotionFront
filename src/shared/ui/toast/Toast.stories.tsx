import { Meta, StoryObj } from '@storybook/nextjs';
import { toast, Toaster } from './Toast';
import { Button } from '@shared/ui/Button';

const meta = {
  title: 'shared/Toast',
  component: Toaster,

  tags: ['autodocs'],
} satisfies Meta<typeof Toaster>;

export default meta;

type Story = StoryObj<typeof meta>;

function asyncShowToast() {
  toast.promise(
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
    <>
      <Button
        onClick={() =>
          toast.add({
            title: 'Уведомление',
            description: 'Операция выполнена',
          })
        }
      >
        Default Toast
      </Button>

      <Toaster />
    </>
  ),
};

export const Success: Story = {
  render: () => (
    <>
      <Button
        onClick={() =>
          toast.add({
            type: 'success',
            title: 'Уведомление',
            description: 'Операция выполнена успешно',
          })
        }
      >
        Success Toast
      </Button>

      <Toaster />
    </>
  ),
};

export const Error: Story = {
  render: () => (
    <>
      <Button
        onClick={() =>
          toast.add({
            type: 'error',
            title: 'Уведомление',
            description: 'Операция выполнена с ошибкой',
          })
        }
      >
        Error Toast
      </Button>

      <Toaster />
    </>
  ),
};

export const Warning: Story = {
  render: () => (
    <>
      <Button
        onClick={() =>
          toast.add({
            type: 'warning',
            title: 'Уведомление',
            description: 'Операция выполнена c предупреждением',
          })
        }
      >
        Warning Toast
      </Button>

      <Toaster />
    </>
  ),
};

export const Info: Story = {
  render: () => (
    <>
      <Button
        onClick={() =>
          toast.add({
            type: 'info',
            title: 'Уведомление',
            description: 'Операция выполнена, информация получена',
          })
        }
      >
        Info Toast
      </Button>

      <Toaster />
    </>
  ),
};

export const AsyncToast: Story = {
  render: () => (
    <>
      <Button onClick={asyncShowToast}>Async Toast</Button>

      <Toaster />
    </>
  ),
};

export const ToastWithAction: Story = {
  render: () => (
    <>
      <Button
        onClick={() =>
          toast.add({
            type: 'info',
            title: 'Уведомление',
            description: 'Операция выполнена',
            actionProps: {
              children: 'Отменить',
              onClick() {
                toast.close();
              },
            },
          })
        }
      >
        Toast with action
      </Button>

      <Toaster />
    </>
  ),
};
