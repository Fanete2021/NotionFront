import type { Meta, StoryObj } from '@storybook/nextjs';
import type { ComponentType } from 'react';

import { Table } from './Table';
import { TableColumn, TableProps } from './types';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const users: User[] = [
  {
    id: 1,
    name: 'Иван Иванов',
    email: 'ivan@test.ru',
    role: 'Администратор',
  },
  {
    id: 2,
    name: 'Петр Петров',
    email: 'petr@test.ru',
    role: 'Редактор',
  },
  {
    id: 3,
    name: 'Анна Смирнова',
    email: 'anna@test.ru',
    role: 'Пользователь',
  },
];

const columns: TableColumn<User>[] = [
  {
    key: 'name',
    title: 'Имя',
  },
  {
    key: 'email',
    title: 'Email',
  },
  {
    key: 'role',
    title: 'Роль',
    width: 180,
  },
];

const meta: Meta<ComponentType<TableProps<User>>> = {
  title: 'Shared/Table',
  component: Table as ComponentType<TableProps<User>>,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    columns,
    data: users,
    rowKey: 'id',
  },
};

export const Empty: Story = {
  args: {
    columns,
    data: [],
    rowKey: 'id',
  },
};

export const Loading: Story = {
  args: {
    columns,
    data: [],
    loading: true,
    rowKey: 'id',
  },
};

export const ClickableRows: Story = {
  args: {
    columns,
    data: users,
    rowKey: 'id',
    onRowClick: (row: User) => {
      alert(`Вы выбрали ${row.name}`);
    },
  },
};

export const CustomRender: Story = {
  args: {
    rowKey: 'id',
    data: users,
    columns: [
      {
        key: 'name',
        title: 'Пользователь',
        render: (user: User) => (
          <div>
            <strong>{user.name}</strong>
            <br />
            <small>{user.email}</small>
          </div>
        ),
      },
      {
        key: 'role',
        title: 'Роль',
        align: 'center',
        render: (user: User) => (
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 6,
              background: '#EEF2FF',
              color: '#4338CA',
              fontSize: 12,
            }}
          >
            {user.role}
          </span>
        ),
      },
    ],
  },
};
