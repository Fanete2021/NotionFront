import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Typography, TypographyProps } from '@shared/ui/Typography/Typography';

const defaultArgs: TypographyProps = {
  variant: 'text-regular',
  children: 'The quick brown fox',
};

const meta = {
  title: 'Typography',
  component: Typography,
  tags: ['autodocs'],
  args: defaultArgs,
} satisfies Meta<typeof Typography>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Display: Story = {
  args: {
    variant: 'h1',
    children: 'The quick brown fox',
  },
};

export const Heading: Story = {
  args: {
    variant: 'h2',
    children: 'The quick brown fox',
  },
};

export const SubHeading: Story = {
  args: {
    variant: 'h3',
    children: 'The quick brown fox jumps',
  },
};

export const Section: Story = {
  args: {
    variant: 'h4',
    children: 'The quick brown fox jumps over',
  },
};

export const BodyRegular: Story = {
  args: {
    variant: 'text-regular',
    children: 'The quick brown fox jumps over the lazy dog and runs away',
  },
};

export const BodyMedium: Story = {
  args: {
    variant: 'text-medium',
    children: 'The quick brown fox jumps over the lazy dog',
  },
};

export const Label: Story = {
  args: {
    variant: 'label',
    children: 'Labels, secondary metadata, form hints',
  },
};

export const Caption: Story = {
  args: {
    variant: 'caption',
    children: 'Timestamps, badges, auxiliary information',
  },
};

export const BodyAlt: Story = {
  args: {
    variant: 'text-alt',
    children: 'Subtitles, alt body text, hero descriptions',
  },
};

export const Micro: Story = {
  args: {
    variant: 'text-micro',
    children: 'Micro labels, sidebar sections, shortcuts',
  },
};

export const Avatar: Story = {
  args: {
    variant: 'text-avatar',
    children: 'AK',
  },
};
