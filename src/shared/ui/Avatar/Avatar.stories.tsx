import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Avatar } from "@shared/ui/Avatar";
import "@shared/styles/global.css";

const meta = {
  title: "Avatar",
  component: Avatar,
  tags: ["autodocs"],
  args: {
    name: "Жора Лучший",
    size: "md",
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleInitial: Story = {
  args: {
    name: "Anna",
    size: "md",
  },
};

export const ExtraSmall: Story = {
  args: {
    size: "xs",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    size: "md",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
  },
};

export const ExtraLarge: Story = {
  args: {
    size: "xl",
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Avatar name="Жора Лучший" size="xs" />
      <Avatar name="Жора Лучший" size="sm" />
      <Avatar name="Жора Лучший" size="md" />
      <Avatar name="Жора Лучший" size="lg" />
      <Avatar name="Жора Лучший" size="xl" />
    </div>
  ),
};
