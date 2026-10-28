'use client';

import { useEffect, useRef } from 'react';
import classNames from 'classnames';
import type { AiApplyMode, AiResultStatus } from '../../model/ai-types';
import { AiMarkdown } from './AiMarkdown';
import styles from './AiResult.module.css';
import ReadyIcon from '@shared/assets/icons/ai-ready.svg';
import StopIcon from '@shared/assets/icons/ai-stop.svg';
import StreamingIcon from '@shared/assets/icons/ai-streaming.svg';
import GenerateIcon from '@shared/assets/icons/ai-generate.svg';
import CompareIcon from '@shared/assets/icons/ai-compare.svg';
import ChevronIcon from '@shared/assets/icons/ai-chevron.svg';
import RegenerateIcon from '@shared/assets/icons/ai-regenerate.svg';
import ApplyIcon from '@shared/assets/icons/ai-apply.svg';
import { Button } from '@shared/ui/button';

type AiResultProps = {
  text: string;
  originalText: string;
  hasSelection: boolean;
  status: AiResultStatus;
  isLoading: boolean;
  onStop: () => void;
  onRegenerate: () => void;
  onCancel: () => void;
  onApply: (text: string, mode: AiApplyMode) => void;
};

export function AiResult({
  text,
  originalText,
  hasSelection,
  status,
  isLoading,
  onStop,
  onRegenerate,
  onCancel,
  onApply,
}: AiResultProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const followOutput = useRef(true);
  const isDone = status === 'done';

  useEffect(() => {
    const preview = previewRef.current;
    if (preview && isLoading && followOutput.current) preview.scrollTop = preview.scrollHeight;
  }, [text, isLoading]);

  return (
    <>
      <div
        className={classNames(styles.resultHeading, {
          [styles.ready]: isDone,
          [styles.streamingHeading]: isLoading,
        })}
        role="status"
      >
        <span className={styles.statusLabel}>
          {isDone ? (
            <span className={styles.readyIcon}>
              <ReadyIcon aria-hidden />
            </span>
          ) : isLoading ? (
            <span className={styles.dot} aria-hidden />
          ) : null}
          {isDone
            ? 'Результат готов'
            : isLoading
              ? 'Генерируем…'
              : status === 'stopped'
                ? 'Генерация остановлена'
                : 'Генерация прервана'}
        </span>
        <span className={styles.count}>Символов: {text.length.toLocaleString('ru-RU')}</span>
      </div>
      <div
        ref={previewRef}
        className={classNames(styles.preview, { [styles.streaming]: isLoading })}
        onScroll={() => {
          const preview = previewRef.current;
          if (preview)
            followOutput.current =
              preview.scrollHeight - preview.scrollTop - preview.clientHeight < 40;
        }}
        tabIndex={0}
        role="region"
        aria-label="Сгенерированный текст"
        aria-busy={isLoading}
      >
        <AiMarkdown text={text} />
      </div>
      {isDone && (
        <details className={styles.comparison}>
          <summary>
            <CompareIcon aria-hidden /> Сравнить с оригиналом{' '}
            <ChevronIcon className={styles.chevron} aria-hidden />
          </summary>
          <div className={styles.comparisonColumns}>
            <section>
              <h4>Оригинал</h4>
              <p className={styles.original}>{originalText || 'Пустой документ'}</p>
            </section>
            <section>
              <h4>Результат ИИ</h4>
              <AiMarkdown text={text} />
            </section>
          </div>
        </details>
      )}
      <footer className={styles.footer}>
        {isLoading ? (
          <>
            <span className={styles.hint}>
              <StreamingIcon className={styles.spinner} aria-hidden />
              <span>
                Идёт генерация — текст
                <br />
                появляется постепенно
              </span>
            </span>
            <div className={styles.actions}>
              <Button variant="outline" className={styles.stop} onClick={onStop}>
                <StopIcon aria-hidden /> Остановить
              </Button>
              <Button variant="filled" className={styles.generate} disabled>
                <GenerateIcon aria-hidden /> Сгенерировать
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className={styles.actions}>
              <Button variant="clear" onClick={onRegenerate}>
                <RegenerateIcon aria-hidden /> Перегенерировать
              </Button>
              <Button variant="clear" className={styles.reject} onClick={onCancel}>
                Отклонить
              </Button>
            </div>
            {isDone && (
              <div className={styles.actions}>
                <Button
                  variant="outline"
                  className={styles.insert}
                  onClick={() => onApply(text, 'insert-below')}
                  disabled={!text}
                >
                  Вставить ниже
                </Button>
                <Button
                  variant="filled"
                  className={styles.apply}
                  onClick={() => onApply(text, 'replace')}
                  disabled={!text}
                >
                  <ApplyIcon aria-hidden /> {hasSelection ? 'Заменить' : 'Вставить'}
                </Button>
              </div>
            )}
            {status === 'stopped' && (
              <span className={styles.stoppedHint}>
                Текст сохранён в предпросмотре и не применён к документу
              </span>
            )}
          </>
        )}
      </footer>
    </>
  );
}
