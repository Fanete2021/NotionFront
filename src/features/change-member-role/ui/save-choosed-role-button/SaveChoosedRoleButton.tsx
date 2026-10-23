import { ReactNode } from 'react';
import { Button } from '@/shared/ui/button';

interface SaveChoosedRoleButtonProps {
  children?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export function SaveChoosedRoleButton({ children, onClick, disabled }: SaveChoosedRoleButtonProps) {
  return (
    <Button variant="filled" onClick={onClick} disabled={disabled}>
      {children}
    </Button>
  );
}
