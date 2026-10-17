export type PublishedDocumentBlock =
  | { type: 'paragraph' | 'quote'; text: string }
  | { type: 'heading'; level: 2 | 3 | 4; text: string }
  | { type: 'code'; language: string; text: string }
  | { type: 'image'; src: string; alt: string; width: number; height: number }
  | { type: 'video'; src: string; poster?: string }
  | { type: 'checklist'; items: { text: string; checked: boolean }[] };

export interface PublishedDocument {
  slug: string;
  title: string;
  breadcrumbTitle: string;
  description: string;
  icon: string;
  author: { name: string; avatarUrl?: string; description: string };
  publishedAt: string;
  publishedLabel: string;
  readingMinutes: number;
  content: PublishedDocumentBlock[];
}
