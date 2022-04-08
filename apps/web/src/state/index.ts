import { atom, atomFamily, selector, selectorFamily } from 'recoil';

export const wordsAtom = atom({
  key: 'wordsAtom',
  default: [
    'own',
    'tell',
    'new',
    'would',
    'face',
    'right',
    'need',
    'hold',
    'under',
    'number',
    'now',
    'say',
    'not',
    'house',
    'consider',
    'by',
    'some',
    'show',
    'now',
    'and',
    'that',
    'line',
    'do',
    'but',
    'life',
    'only',
    'present',
    'tell',
    'to',
    'have',
    'turn',
    'run',
    'back',
    'help',
    'would',
    'old',
    'over',
    'much',
    'he',
    'these',
    'number',
    'while',
    'they',
    'old',
    'it',
    'a',
    'want',
    'should',
    'write',
    'lead',
    'own',
    'tell',
    'new',
    'would',
    'face',
    'right',
    'need',
    'hold',
    'under',
    'number',
    'now',
    'say',
    'not',
    'house',
    'consider',
    'by',
    'some',
    'show',
    'now',
    'and',
    'that',
    'line',
    'do',
    'but',
    'life',
    'only',
    'present',
    'tell',
    'to',
    'have',
    'turn',
    'run',
    'back',
    'help',
    'would',
    'old',
    'over',
    'much',
    'he',
    'these',
    'number',
    'while',
    'they',
    'old',
    'it',
    'a',
    'want',
    'should',
    'write',
    'lead',
  ],
});

export type WordState = {
  name: string;
  perfect: boolean;
  flawless: boolean;
  input: string;
};
export const wordsState = atomFamily({
  key: 'wordsState',
  default: selectorFamily<WordState, number>({
    key: 'wordsState/default',
    get:
      (param: number) =>
      ({ get }) => {
        const word = get(wordsAtom)[param];
        return {
          input: '',
          name: word,
          perfect: false, // completed without mistakes, allowing backspaces
          flawless: false, // completed without mistakes , no backspaces
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
  set: ({ get, set }, newValue) => set(wordsState(get(indexAtom)), newValue),
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
