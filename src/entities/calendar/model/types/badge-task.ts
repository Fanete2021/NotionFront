type BadgeColor = 'green' | 'yellow' | 'red' | 'indigo';

export interface BadgeTask {
  id: number;
  date: string;
  name: string;
  color: BadgeColor;
}
