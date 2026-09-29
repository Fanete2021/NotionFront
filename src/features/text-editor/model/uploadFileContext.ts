import { createContext } from 'react';

export type UploadFile = (file: File) => Promise<string>;

export const UploadFileContext = createContext<UploadFile | null>(null);
