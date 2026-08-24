import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from '../Button/Button';
import { Typography } from '../Typography/Typography';
import '@shared/styles/global.css';

const meta = {
  title: 'Shared/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: {
    isOpen: true,
    onClose: fn(),
    title: 'Превью модалки',
    subtitle: 'Каркас shared Modal',
    children: (
      <div style={{ padding: '16px 20px 24px' }}>
        <Typography variant="text-regular">Контент body</Typography>
      </div>
    ),
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithFooter: Story = {
  render: (args) => (
    <Modal
      {...args}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button type="button" variant="outline" size="sm">
            Отмена
          </Button>
          <Button type="button" variant="filled" size="sm">
            Сохранить
          </Button>
        </div>
      }
    />
  ),
};

export const CustomHeader: Story = {
  args: {
    title: undefined,
    subtitle: undefined,
    header: <Typography variant="text-medium">Свой header</Typography>,
  },
};

export const WithForm: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Открыть модалку с формой</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Создать проект">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert(`Создан проект: ${name}`);
              setIsOpen(false);
            }}
          >
            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="name"
                style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}
              >
                Название
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Введите название..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d0d0d0',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
                autoFocus
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Отмена
              </Button>
              <Button variant="filled" type="submit" disabled={!name.trim()}>
                Создать
              </Button>
            </div>
          </form>
        </Modal>
      </>
    );
  },
};

export const DeleteConfirmation: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button variant="filled" color="danger" onClick={() => setIsOpen(true)}>
          Удалить
        </Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Подтверждение удаления">
          <div>
            <p style={{ fontSize: '15px', lineHeight: '1.6' }}>
              Вы уверены, что хотите удалить этот элемент?
              <br />
              <span style={{ fontSize: '13px', color: '#ef4444' }}>
                ⚠️ Это действие нельзя отменить.
              </span>
            </p>
            <div
              style={{ marginTop: '20px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}
            >
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Отмена
              </Button>
              <Button
                color="danger"
                onClick={() => {
                  alert('Элемент удален!');
                  setIsOpen(false);
                }}
              >
                Удалить
              </Button>
            </div>
          </div>
        </Modal>
      </>
    );
  },
};

export const NoTitle: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Открыть модалку</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <p>Эта модалка без заголовка.</p>
          <p>Поле title не передано.</p>
          <div
            style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}
          >
            <Button variant="filled" onClick={() => setIsOpen(false)}>
              Закрыть
            </Button>
          </div>
        </Modal>
      </>
    );
  },
};
