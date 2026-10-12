import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('показывает инициалы, если ссылки нет', () => {
    render(<Avatar name="Иван Иванов" />);

    expect(screen.getByText('ИИ')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('показывает инициалы, пока картинка грузится, и прячет их после загрузки', () => {
    render(<Avatar name="Иван Иванов" src="https://example.com/avatar.jpg" />);

    const image = screen.getByRole('img', { name: 'Иван Иванов' });
    expect(screen.getByText('ИИ')).toBeInTheDocument();

    fireEvent.load(image);

    expect(screen.queryByText('ИИ')).not.toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('убирает битую картинку и оставляет инициалы', () => {
    render(<Avatar name="Иван Иванов" src="https://example.com/broken.jpg" />);

    fireEvent.error(screen.getByRole('img'));

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('ИИ')).toBeInTheDocument();
  });

  it('пробует загрузить новую ссылку после ошибки со старой', () => {
    const { rerender } = render(<Avatar name="Иван Иванов" src="https://example.com/broken.jpg" />);

    fireEvent.error(screen.getByRole('img'));
    rerender(<Avatar name="Иван Иванов" src="https://example.com/new.jpg" />);

    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/new.jpg');
    expect(screen.getByText('ИИ')).toBeInTheDocument();
  });
});
