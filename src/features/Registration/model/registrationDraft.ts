import * as z from 'zod';

const registrationDraftSchema = z.object({
  name: z.string(),
  surname: z.string(),
  email: z.string(),
});

export type RegistrationDraft = z.infer<typeof registrationDraftSchema>;

export const readRegistrationDraft = (): RegistrationDraft | null => {
  try {
    const draft = sessionStorage.getItem('registrationDraft');

    if (!draft) {
      return null;
    }

    const result = registrationDraftSchema.safeParse(JSON.parse(draft));

    return result.success ? result.data : null;
  } catch {
    return null;
  }
};

export const saveRegistrationDraft = (draft: RegistrationDraft) => {
  sessionStorage.setItem('registrationDraft', JSON.stringify(draft));
};

export const clearRegistrationDraft = () => {
  sessionStorage.removeItem('registrationDraft');
};
