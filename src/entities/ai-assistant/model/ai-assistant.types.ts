export type AiAction = 'write' | 'improve' | 'summarize' | 'fix_grammar' | 'translate';

export interface CompleteAiDTO {
  action: AiAction;
  text: string;
}

export interface AiCompleteEntity extends CompleteAiDTO {
  status: string;
}

export interface AiIntermediateData {
  status: 'delta';
  data: Pick<CompleteAiDTO, 'text'>;
}

export type AiSSEEvent =
  | { status: 'status'; data: { status: 'waiting' } }
  | AiIntermediateData
  | { status: 'done'; data: AiCompleteEntity }
  | { status: 'error'; data: { status: 'error'; message: string; statusCode?: number } };

export type GenerateAiArgs = {
  body: CompleteAiDTO;
  onEvent?: (event: AiSSEEvent) => void;
};
