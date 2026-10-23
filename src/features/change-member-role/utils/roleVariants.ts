import { WorkspaceRole } from '@/entities/workspace-members';

export interface RoleVariant {
  id: number;
  role: WorkspaceRole;
  description: string;
}

export const roleVariants: RoleVariant[] = [
  {
    id: 0,
    role: 'ADMIN',
    description: 'Управление участниками, ссылками для вступления и настройками',
  },
  {
    id: 1,
    role: 'EDITOR',
    description: 'Просмотр и редактирование страниц, без доступа к настройкам',
  },
  {
    id: 2,
    role: 'VIEWER',
    description: 'Только просмотр страниц, без права редактирования и доступа к настройкам',
  },
];
