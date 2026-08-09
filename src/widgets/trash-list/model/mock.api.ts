export interface TrashItem {
  id: number;
  title: string;
  path: string;
  deletedBy: string;
  deletedAt: string;
}

export const trashItems: TrashItem[] = [
  {
    id: 1,
    title: 'Старая страница лендинга',
    path: 'Документы / Маркетинг',
    deletedBy: 'Алекс Ким',
    deletedAt: 'Jan 12, 2025',
  },
  {
    id: 2,
    title: 'Черновик: Спецификация функции v0.2',
    path: 'Документы / Продукт',
    deletedBy: 'Женя Ли',
    deletedAt: 'Jan 10, 2025',
  },
  {
    id: 3,
    title: 'Заметки ретроспективы Q3',
    path: 'Документы / Заметки встреч',
    deletedBy: 'Алекс Ким',
    deletedAt: 'Jan 5, 2025',
  },
  {
    id: 4,
    title: 'Старая документация API',
    path: 'Документы / Разработка',
    deletedBy: 'Марк Р.',
    deletedAt: 'Dec 28, 2024',
  },
];
