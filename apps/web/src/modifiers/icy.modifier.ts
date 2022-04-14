import { WordModifier } from '.';

// when a word is frozen it needs to be typed twice
// icy is the modifier, icy things are frozen
export function icyWordFactory(): WordModifier {
  return {
    type: 'ICY',
    trigger: 'SPACE',
    onTrigger: ({ modifyWord }, self, index) => {
      if (self.input === self.name && self.frozen) {
        modifyWord({ frozen: false, input: '' });
        return true;
      }
    },
  };
}
