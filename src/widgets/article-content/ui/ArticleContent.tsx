import Image from 'next/image';
import styles from './ArticleContent.module.css';
import type { PublishedDocumentBlock } from '@entities/published-document';
import { Checkbox } from '@shared/ui/checkbox';

type ArticleContentProps = { blocks: PublishedDocumentBlock[] };

export const ArticleContent = ({ blocks }: ArticleContentProps) => (
  <div className={styles.content}>
    {blocks.map((block, index) => {
      switch (block.type) {
        case 'image':
          return (
            <Image
              key={index}
              src={block.src}
              alt={block.alt}
              width={block.width}
              height={block.height}
              sizes="(max-width: 768px) calc(100vw - 32px), 720px"
              preload={index === 0}
              className={styles.media}
            />
          );
        case 'video':
          return (
            <video
              key={index}
              src={block.src}
              poster={block.poster}
              controls
              preload="metadata"
              className={styles.media}
            >
              Ваш браузер не поддерживает воспроизведение видео.
            </video>
          );
        case 'heading': {
          const Heading = `h${block.level}` as const;
          return <Heading key={index}>{block.text}</Heading>;
        }
        case 'paragraph':
          return <p key={index}>{block.text}</p>;
        case 'quote':
          return (
            <blockquote key={index}>
              <p>{block.text}</p>
            </blockquote>
          );
        case 'code':
          return (
            <pre key={index} tabIndex={0} aria-label={`Пример кода: ${block.language}`}>
              <code>{block.text}</code>
            </pre>
          );
        case 'checklist':
          return (
            <ul key={index} className={styles.checklist} aria-label="Список задач документа">
              {block.items.map((item) => (
                <li key={item.text}>
                  <Checkbox checked={item.checked} readOnly labelClassName={styles.checklistLabel}>
                    {item.text}
                  </Checkbox>
                </li>
              ))}
            </ul>
          );
      }
    })}
  </div>
);
