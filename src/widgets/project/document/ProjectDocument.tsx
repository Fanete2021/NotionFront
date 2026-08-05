'use client';

import { TextEditor } from '@features/text-editor';

const initialContent = `
  <h2>Обзор</h2>
  <p>Здесь собраны базовые UI-компоненты дизайн-системы: кнопки, поля ввода и типографика.</p>
  <h2>Кнопки</h2>
  <p>Кнопка — основной элемент действий. Варианты: primary, secondary и ghost.</p>
`;

export const ProjectDocument = () => {
  return <TextEditor content={initialContent} />;
};
