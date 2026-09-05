import FolderIcon from '@/shared/assets/icons/folder.svg';
import BagIcon from '@/shared/assets/icons/bag.svg';
import TargetIcon from '@/shared/assets/icons/target.svg';
import RocketIcon from '@/shared/assets/icons/rocket.svg';
import StarIcon from '@/shared/assets/icons/star.svg';
import BulbIcon from '@/shared/assets/icons/bulb.svg';

export const PROJECT_ICONS = {
  folder: FolderIcon,
  card: BagIcon,
  layers: TargetIcon,
  rocket: RocketIcon,
  star: StarIcon,
  calendar: BulbIcon,
};

export type ProjectIconName = keyof typeof PROJECT_ICONS;

export const ICONS = Object.keys(PROJECT_ICONS) as ProjectIconName[];

export const getProjectIcon = (name?: string | null) =>
  name && name in PROJECT_ICONS ? PROJECT_ICONS[name as ProjectIconName] : null;
