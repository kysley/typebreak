import { WordState } from '../state';

type ModifierExecuteTriggerType = 'SPACE' | 'BACKSPACE' | 'TYPE' | 'INCORRECT';

type ModifierTypes = 'MINE' | 'ICY';

export type WordModifier = {
  type: ModifierTypes;
  trigger: ModifierExecuteTriggerType;
  onTrigger: (
    {
      addWord,
      modifyWord,
    }: {
      addWord: (word: Partial<WordState>, index?: number) => void;
      modifyWord: (newWord: Partial<WordState>, index?: number) => void;
    },
    self: WordState,
    index: number,
  ) => boolean | undefined;
};

export { mineModifierFactory } from './mine.modifier';
export { icyWordFactory } from './icy.modifier';
