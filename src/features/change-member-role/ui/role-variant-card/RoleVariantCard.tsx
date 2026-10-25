import { RoleVariant } from '../../utils/roleVariants';
import styles from './RoleVariantCard.module.css';
import { WorkspaceRole } from '@/entities/workspace-members';
import { Typography } from '@/shared/ui/typography';
import { Badge } from '@/shared/ui/badge';
import { roleColors, roleLabels } from '@/shared/const/role';

interface RoleVariantCardProps {
  role: RoleVariant;
  isSelected: boolean;
  onSelect: (role: WorkspaceRole) => void;
}

export function RoleVariantCard({ role, isSelected, onSelect }: RoleVariantCardProps) {
  return (
    <div
      className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
      onClick={() => onSelect(role.role)}
    >
      <div className={`${styles.radioIcon} ${isSelected ? styles.radioIconSelected : ''}`} />
      <div className={styles.info}>
        <div className={styles.roleContainer}>
          <Typography variant="text-medium" className={styles.role}>
            {roleLabels[role.role]}
          </Typography>
          <Badge
            className={styles.badge}
            fontSize="10px"
            fontWeight="500"
            padding="1px 6px"
            text={roleLabels[role.role]}
            color={roleColors[role.role].color}
            bgColor={roleColors[role.role].bgColor}
          />
        </div>
        <Typography variant="caption" className={styles.description}>
          {role.description}
        </Typography>
      </div>
    </div>
  );
}
