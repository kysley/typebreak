import { WordState } from '../state';

type ModifierExecuteTriggerType = 'SPACE' | 'BACKSPACE' | 'TYPE' | 'INCORRECT';

type ModifierTypes = 'MINE' | 'FROZEN';

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
export { frozenWordFactory } from './frozen.modifier';
/*

word -> type
type: {
  trigger: backspace, type, space
  execute: ({addWord, modifyWord}, self) => {
    // do things here
  }
}

*/
