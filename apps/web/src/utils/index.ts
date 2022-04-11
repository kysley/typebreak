import { WordState } from '../state';

type ModifierExecuteTriggerType = 'SPACE' | 'BACKSPACE' | 'TYPE' | 'INCORRECT';

type ModifierTypes = 'MINE';

export type WordModifier = {
  type: ModifierTypes;
  trigger: ModifierExecuteTriggerType;
  execute: (
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

// Hitting a mine (typing an incorrect character)
// will remove the next 3 words from being able to be typed
// the initial idea behind this is to punish the player for typing this specific word incorrect
// removing the next 3 words will impact accuracy, what else?
export function mineModifierFactory(): WordModifier {
  return {
    type: 'MINE',
    trigger: 'TYPE',
    execute: ({ modifyWord }, self, index) => {
      // const inputLength = self.input.length;
      console.log(self.input, self.name.substring(0, self.input.length));
      if (self.input !== self.name.substring(0, self.input.length)) {
        modifyWord({ destroyed: true });
        modifyWord({ destroyed: true }, index + 1);
        modifyWord({ destroyed: true }, index + 2);
        modifyWord({ destroyed: true }, index + 3);
        return true;
      }
      // return false;
    },
  };
}

/*

word -> type
type: {
  trigger: backspace, type, space
  execute: ({addWord, modifyWord}, self) => {
    // do things here
  }
}

*/
