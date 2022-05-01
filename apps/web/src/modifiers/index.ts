import { CallbackInterface, Snapshot } from 'recoil';
import { WordState } from '../state';

export type ModifierExecuteTriggerType =
  | 'SPACE'
  | 'BACKSPACE'
  | 'TYPE'
  | 'INCORRECT';

export type ModifierTypes = 'MINE' | 'ICY' | 'CAMO';

export type WordModifier = {
  type: ModifierTypes;
  trigger?: ModifierExecuteTriggerType;
  onTrigger?: (
    {
      snapshot,
      set,
    }: {
      snapshot: Snapshot;
      set: CallbackInterface['set'];
    },
    self: WordState,
    index: number,
  ) => boolean | undefined;
};

export { mineModifierFactory } from './mine.modifier';
export { icyWordFactory } from './icy.modifier';
export { camoWordFactory } from './camo.modifier';
