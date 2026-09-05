import type { Meta, StoryObj } from '@storybook/nextjs';
import { FormError } from './FormError';

const meta: Meta<typeof FormError> = {
  title: 'shared/FormError',
  component: FormError,
  parameters: {
    layout: 'centered',
  },
  args: {
    className: 'error',
    message: 'text',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FormError>;

export const Default: Story = {
  args: {
    message: 'Это поле обязательно для заполнения',
  },
};

export const LongError: Story = {
  args: {
    message:
      'Пароль должен содержать минимум 8 символов, включать заглавные и строчные буквы, цифры и специальные символы',
  },
};

export const CustomClass: Story = {
  args: {
    message: 'Ошибка валидации',
    className: 'custom-error',
  },
};

export const MultipleErrors: Story = {
  render: () => (
    <>
      <FormError message="Email уже используется" />
      <FormError message="Пароль должен содержать минимум 8 символов" />
    </>
  ),
};
