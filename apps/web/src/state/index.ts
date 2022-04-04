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
          done: false,
          perfect: false,
          hidden: false,
        };
      },
  }),
});

// this could become atomfamily to keep input per word
export const inputAtom = atom<string[]>({
  key: 'inputAtom',
  default: [''],
});

export const inputAsString = selector({
  key: 'inputAtom/string',
  get: ({ get }) => get(inputAtom).join(' '),
});

export const inputAtIndex = selectorFamily({
  key: 'inputAtom/index',
  get:
    (index: number) =>
    ({ get }) =>
      get(inputAtom)[index] || '',
});

export const indexAtom = atom({
  key: 'indexAtom',
  default: 0,
});

export const currentLetter = selector({
  key: 'indexAtom/letter',
  get: ({ get }) => {
    const idx = get(indexAtom);
    const got = get(inputAtIndex(idx));

    return got.length;
  },
});
