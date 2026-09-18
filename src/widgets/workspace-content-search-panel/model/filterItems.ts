import { FilterOption } from '@features/search-workspace-content';
import Folder from '@shared/assets/icons/folder.svg';
import Layers from '@shared/assets/icons/layers.svg';
import Page from '@shared/assets/icons/page.svg';

export const workspaceTypeFilterItems: FilterOption[] = [
  { id: 'all', title: 'Все', icon: Layers },
  { id: 'page', title: 'Страницы', icon: Page },
  { id: 'project', title: 'Проекты', icon: Folder },
];

export const workspaceChangeDateFilterItems: FilterOption[] = [
  { id: 'today', title: 'Сегодня' },
  { id: 'week', title: 'Эта неделя' },
];
