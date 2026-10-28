'use client';

import { useRef, type SubmitEvent } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import classNames from 'classnames';
import { aiMenuActions } from '../../model/ai-actions';
import {
  aiPromptSchema,
  AI_PROMPT_MAX_LENGTH,
  type AiPromptValues,
} from '../../model/ai-prompt-schema';
import styles from './AiPromptForm.module.css';
import { useAiGeneration } from '../../lib/use-ai-generation';
import type { AiApplyMode } from '../../model/ai-types';
import { AiResult } from '../ai-result/AiResult';
import { AiGenerationError } from './AiGenerationError';
import type { AiAction } from '@entities/ai-assistant';
import InfoIcon from '@shared/assets/icons/info.svg';
import LockIcon from '@shared/assets/icons/ai-lock.svg';
import MessageIcon from '@shared/assets/icons/ai-message.svg';
import RetryIcon from '@shared/assets/icons/ai-retry.svg';
import WaitingIcon from '@shared/assets/icons/ai-waiting.svg';
import GenerateIcon from '@shared/assets/icons/ai-generate.svg';
import ConflictGenerateIcon from '@shared/assets/icons/ai-conflict-generate.svg';
import { Button } from '@shared/ui/button';
import { Typography } from '@shared/ui/typography';
import { FormError } from '@shared/ui/form-error';

const suggestions = ['Резюме страницы', 'Составить чек-лист', 'Описание компонента'];

type AiPromptFormProps = {
  action: AiAction;
  selectedText: string;
  originalText: string;
  onActionChange: (action: AiAction) => void;
  onCancel: () => void;
  onApply: (text: string, mode: AiApplyMode) => void;
};

export function AiPromptForm({
  action,
  selectedText,
  originalText,
  onActionChange,
  onCancel,
  onApply,
}: AiPromptFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    setFocus,
    setError,
    formState: { errors },
  } = useForm<AiPromptValues>({
    resolver: zodResolver(aiPromptSchema),
    defaultValues: { prompt: '' },
  });
  const prompt = useWatch({ control, name: 'prompt' });
  const { generate, reset, stop, regenerate, isLoading, status, resultText, error, fieldErrors } =
    useAiGeneration();

  const formRef = useRef<HTMLFormElement>(null);
  const hasSelection = selectedText.length > 0;
  const canSubmit = prompt.trim().length > 0 && !isLoading;
  const hasResult =
    status === 'streaming' ||
    status === 'done' ||
    status === 'stopped' ||
    (status === 'error' && resultText.length > 0);
  const isWaiting = isLoading && !hasResult;
  const isConflict = error?.kind === 'conflict';
  const showInput = !hasResult && status !== 'error';

  const onSubmit = async ({ prompt: value }: AiPromptValues) => {
    if (!canSubmit) return;

    const text = [value.trim(), selectedText.trim()].filter(Boolean).join('\n\n');
    if (text.length > AI_PROMPT_MAX_LENGTH) {
      setError('prompt', {
        message: 'Запрос вместе с выделенным текстом не должен превышать 20 000 символов',
      });
      return;
    }

    await generate({ action, text });
  };

  const handleFormSubmit = (event: SubmitEvent<HTMLFormElement>) => handleSubmit(onSubmit)(event);

  return (
    <form ref={formRef} className={styles.form} onSubmit={handleFormSubmit}>
      <div className={styles.modes} role="group" aria-label="Режим ИИ">
        {aiMenuActions.map(({ action: value, label, icon }) => {
          const Icon = icon;
          return (
            <Button
              key={value}
              variant="clear"
              className={classNames(styles.mode, { [styles.modeActive]: value === action })}
              aria-pressed={value === action}
              disabled={isLoading}
              onClick={() => {
                reset();
                onActionChange(value);
              }}
            >
              <span className={styles.modeIcon}>
                <Icon />
              </span>
              {label}
            </Button>
          );
        })}
      </div>
      {hasSelection && !hasResult && (
        <>
          {status === 'idle' && !isLoading && (
            <Typography variant="caption" className={styles.selectionHint}>
              <InfoIcon aria-hidden /> Работает с выделенным текстом
            </Typography>
          )}
          <div
            className={classNames(styles.selection, {
              [styles.selectionDisabled]: isWaiting,
              [styles.selectionCompact]: status === 'error',
            })}
          >
            <Typography variant="caption" className={styles.selectionCount}>
              Выбрано: {selectedText.length.toLocaleString('ru-RU')} символов
            </Typography>
            {status !== 'error' && (
              <Typography className={styles.selectionText}>«{selectedText}»</Typography>
            )}
          </div>
        </>
      )}
      {showInput ? (
        <div
          className={classNames(styles.prompt, {
            [styles.writePrompt]: !hasSelection,
            [styles.promptDisabled]: isLoading,
          })}
        >
          <textarea
            {...register('prompt')}
            autoFocus
            aria-label={hasSelection ? 'Что сделать с текстом?' : 'Запрос к ИИ'}
            placeholder={
              action === 'write'
                ? 'Что написать? Опишите задачу…'
                : hasSelection
                  ? 'Что сделать с текстом? (необязательно)'
                  : 'Введите текст, который нужно изменить…'
            }
            maxLength={AI_PROMPT_MAX_LENGTH}
            className={styles.textarea}
            disabled={isLoading}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                event.preventDefault();
                formRef.current?.requestSubmit();
              }
            }}
          />
          <Typography variant="caption" className={styles.counter}>
            {isLoading && <LockIcon aria-hidden />}
            {prompt.length.toLocaleString('ru-RU')} / {AI_PROMPT_MAX_LENGTH.toLocaleString('ru-RU')}
          </Typography>
        </div>
      ) : (
        status !== 'done' && (
          <div className={styles.promptSummary}>
            <MessageIcon aria-hidden />
            <span>{prompt}</span>
            {isLoading && <LockIcon aria-hidden />}
          </div>
        )
      )}
      <FormError message={errors.prompt?.message ?? fieldErrors.prompt ?? null} />
      {error && <AiGenerationError error={error} />}
      {hasResult && (
        <AiResult
          text={resultText}
          originalText={selectedText || originalText}
          hasSelection={hasSelection}
          status={status}
          isLoading={isLoading}
          onStop={stop}
          onRegenerate={regenerate}
          onCancel={onCancel}
          onApply={onApply}
        />
      )}
      {isWaiting && (
        <div className={styles.waiting} role="status">
          <div className={styles.waitingDots} aria-hidden>
            <span />
            <span />
            <span />
          </div>
          <Typography className={styles.waitingTitle}>ИИ думает…</Typography>
          <Typography variant="caption" className={styles.waitingDescription}>
            Отправили запрос, ожидаем ответ сервера
          </Typography>
          <div className={styles.skeleton} aria-hidden>
            <span />
            <span />
            <span />
          </div>
        </div>
      )}
      {!hasSelection && status === 'idle' && !isLoading && (
        <div className={styles.suggestions} aria-label="Примеры запросов">
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion}
              variant="clear"
              className={styles.suggestion}
              onClick={() => {
                setValue('prompt', suggestion, { shouldDirty: true });
                setFocus('prompt');
              }}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      )}
      {!hasResult && (
        <footer className={styles.footer}>
          {isWaiting ? (
            <div className={styles.waitingHint}>
              <LockIcon aria-hidden />
              <span>
                Сгенерировать нельзя,
                <br />
                пока идёт генерация
              </span>
            </div>
          ) : (
            status !== 'error' && (
              <div className={styles.shortcuts}>
                <span>Enter — отправить</span>
                <span>Shift+Enter — новая строка</span>
              </div>
            )
          )}
          <div className={styles.footerActions}>
            <Button
              variant={isWaiting || status === 'error' ? 'outline' : 'clear'}
              className={styles.cancel}
              onClick={onCancel}
            >
              {status === 'error' && !isConflict ? 'Закрыть' : 'Отмена'}
            </Button>
            <Button
              variant={error?.kind === 'unavailable' ? 'outline' : 'filled'}
              size="sm"
              type={status === 'error' ? 'button' : 'submit'}
              className={classNames(styles.generate, {
                [styles.generateDisabled]: isWaiting || isConflict,
                [styles.retryUnavailable]: error?.kind === 'unavailable',
              })}
              disabled={!canSubmit || isConflict}
              aria-busy={isLoading}
              title={isWaiting || isConflict ? 'Одна генерация одновременно' : undefined}
              onClick={status === 'error' ? regenerate : undefined}
            >
              {isWaiting ? (
                <WaitingIcon className={styles.spinner} aria-hidden />
              ) : status === 'error' && !isConflict && error?.kind !== 'unavailable' ? (
                <RetryIcon aria-hidden />
              ) : isConflict ? (
                <ConflictGenerateIcon aria-hidden />
              ) : status !== 'error' ? (
                <GenerateIcon aria-hidden />
              ) : null}
              {status === 'error' && !isConflict ? 'Повторить' : 'Сгенерировать'}
            </Button>
          </div>
        </footer>
      )}
    </form>
  );
}
