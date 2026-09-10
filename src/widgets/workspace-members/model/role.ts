export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER';

export const roleLabels: Record<WorkspaceRole, string> = {
  OWNER: 'Владелец',
  ADMIN: 'Админ',
  EDITOR: 'Редактор',
  VIEWER: 'Наблюдатель',
};

export const roleColors: Record<WorkspaceRole, { color: string; bgColor: string }> = {
  OWNER: {
    color: '#6B4EFF',
    bgColor: 'rgba(107, 78, 255, 0.1)',
  },
  ADMIN: {
    color: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
  },
  EDITOR: {
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.1)',
  },
  VIEWER: {
    color: '#EF4444',
    bgColor: 'rgba(239, 68, 68, 0.1)',
  },
};
