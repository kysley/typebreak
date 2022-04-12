// Hitting a mine (typing an incorrect character)
// will remove the next 3 words from being able to be typed
// the initial idea behind this is to punish the player for typing this specific word incorrect

import { WordModifier } from '.';

// removing the next 3 words will impact accuracy, what else?
export function mineModifierFactory(): WordModifier {
  return {
    type: 'MINE',
    trigger: 'TYPE',
    onTrigger: ({ modifyWord }, self, index) => {
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
