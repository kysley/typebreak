import {
  atom,
  atomFamily,
  DefaultValue,
  selector,
  selectorFamily,
} from 'recoil';
import { getWords } from 'wordkit';
import { arcadifyWords } from '../hooks/use-arcade-mode';
import { WordModifier } from '../modifiers';

export const COMBO_LIMIT = 22;

export const wordsAtom = atom({
  key: 'wordsAtom',
  default: arcadifyWords(getWords(50).split(',')),
});

export type WordState = {
  name: string;
  perfect: boolean | null;
  flawless: boolean;
  input: string;
  readonly modifier?: WordModifier;
  destroyed: boolean;
  frozen: boolean;
  id: string;
};
export const wordsStateAtom = atomFamily({
  key: 'wordsState',
  default: selectorFamily({
    key: 'wordsState/default',
    set:
      (id: number) =>
      ({ set, reset }, value: WordState | DefaultValue) => {
        if (value instanceof DefaultValue) {
          reset(wordsStateAtom(id));
          return;
        }
        set(wordsStateAtom(id), value);
      },
    get:
      (param: number) =>
      ({ get }): WordState => {
        return get(wordsAtom)[param];
      },
  }),
});

export const wordsStateAtCurrentIndex = selector<WordState>({
  key: 'wordsState/currentIndex',
  get: ({ get }) => {
    const currentIndex = get(indexAtom);
    return get(wordsStateAtom(currentIndex));
  },
  set: ({ get, set, reset }, newValue) => {
    if (newValue instanceof DefaultValue) {
      reset(wordsStateAtom(get(indexAtom)));
      return;
    }

    set(wordsStateAtom(get(indexAtom)), newValue);
  },
});

export const wordsStateAtPreviousIndex = selector<WordState>({
  key: 'wordsState/previousIndex',
  get: ({ get }) => get(wordsStateAtom(get(indexAtom) - 1)),
});

export const indexAtom = atom({
  key: 'indexAtom',
  default: 0,
});

export const currentLetterAtom = selector({
  key: 'indexAtom/letter',
  get: ({ get }) => {
    return get(wordsStateAtCurrentIndex).input.length;
  },
});

export const timerTypeAtom = atom<'INCREMENTAL' | 'DECREMENTAL'>({
  key: 'timertype',
  default: 'DECREMENTAL',
});

export type TypingState = 'IDLE' | 'STARTED' | 'DONE';
export const typingStateAtom = atom<TypingState>({
  key: 'typingstate',
  default: 'IDLE',
});

export const mistakesAtom = atom<number>({
  key: 'mistakesState',
  default: 0,
});

export const eolAtom = atom({
  key: 'eol',
  default: false,
});

export const ratioCompletedAtom = selector({
  key: 'ratioCompleted',
  get: ({ get }) => `${get(indexAtom)} / ${get(wordsAtom).length})`,
});

// export const comboAtom = atom({
//   key: 'comboAtom',
//   default: 0,
// });

// export const multiplierAtom = selector<number>({
//   key: 'multiplierAtom',
//   get: ({ get }): number => {
//     const combo = get(comboAtom);
//     if (combo < COMBO_LIMIT) {
//       return 1;
//     }
//     return Math.floor(combo / COMBO_LIMIT) + 1;
//     // return Math.floor(get(comboAtom) / COMBO_LIMIT);
//   },
//   set: ({ set, reset }, newValue) => set(comboAtom, 0),
// });
export const multiplierAtom = atom<number>({
  key: 'multiplierAtom',
  default: 1,
  // get: ({ get }): number => {
  //   const combo = get(comboAtom);
  //   if (combo < COMBO_LIMIT) {
  //     return 1;
  //   }
  //   return Math.floor(combo / COMBO_LIMIT) + 1;
  //   // return Math.floor(get(comboAtom) / COMBO_LIMIT);
  // },
  // set: ({ set, reset }, newValue) => set(comboAtom, 0),
});

export const scoreAtom = atom({
  key: 'scoreAtom',
  default: 0,
});

export const focusedAtom = atom({
  key: 'focusedAtom',
  default: 0,
});

// export const eslapsedState = selector({
//   key: 'eslapsedState',
//   get: ({ get }) => {
//     const mode = get(timerTypeAtom);
//     if (mode === 'INCREMENTAL') {
//       return `${get(indexAtom)}/${get(wordsAtom).length}`;
//     }
//   },
// });

function calculateWPM({
  index,
  time,
  wordsState,
}: {
  index: number;
  time: number;
  wordsState: WordState[];
}) {
  let correctWords = 0;
  let incorrectWords = 0;

  for (let i = 0; i <= index; i++) {
    const word = wordsState[i];
    if (word.perfect) correctWords += word.name.length;
    else {
      incorrectWords += word.name
        .split('')
        .findIndex((letter, index) => word.input[index] !== letter);
    }
  }
  const wpm = Math.round(((correctWords + index) * (60 / time)) / 5);
  return wpm;
}
