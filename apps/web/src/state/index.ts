import {
  atom,
  atomFamily,
  DefaultValue,
  selector,
  selectorFamily,
} from 'recoil';
import { v4 as uuid } from 'uuid';
import { getWords } from 'wordkit';
import {
  icyWordFactory,
  mineModifierFactory,
  WordModifier,
} from '../modifiers';

export const wordsAtom = atom({
  key: 'wordsAtom',
  default: getWords(50).split(','),
});

export type WordState = {
  name: string;
  perfect: boolean | null;
  flawless: boolean;
  input: string;
  readonly modifier?: WordModifier;
  destroyed: boolean;
  frozen: boolean;
};
export const wordsState = atomFamily({
  key: 'wordsState',
  default: selectorFamily({
    key: 'wordsState/default',
    set:
      (id: number) =>
      ({ set, reset }, value: WordState | DefaultValue) => {
        if (value instanceof DefaultValue) {
          reset(wordsState(id));
          return;
        }
        set(wordsState(id), value);
      },
    get:
      (param: number) =>
      ({ get }): WordState => {
        const word = get(wordsAtom)[param];
        return {
          input: '',
          name: word,
          perfect: null, // completed without mistakes, allowing backspaces
          flawless: false, // completed without mistakes , no backspaces
          destroyed: false,
          frozen: param === 3 ? true : false,
          modifier:
            param === 1
              ? mineModifierFactory()
              : param === 3
              ? icyWordFactory()
              : undefined,
        };
      },
  }),
});

export const wordsStateAtCurrentIndex = selector<WordState>({
  key: 'wordsState/currentIndex',
  get: ({ get }) => {
    const currentIndex = get(indexAtom);
    return get(wordsState(currentIndex));
  },
  set: ({ get, set, reset }, newValue) => {
    if (newValue instanceof DefaultValue) {
      reset(wordsState(get(indexAtom)));
      return;
    }

    set(wordsState(get(indexAtom)), newValue);
  },
});

export const indexAtom = atom({
  key: 'indexAtom',
  default: 0,
});

export const currentLetter = selector({
  key: 'indexAtom/letter',
  get: ({ get }) => {
    return get(wordsStateAtCurrentIndex).input.length;
  },
});

export const timerType = atom<'INCREMENTAL' | 'DECREMENTAL'>({
  key: 'timertype',
  default: 'INCREMENTAL',
});

export type TypingState = 'IDLE' | 'STARTED' | 'DONE';
export const typingState = atom<TypingState>({
  key: 'typingstate',
  default: 'IDLE',
});

export const mistakesState = atom<number>({
  key: 'mistakesState',
  default: 0,
});

export const eolState = atom({
  key: 'eol',
  default: false,
});

export const percentCompleted = selector({
  key: 'percentCompleted',
  get: ({ get }) => get(wordsAtom).length / get(indexAtom),
});
