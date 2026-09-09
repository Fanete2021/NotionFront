import type { CSSProperties, ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { LogOut, Settings, UserRound } from 'lucide-react';

import '@shared/styles/global.css';
import { ContextMenu } from './ContextMenu';

const itemStyles: CSSProperties = {
  width: '100%',
  minHeight: 32,
  padding: '6px 8px',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  border: 0,
  borderRadius: 6,
  background: 'transparent',
  color: 'var(--color-text-body)',
  font: 'inherit',
  textAlign: 'left',
  cursor: 'pointer',
};

const iconStyles: CSSProperties = {
  width: 16,
  height: 16,
  flexShrink: 0,
};

interface StoryMenuItemProps {
  children: ReactNode;
  danger?: boolean;
}

function StoryMenuItem({ children, danger = false }: StoryMenuItemProps) {
  return (
    <li role="none">
      <button
        type="button"
        role="menuitem"
        style={{
          ...itemStyles,
          color: danger ? 'var(--color-danger)' : itemStyles.color,
        }}
      >
        {children}
      </button>
    </li>
  );
}

const meta = {
  title: 'shared/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: 280,
          padding: 40,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          background: 'var(--color-bg-surface)',
        }}
      >
        <div style={{ position: 'relative', width: 32, height: 32 }}>
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof ContextMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    'aria-label': 'Действия',
    children: (
      <>
        <StoryMenuItem>Открыть профиль</StoryMenuItem>
        <StoryMenuItem>Настройки</StoryMenuItem>
        <StoryMenuItem danger>Выйти</StoryMenuItem>
      </>
    ),
  },
};

export const WithCustomContent: Story = {
  args: {
    'aria-label': 'Действия с профилем',
    children: (
      <>
        <StoryMenuItem>
          <UserRound style={iconStyles} aria-hidden />
          Профиль
        </StoryMenuItem>
        <StoryMenuItem>
          <Settings style={iconStyles} aria-hidden />
          Настройки
        </StoryMenuItem>
        <StoryMenuItem danger>
          <LogOut style={iconStyles} aria-hidden />
          Выйти
        </StoryMenuItem>
      </>
    ),
  },
};
