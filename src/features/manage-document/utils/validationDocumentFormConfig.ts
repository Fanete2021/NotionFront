import * as z from 'zod';

export const DOCUMENT_TYPE = {
  DOCUMENT: 'document',
  SECTION: 'section',
} as const;

export const documentFormSchema = z.object({
  title: z.string().trim().min(1, 'Название документа обязательно'),
  type: z.enum(DOCUMENT_TYPE),
  icon: z.string().nullable(),
  workspaceId: z.string().min(1, 'Рабочее пространство не выбрано'),
});

export type DocumentFormValues = z.infer<typeof documentFormSchema>;
export type DocumentType = DocumentFormValues['type'];
