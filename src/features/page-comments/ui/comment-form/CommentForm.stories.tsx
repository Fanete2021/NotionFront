import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { CommentForm } from './CommentForm';
import '@shared/styles/global.css';

const meta = {
  title: 'features/CommentForm',
  component: CommentForm,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 288, padding: 16, background: '#ffffff' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    onSubmit: fn(async () => {}),
  },
} satisfies Meta<typeof CommentForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Reply: Story = {
  args: {
    placeholder: 'Ответить...',
    submitLabel: 'Ответить',
    rows: 2,
    onCancel: fn(),
  },
};

export const Editing: Story = {
  args: {
    initialValue: 'Текст, который можно поправить',
    submitLabel: 'Сохранить',
    onCancel: fn(),
  },
};

export const Submitting: Story = {
  args: {
    onSubmit: fn(() => new Promise<void>(() => {})),
  },
};
