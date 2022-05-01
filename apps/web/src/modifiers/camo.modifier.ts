import { WordModifier } from '.';

// can't see the word until it is the current index
// camo is the modifier, camo things are hidden
export function camoWordFactory(): WordModifier {
  return {
    type: 'CAMO',
  };
}
