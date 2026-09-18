import type { ComponentType, SVGProps } from 'react';

export interface SearchItem {
  id: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  path: string;
  description: string;
  lastTimeEdited: string;
}
