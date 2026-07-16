import {fn} from 'storybook/test';
import type {Meta, StoryObj} from '@storybook/nextjs-vite';

import {Button} from "@shared/ui/Button/Button";
import '@shared/styles/global.css'

const meta = {
  title: 'Button', // Наименование компонента, которое будет отображаться в storybook
  component: Button, // Название компонента для которого делается story
  tags: ['autodocs'], // Тег для автоматической документации компонента
  args: { // Объект с пропсами компонента
    onClick: fn(),
    children: 'Нажми на меня',
    variant: 'primary',
    size: 'md',
  },
} satisfies Meta<typeof Button>

export default meta;

type Story = StoryObj<typeof meta>;

export const Secondary: Story = {
  args: {
    variant: 'secondary'
  }
}

export const Big:Story = {
  args: {
    size: 'lg'
  }
}

export const Medium:Story = {
  args: {
    size: 's'
  }
}

export const Small:Story = {
  args: {
    size: 'xs'
  }
}