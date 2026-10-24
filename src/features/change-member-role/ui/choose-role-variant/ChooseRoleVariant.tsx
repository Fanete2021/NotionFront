'use client';

import styles from './ChooseRoleVariant.module.css';
import { RoleVariantCard } from '../role-variant-card/RoleVariantCard';
import { roleVariants } from '../../utils/roleVariants';
import { WorkspaceRole } from '@/entities/workspace-members';
import { Typography } from '@/shared/ui/typography';

interface ChooseRoleVariantProps {
  selectedRole: WorkspaceRole | null;
  onSelect: (role: WorkspaceRole) => void;
}

export function ChooseRoleVariant({ selectedRole, onSelect }: ChooseRoleVariantProps) {
  return (
    <div className={styles.variants}>
      <Typography className={styles.chooseRoleLabel} variant="text-medium">
        Выберите роль
      </Typography>
      {roleVariants.map((role) => (
        <RoleVariantCard
          key={role.id}
          role={role}
          isSelected={selectedRole === role.role}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
