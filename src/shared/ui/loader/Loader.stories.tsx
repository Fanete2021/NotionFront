import type { Meta, StoryObj } from '@storybook/nextjs';
import { Loader } from './Loader';

const meta: Meta<typeof Loader> = {
  title: 'Shared/Loader',
  component: Loader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    size: 'md',
    text: '',
    fullScreen: false,
  },
};

export default meta;
type Story = StoryObj<typeof Loader>;

export const Default: Story = {
  args: {
    size: 'md',
    text: 'Загрузка...',
    fullScreen: false,
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    text: 'Загрузка...',
    fullScreen: false,
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    text: 'Загрузка...',
    fullScreen: false,
  },
};

export const WithoutText: Story = {
  args: {
    size: 'md',
    text: '',
    fullScreen: false,
  },
};

export const FullScreen: Story = {
  args: {
    size: 'md',
    text: 'Загрузка...',
    fullScreen: true,
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export const CustomText: Story = {
  args: {
    size: 'md',
    text: 'Пожалуйста, подождите...',
    fullScreen: false,
  },
};
