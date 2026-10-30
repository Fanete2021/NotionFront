import type { ComponentType, SVGProps } from 'react';
import { AiAction } from '@entities/ai-assistant';
import WriteIcon from '@shared/assets/icons/write.svg';
import ImproveIcon from '@shared/assets/icons/improve.svg';
import ShortenIcon from '@shared/assets/icons/shorten.svg';
import GrammarIcon from '@shared/assets/icons/grammar.svg';
import TranslateIcon from '@shared/assets/icons/translate.svg';

type ActionIcon = ComponentType<SVGProps<SVGSVGElement>>;

type AiMenuAction = {
  action: AiAction;
  label: string;
  menuLabel: string;
  icon: ActionIcon;
};

export const aiActions: AiMenuAction[] = [
  {
    action: 'improve',
    label: 'Улучшить',
    menuLabel: 'Улучшить',
    icon: ImproveIcon,
  },
  {
    action: 'summarize',
    label: 'Сократить',
    menuLabel: 'Сократить',
    icon: ShortenIcon,
  },
  {
    action: 'fix_grammar',
    label: 'Исправить грамматику',
    menuLabel: 'Исправить грамматику',
    icon: GrammarIcon,
  },
  {
    action: 'translate',
    label: 'Перевести',
    menuLabel: 'Перевести',
    icon: TranslateIcon,
  },
  {
    action: 'write',
    label: 'Написать',
    menuLabel: 'Спросить ИИ…',
    icon: WriteIcon,
  },
];

export const aiMenuActions: AiMenuAction[] = [aiActions[4], ...aiActions.slice(0, 2)];
