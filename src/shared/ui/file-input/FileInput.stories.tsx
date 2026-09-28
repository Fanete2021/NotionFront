import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';
import { FileInput } from './FileInput';

const meta = {
  title: 'shared/FileInput',
  component: FileInput,
  tags: ['autodocs'],
  args: {
    onChange: fn(),
    label: 'Выберите фото',
  },
} satisfies Meta<typeof FileInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
