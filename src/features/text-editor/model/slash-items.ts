import { Editor } from '@tiptap/react';

export type SlashItem = {
  title: string;
  subtitle: string;
  execute: (props: { editor: Editor }) => void;
};

export const items: SlashItem[] = [
  {
    title: 'Текст',
    subtitle: 'Просто начните писать обычный текст',
    execute: ({ editor }) => {
      editor?.chain().focus().setParagraph().run();
    },
  },
  {
    title: 'Заголовок 1',
    subtitle: 'Крупный заголовок раздела',
    execute: ({ editor }) => {
      editor?.chain().focus().setHeading({ level: 1 }).run();
    },
  },
  {
    title: 'Заголовок 2',
    subtitle: 'Средний подзаголовок',
    execute: ({ editor }) => {
      editor?.chain().focus().setHeading({ level: 2 }).run();
    },
  },
  {
    title: 'To-do Список',
    subtitle: 'Отслеживайте задачи с чекбоксами',
    execute: ({ editor }) => {
      editor?.chain().focus().toggleTaskList().run();
    },
  },
  {
    title: 'Изображение ',
    subtitle: 'Загрузите или вставьте картинку',
    execute: ({ editor }) => {
      const url = window.prompt('Введите URL-адрес изображения:');

      if (url) {
        editor?.chain().focus().setImage({ src: url }).run();
      }
    },
  },
  {
    title: 'Видео',
    subtitle: 'Вставьте видео или файл',
    execute: ({ editor }) => {
      editor?.chain().focus().toggleTaskList().run();
    },
  },
  {
    title: 'Код',
    subtitle: 'Блок кода с подсветкой',
    execute: ({ editor }) => {
      editor?.chain().focus().toggleCodeBlock().run();
    },
  },
  {
    title: 'Цитата',
    subtitle: 'Выделите важный текст',
    execute: ({ editor }) => {
      editor?.chain().focus().toggleBlockquote().run();
    },
  },
];
