import classNames from 'classnames';
import type { AiGenerationError as AiGenerationErrorData } from '../../model/ai-types';
import styles from './AiPromptForm.module.css';
import ConflictIcon from '@shared/assets/icons/ai-conflict.svg';
import UnavailableIcon from '@shared/assets/icons/ai-unavailable.svg';
import ErrorIcon from '@shared/assets/icons/ai-error.svg';

export function AiGenerationError({ error }: { error: AiGenerationErrorData }) {
  const Icon =
    error.kind === 'conflict'
      ? ConflictIcon
      : error.kind === 'unavailable'
        ? UnavailableIcon
        : ErrorIcon;

  return (
    <div className={classNames(styles.error, styles[error.kind])} role="alert">
      <Icon aria-hidden />
      <div>
        <p className={styles.errorTitle}>{error.title}</p>
        <p className={styles.errorDescription}>{error.description}</p>
      </div>
    </div>
  );
}
