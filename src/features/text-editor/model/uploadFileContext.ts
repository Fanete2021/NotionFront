import { createContext } from 'react';

export type UploadFile = (file: File, signal?: AbortSignal) => Promise<string>;

export const UploadFileContext = createContext<UploadFile | null>(null);
