import { InviteRole } from '@/entities/workspace-invite';

type InviteRoleType = 'VIEWER' | 'EDITOR';

export function getInviteRole(currentUserRole?: InviteRole): InviteRoleType {
  if (currentUserRole === 'OWNER' || currentUserRole === 'ADMIN') {
    return 'EDITOR';
  }

  return 'VIEWER';
}
