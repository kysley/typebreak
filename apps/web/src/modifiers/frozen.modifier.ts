import { WordModifier } from '.';

export function frozenWordFactory(): WordModifier {
  return {
    type: 'FROZEN',
    trigger: 'SPACE',
    onTrigger: ({ modifyWord }, self, index) => {
      if (self.input === self.name && self.frozen) {
        modifyWord({ frozen: false, input: '' });
        return true;
      }
    },
  };
}
