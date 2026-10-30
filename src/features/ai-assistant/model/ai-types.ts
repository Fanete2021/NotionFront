import { AiAction } from '@entities/ai-assistant';

export type AiSession = {
  initialAction: AiAction;
  selectedText: string;
  originalText: string;
};

export type AiResultStatus = 'idle' | 'streaming' | 'done' | 'stopped' | 'error';

export type AiGenerationError = {
  kind: 'conflict' | 'unavailable' | 'provider' | 'other';
  title: string;
  description: string;
};

export type AiApplyMode = 'replace' | 'insert-below';

export type AiAnchorRect = { left: number; top: number; bottom: number };
