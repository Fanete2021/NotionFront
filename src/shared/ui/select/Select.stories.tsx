import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { Select } from './Select';
import '@shared/styles/global.css';

const workspaces = [
  { value: 'personal', label: 'Личное пространство' },
  { value: 'team', label: 'Команда' },
  { value: 'design', label: 'Дизайн-система' },
];

const meta: Meta<typeof Select> = {
  title: 'shared/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    options: { control: 'object', description: 'Список вариантов: { value, label }' },
    value: { control: 'text', description: 'Выбранное значение' },
    disabled: { control: 'boolean' },
    onChange: { action: 'changed' },
  },
  args: {
    options: workspaces,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    value: 'personal',
  },
};

export const Disabled: Story = {
  args: {
    value: 'team',
    disabled: true,
  },
};

export const Interactive: Story = {
  render: function Render() {
    const [value, setValue] = useState(workspaces[0].value);

    return <Select options={workspaces} value={value} onChange={setValue} />;
  },
};
