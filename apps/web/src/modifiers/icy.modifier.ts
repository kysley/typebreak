import { WordModifier } from '.';
import { wordsStateAtom } from '../state';

// when a word is frozen it needs to be typed twice
// icy is the modifier, icy things are frozen
export function icyWordFactory(): WordModifier {
  return {
    type: 'ICY',
    trigger: 'SPACE',
    onTrigger: ({ set }, self, index) => {
      if (self.input === self.name && self.frozen) {
        set(wordsStateAtom(index), (prev) => ({
          ...prev,
          frozen: false,
          input: '',
        }));
        return true;
      }
    },
  };
}
