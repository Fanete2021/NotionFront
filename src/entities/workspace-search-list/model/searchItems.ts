import { SearchItem } from './types/searchItem';
import Page from '@shared/assets/icons/page.svg';

export const searchItems: SearchItem[] = [
  {
    id: 'page-design-system-components',
    icon: Page,
    title: 'Дизайн-система — Компоненты',
    path: 'Документы / Дизайн-система',
    description:
      '...основные UI-компоненты продукта. Каждый включает интерактивные состояния, размерные варианты...',
    lastTimeEdited: '2h ago',
  },
  {
    id: 'page-button-states',
    icon: Page,
    title: 'Компоненты кнопок и состояния',
    path: 'Документы / Дизайн-система / Компоненты',
    description:
      'Primary, Secondary и Ghost варианты кнопок. Включает hover, active, focus, disabled состояния...',
    lastTimeEdited: '1d ago',
  },
  {
    id: 'page-colors-and-tokens',
    icon: Page,
    title: 'Справочник цветов и токенов',
    path: 'Документы / Дизайн-система',
    description:
      'Все цветовые токены, семантические цвета и их применение в светлой и тёмной темах...',
    lastTimeEdited: '3d ago',
  },
  {
    id: 'page-product-roadmap',
    icon: Page,
    title: 'Дорожная карта продукта Q4',
    path: 'Документы / Дорожная карта',
    description: 'Запланированные функции и улучшения. Дизайн-система v2.0 запланирована на Q4...',
    lastTimeEdited: '1w ago',
  },
];
