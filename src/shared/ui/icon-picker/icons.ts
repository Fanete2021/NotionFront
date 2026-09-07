import FolderIcon from '@/shared/assets/icons/folder.svg';
import BagIcon from '@/shared/assets/icons/bag.svg';
import TargetIcon from '@/shared/assets/icons/target.svg';
import RocketIcon from '@/shared/assets/icons/rocket.svg';
import StarIcon from '@/shared/assets/icons/star.svg';
import BulbIcon from '@/shared/assets/icons/bulb.svg';
import DocsIcon from '@/shared/assets/icons/docs.svg';
import PageIcon from '@/shared/assets/icons/page.svg';
import PageXIcon from '@/shared/assets/icons/page-x.svg';
import HomeIcon from '@/shared/assets/icons/home.svg';

export const PROJECT_ICONS = {
  folder: FolderIcon,
  card: BagIcon,
  layers: TargetIcon,
  rocket: RocketIcon,
  star: StarIcon,
  calendar: BulbIcon,
};

export const DOCUMENT_ICONS = {
  page: PageIcon,
  docs: DocsIcon,
  'page-x': PageXIcon,
  rocket: RocketIcon,
  card: BagIcon,
  bulb: BulbIcon,
  home: HomeIcon,
};

export type ProjectIconName = keyof typeof PROJECT_ICONS;

export const ICONS = Object.keys(PROJECT_ICONS) as ProjectIconName[];

export const getProjectIcon = (name?: string | null) =>
  name && name in PROJECT_ICONS ? PROJECT_ICONS[name as ProjectIconName] : null;

export const getIconByName = (name?: string | null) => {
  if (!name) return null;
  if (name in PROJECT_ICONS) return PROJECT_ICONS[name as ProjectIconName];
  if (name in DOCUMENT_ICONS) return DOCUMENT_ICONS[name as keyof typeof DOCUMENT_ICONS];

  return null;
};
