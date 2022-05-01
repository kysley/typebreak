// Hitting a mine (typing an incorrect character)
// will remove the next 3 words from being able to be typed
// the initial idea behind this is to punish the player for typing this specific word incorrect

import { WordModifier } from '.';
import { wordsStateAtom } from '../state';

// removing the next 3 words will impact accuracy, what else?
export function mineModifierFactory(): WordModifier {
  return {
    type: 'MINE',
    trigger: 'TYPE',
    onTrigger: ({ set }, self, index) => {
      // const inputLength = self.input.length;
      console.log(self.input, self.name.substring(0, self.input.length));
      if (self.input !== self.name.substring(0, self.input.length)) {
        set(wordsStateAtom(index), (prev) => ({ ...prev, destroyed: true }));
        set(wordsStateAtom(index + 1), (prev) => ({
          ...prev,
          destroyed: true,
        }));
        set(wordsStateAtom(index + 2), (prev) => ({
          ...prev,
          destroyed: true,
        }));
        set(wordsStateAtom(index + 3), (prev) => ({
          ...prev,
          destroyed: true,
        }));
        return true;
      }
      // return false;
    },
  };
}
