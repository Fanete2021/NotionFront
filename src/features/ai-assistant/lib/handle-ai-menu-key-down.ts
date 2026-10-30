import type { KeyboardEvent } from 'react';

export function handleAiMenuKeyDown(event: KeyboardEvent<HTMLUListElement>) {
  const buttons = Array.from(
    event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'),
  );
  if (buttons.length === 0) return;

  const index = buttons.findIndex((button) => button === document.activeElement);
  let next: number;

  switch (event.key) {
    case 'ArrowDown':
      next = (index + 1) % buttons.length;
      break;
    case 'ArrowUp':
      next = index <= 0 ? buttons.length - 1 : index - 1;
      break;
    case 'Home':
      next = 0;
      break;
    case 'End':
      next = buttons.length - 1;
      break;
    default:
      return;
  }

  event.preventDefault();
  buttons[next]?.focus();
}
