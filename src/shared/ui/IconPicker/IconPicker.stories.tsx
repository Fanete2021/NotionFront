import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { IconPicker } from './IconPicker';
import { ICONS } from './icons';

const meta: Meta<typeof IconPicker> = {
  title: 'Shared/IconPicker',
  component: IconPicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    selectedIcon: {
      control: 'select',
      options: [...ICONS, null],
      description: 'Выбранная иконка (строка)',
    },
    onChange: { action: 'changed' },
    className: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof IconPicker>;

export const Interactive: Story = {
  render: function Render() {
    const [selected, setSelected] = useState<string | null>(null);
    return <IconPicker selectedIcon={selected} onChange={setSelected} />;
  },
};

export const Preselected: Story = {
  args: {
    selectedIcon: 'folder',
    onChange: () => {},
  },
};

export const StarSelected: Story = {
  args: {
    selectedIcon: 'star',
    onChange: () => {},
  },
};

export const NoSelection: Story = {
  args: {
    selectedIcon: null,
    onChange: () => {},
  },
};

export const WithCustomClass: Story = {
  args: {
    selectedIcon: 'lightning',
    onChange: () => {},
    className: 'custom-picker',
  },
};
