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

export const wordsState = atomFamily({
  key: 'wordsState',
  default: selectorFamily({
    key: 'wordsState/default',
    get:
      (param: number) =>
      ({ get }) => {
        const word = get(wordsAtom)[param];
        return {
          name: word,
          perfect: false, // completed without mistakes, allowing backspaces
          flawless: false, // completed without mistakes , no backspaces
        };
      },
  }),
});

export const wordsStateAtCurrentIndex = selector({
  key: 'wordsState/currentIndex',
  get: ({ get }) => {
    const currentIndex = get(indexAtom);
    return get(wordsState(currentIndex));
  },
});

// this could become atomfamily to keep input per word
export const inputAtom = atom<string[]>({
  key: 'inputAtom',
  default: [''],
});

export const inputAtIndex = selectorFamily({
  key: 'inputAtom/index',
  get:
    (index: number) =>
    ({ get }) =>
      get(inputAtom)[index] || '',
});

export const inputAtCurrentIndex = selector<string>({
  key: 'inputAtom/cI',
  get: ({ get }) => {
    return get(inputAtom)[get(indexAtom)];
  },
  set: ({ get, set }, value) => {
    const idx = get(indexAtom);
    const abc = get(inputAtom);
    const cpy = [...abc];
    cpy[idx] = value;
    set(inputAtom, cpy);
  },
});

export const indexAtom = atom({
  key: 'indexAtom',
  default: 0,
});

export const currentLetter = selector({
  key: 'indexAtom/letter',
  get: ({ get }) => {
    return get(inputAtCurrentIndex).length;
  },
});
