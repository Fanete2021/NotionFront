import type { Meta, StoryObj } from '@storybook/nextjs';
import { FilterChip } from '@shared/ui/FilterChip';
import '@shared/styles/global.css';

const meta = {
  title: 'FilterChip',
  component: FilterChip,
  tags: ['autodocs'],
  args: {
    label: 'Работа',
    color: 'primary',
    appearance: 'filter',
    showRemove: false,
  },
} satisfies Meta<typeof FilterChip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithRemove: Story = {
  args: {
    showRemove: true,
  },
};

export const AddFilter: Story = {
  args: {
    label: 'Добавить фильтр',
    appearance: 'add',
    color: 'neutral',
  },
};
