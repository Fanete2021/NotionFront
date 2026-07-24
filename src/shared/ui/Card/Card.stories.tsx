import {Card} from "@shared/ui/Card/Card";
import {Meta, StoryObj} from "@storybook/nextjs-vite";

const meta = {
  title: 'Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    selected: false,
    variant: 'outlined',
    children: 'Card content'
  }
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Basic card',
  },
};

export const Selected: Story = {
  args: {
    children: 'Selected card',
    selected: true,
  },
};

export const Elevated: Story = {
  args: {
    children: 'Elevated card',
    variant: 'elevated',
  },
};

