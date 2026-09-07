import { Editor } from '@tiptap/react';
import { ComponentType, SVGProps } from 'react';
import EditorTypography from '@shared/assets/icons/editor-typography.svg';
import EditorH1 from '@shared/assets/icons/editor-heading-1.svg';
import EditorH2 from '@shared/assets/icons/editor-heading-2.svg';
import EditorToDo from '@shared/assets/icons/editor-todo.svg';
import EditorCode from '@shared/assets/icons/editor-code.svg';
import EditorImage from '@shared/assets/icons/editor-image.svg';
import EditorVideo from '@shared/assets/icons/editor-video.svg';
import EditorBlockquote from '@shared/assets/icons/editor-blockquote.svg';

type SlashIcon = ComponentType<SVGProps<SVGSVGElement>>;

export type SlashItem = {
  title: string;
  subtitle: string;
  icon: SlashIcon;
  execute: (props: { editor: Editor }) => void;
};

export const items: SlashItem[] = [
  {
    title: 'Текст',
    subtitle: 'Просто начните писать обычный текст',
    execute: ({ editor }) => {
      editor?.chain().focus().setParagraph().run();
    },
    icon: EditorTypography,
  },
  {
    title: 'Заголовок 1',
    subtitle: 'Крупный заголовок раздела',
    execute: ({ editor }) => {
      editor?.chain().focus().setHeading({ level: 1 }).run();
    },
    icon: EditorH1,
  },
  {
    title: 'Заголовок 2',
    subtitle: 'Средний подзаголовок',
    execute: ({ editor }) => {
      editor?.chain().focus().setHeading({ level: 2 }).run();
    },
    icon: EditorH2,
  },
  {
    title: 'To-do Список',
    subtitle: 'Отслеживайте задачи с чекбоксами',
    execute: ({ editor }) => {
      editor?.chain().focus().toggleTaskList().run();
    },
    icon: EditorToDo,
  },
  {
    title: 'Изображение ',
    subtitle: 'Загрузите или вставьте картинку',
    execute: ({ editor }) => {
      editor.chain().focus().insertContent({ type: 'imageUpload' }).run();
    },
    icon: EditorImage,
  },
  {
    title: 'Видео',
    subtitle: 'Вставьте видео или файл',
    execute: ({ editor }) => {
      editor?.chain().focus().insertContent({ type: 'videoUpload' }).run();
    },
    icon: EditorVideo,
  },
  {
    title: 'Код',
    subtitle: 'Блок кода с подсветкой',
    execute: ({ editor }) => {
      editor?.chain().focus().toggleCodeBlock().run();
    },
    icon: EditorCode,
  },
  {
    title: 'Цитата',
    subtitle: 'Выделите важный текст',
    execute: ({ editor }) => {
      editor?.chain().focus().toggleBlockquote().run();
    },
    icon: EditorBlockquote,
  },
];
