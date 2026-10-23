import type { ReactNode } from 'react';
import type { JSONContent } from '@tiptap/core';
import styles from './ArticleContent.module.css';
import { getSafeUrl } from '../lib/getSafeUrl';
import { getTiptapText } from '@shared/lib/tiptap/getTiptapText';
import { Checkbox } from '@shared/ui/checkbox';

type ArticleNodeProps = { node: JSONContent };

const stringAttribute = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined;

const integerAttribute = (value: unknown): number | undefined =>
  typeof value === 'number' && Number.isInteger(value) ? value : undefined;

const dimensionAttribute = (value: unknown): number | undefined => {
  const dimension = typeof value === 'string' ? Number(value) : value;
  return typeof dimension === 'number' && Number.isFinite(dimension) && dimension > 0
    ? dimension
    : undefined;
};

const columnWidth = (value: unknown): number | undefined => {
  if (!Array.isArray(value)) return undefined;
  const width = value.reduce<number>(
    (total, item: unknown) => total + (dimensionAttribute(item) ?? 0),
    0,
  );
  return width || undefined;
};

const renderText = (node: JSONContent): ReactNode => {
  let text: ReactNode = node.text ?? '';

  for (const mark of node.marks ?? []) {
    switch (mark.type) {
      case 'bold':
        text = <strong>{text}</strong>;
        break;
      case 'italic':
        text = <em>{text}</em>;
        break;
      case 'underline':
        text = <u>{text}</u>;
        break;
      case 'strike':
        text = <s>{text}</s>;
        break;
      case 'code':
        text = <code>{text}</code>;
        break;
      case 'textStyle': {
        const color = stringAttribute(mark.attrs?.color);
        if (color) text = <span style={{ color }}>{text}</span>;
        break;
      }
      case 'link': {
        const href = getSafeUrl(mark.attrs?.href);
        const target = mark.attrs?.target === '_blank' ? '_blank' : undefined;
        if (href)
          text = (
            <a href={href} target={target} rel={target ? 'noopener noreferrer' : undefined}>
              {text}
            </a>
          );
        break;
      }
    }
  }

  return text;
};

export const ArticleNode = ({ node }: ArticleNodeProps) => {
  const children = (node.content ?? []).map((child, index) => (
    <ArticleNode key={index} node={child} />
  ));

  switch (node.type) {
    case 'doc':
      return <>{children}</>;
    case 'text':
      return <>{renderText(node)}</>;
    case 'paragraph':
      return <p>{children.length ? children : <br />}</p>;
    case 'hardBreak':
      return <br />;
    case 'heading': {
      switch (node.attrs?.level) {
        case 1:
          return <h1>{children}</h1>;
        case 3:
          return <h3>{children}</h3>;
        case 4:
          return <h4>{children}</h4>;
        case 5:
          return <h5>{children}</h5>;
        case 6:
          return <h6>{children}</h6>;
        default:
          return <h2>{children}</h2>;
      }
    }
    case 'blockquote':
      return <blockquote>{children}</blockquote>;
    case 'bulletList':
      return <ul>{children}</ul>;
    case 'orderedList':
      return <ol start={integerAttribute(node.attrs?.start)}>{children}</ol>;
    case 'listItem':
      return <li>{children}</li>;
    case 'taskList':
      return <ul className={styles.checklist}>{children}</ul>;
    case 'taskItem':
      return (
        <li className={styles.taskItem}>
          <Checkbox
            checked={node.attrs?.checked === true}
            readOnly
            aria-label={getTiptapText(node) || 'Пункт списка задач'}
            labelClassName={styles.checklistLabel}
          />
          <div>{children}</div>
        </li>
      );
    case 'codeBlock':
      return (
        <pre
          tabIndex={0}
          aria-label={`Пример кода${typeof node.attrs?.language === 'string' ? `: ${node.attrs.language}` : ''}`}
        >
          <code>{getTiptapText(node)}</code>
        </pre>
      );
    case 'horizontalRule':
      return <hr />;
    case 'image': {
      const src = getSafeUrl(node.attrs?.src, true);
      if (!src) return <p className={styles.notice}>Изображение недоступно.</p>;
      // В JSON TipTap размеры изображения необязательны; сохраняем его естественные пропорции.
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={stringAttribute(node.attrs?.alt) ?? ''}
          title={stringAttribute(node.attrs?.title)}
          width={dimensionAttribute(node.attrs?.width)}
          height={dimensionAttribute(node.attrs?.height)}
          loading="lazy"
          className={styles.media}
        />
      );
    }
    case 'video': {
      const src = getSafeUrl(node.attrs?.src, true);
      if (!src) return <p className={styles.notice}>Видео недоступно.</p>;
      return (
        <video
          src={src}
          poster={getSafeUrl(node.attrs?.poster, true)}
          controls
          preload="metadata"
          className={styles.media}
        >
          Ваш браузер не поддерживает воспроизведение видео.
        </video>
      );
    }
    case 'table':
      return (
        <div className={styles.tableWrapper}>
          <table>
            <tbody>{children}</tbody>
          </table>
        </div>
      );
    case 'tableRow':
      return <tr>{children}</tr>;
    case 'tableHeader':
      return (
        <th
          colSpan={integerAttribute(node.attrs?.colspan)}
          rowSpan={integerAttribute(node.attrs?.rowspan)}
          style={{ width: columnWidth(node.attrs?.colwidth) }}
        >
          {children}
        </th>
      );
    case 'tableCell':
      return (
        <td
          colSpan={integerAttribute(node.attrs?.colspan)}
          rowSpan={integerAttribute(node.attrs?.rowspan)}
          style={{ width: columnWidth(node.attrs?.colwidth) }}
        >
          {children}
        </td>
      );
    case 'imageUpload':
      return <p className={styles.notice}>Изображение ещё не загружено.</p>;
    case 'videoUpload':
      return <p className={styles.notice}>Видео ещё не загружено.</p>;
    default:
      return children.length ? (
        <>{children}</>
      ) : (
        <span className={styles.notice}>Этот блок пока не поддерживается.</span>
      );
  }
};
