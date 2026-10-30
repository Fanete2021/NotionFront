import { z } from 'zod';

export const AI_PROMPT_MAX_LENGTH = 20_000;

export const aiPromptSchema = z.object({
  prompt: z.string().max(AI_PROMPT_MAX_LENGTH),
});

export type AiPromptValues = z.infer<typeof aiPromptSchema>;
