import { FC, SVGProps } from 'react';

export type SettingsSection =
  'profile' | 'notifications' | 'integrations' | 'appearance' | 'security' | 'billing';

export interface SettingsNavItem {
  id: SettingsSection;
  title: string;
  href: string;
  icon: FC<SVGProps<SVGSVGElement>>;
}
