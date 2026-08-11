import {
  clearRegistrationDraft,
  readRegistrationDraft,
  saveRegistrationDraft,
} from './registrationDraft';

export const useRegistrationDraft = () => {
  return {
    readRegistrationDraft,
    clearRegistrationDraft,
    saveRegistrationDraft,
  };
};
