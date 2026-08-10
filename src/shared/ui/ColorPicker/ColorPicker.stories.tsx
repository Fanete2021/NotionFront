import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { ColorPicker } from './ColorPicker';
import { Colors } from '@/shared/const/colors';

const meta: Meta<typeof ColorPicker> = {
  title: 'Shared/ColorPicker',
  component: ColorPicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    selectedColor: {
      control: 'select',
      options: Object.values(Colors),
      description: 'Выбранный цвет (строка)',
    },
    onChange: { action: 'changed' },
    className: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof ColorPicker>;

export const Interactive: Story = {
  render: function Render() {
    const [selected, setSelected] = useState<string | null>(null);
    return <ColorPicker selectedColor={selected} onChange={setSelected} />;
  },
};

export const Preselected: Story = {
  args: {
    selectedColor: Colors.BLUE,
    onChange: () => {},
  },
};

export const WhiteSelected: Story = {
  args: {
    selectedColor: Colors.WHITE,
    onChange: () => {},
  },
};

export const WithCustomClass: Story = {
  args: {
    selectedColor: Colors.GREEN,
    onChange: () => {},
    className: 'custom-picker',
  },
};

export const NoSelection: Story = {
  args: {
    selectedColor: null,
    onChange: () => {},
  },
};
