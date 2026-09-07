'use client';

import { type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  container?: Element | DocumentFragment;
}

export const Portal = ({ children, container }: PortalProps) => {
  if (typeof document === 'undefined') return null;

  return createPortal(children, container ?? document.body);
};
