import { Editor } from '@tiptap/react';
import { ComponentType, SVGProps } from 'react';
import PlusIcon from '@shared/assets/icons/plus.svg';
import DivideIcon from '@shared/assets/icons/divide.svg';

export type FormatItem = {
  label: string;
  text: string;
  className?: 'bubbleButtonItalic' | 'bubbleButtonUnderline' | 'bubbleButtonCode';
  isActive: (editor: Editor) => boolean;
  execute: (editor: Editor) => void;
};

export type TableItem = {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  execute: (editor: Editor) => void;
};

export const formatItems: FormatItem[] = [
  {
    label: 'Заголовок 1',
    text: 'H1',
    isActive: (editor) => editor.isActive('heading', { level: 1 }),
    execute: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    label: 'Заголовок 2',
    text: 'H2',
    isActive: (editor) => editor.isActive('heading', { level: 2 }),
    execute: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    label: 'Обычный текст',
    text: 'Т',
    isActive: (editor) => editor.isActive('paragraph'),
    execute: (editor) => editor.chain().focus().setParagraph().run(),
  },
  {
    label: 'Жирный',
    text: 'B',
    isActive: (editor) => editor.isActive('bold'),
    execute: (editor) => editor.chain().focus().toggleBold().run(),
  },
  {
    label: 'Курсив',
    text: 'I',
    className: 'bubbleButtonItalic',
    isActive: (editor) => editor.isActive('italic'),
    execute: (editor) => editor.chain().focus().toggleItalic().run(),
  },
  {
    label: 'Подчёркнутый',
    text: 'U',
    className: 'bubbleButtonUnderline',
    isActive: (editor) => editor.isActive('underline'),
    execute: (editor) => editor.chain().focus().toggleUnderline().run(),
  },
  {
    label: 'Код',
    text: '</>',
    className: 'bubbleButtonCode',
    isActive: (editor) => editor.isActive('code'),
    execute: (editor) => editor.chain().focus().toggleCode().run(),
  },
];

export const tableItems: TableItem[] = [
  {
    label: 'Добавить строку',
    icon: PlusIcon,
    execute: (editor) => editor.chain().focus().addRowAfter().run(),
  },
  {
    label: 'Добавить столбец',
    icon: PlusIcon,
    execute: (editor) => editor.chain().focus().addColumnAfter().run(),
  },
  {
    label: 'Удалить строку',
    icon: DivideIcon,
    execute: (editor) => editor.chain().focus().deleteRow().run(),
  },
  {
    label: 'Удалить столбец',
    icon: DivideIcon,
    execute: (editor) => editor.chain().focus().deleteColumn().run(),
  },
];
