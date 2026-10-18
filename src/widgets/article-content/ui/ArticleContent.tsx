import type { JSONContent } from '@tiptap/core';
import styles from './ArticleContent.module.css';
import { ArticleNode } from './ArticleNode';

type ArticleContentProps = { content: JSONContent };

export const ArticleContent = ({ content }: ArticleContentProps) => (
  <div className={styles.content}>
    <ArticleNode node={content} />
  </div>
);
