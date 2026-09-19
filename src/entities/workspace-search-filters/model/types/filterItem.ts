import { FC, SVGProps } from 'react';

export interface FilterOption {
  id: string;
  title: string;
  icon?: FC<SVGProps<SVGSVGElement>>;
}
