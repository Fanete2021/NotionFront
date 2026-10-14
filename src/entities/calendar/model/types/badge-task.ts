type BadgeColor = 'green' | 'yellow' | 'red' | 'indigo';

export interface BadgeTask {
  id: string;
  date: string;
  name: string;
  color: BadgeColor;
  projectName?: string;
}
