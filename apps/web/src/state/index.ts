import { atom, atomFamily, selector, selectorFamily } from "recoil";

export const wordsAtom = atom({
  key: "wordsAtom",
  default: [
    "today",
    "is",
    "the",
    "day",
    "is",
    "the",
    "day",
    "is",
    "the",
    "day",
    "today",
    "is",
    "the",
    "day",
    "is",
    "the",
    "day",
    "is",
    "the",
    "day",
    "today",
    "is",
    "the",
    "day",
    "is",
    "the",
    "day",
    "is",
    "the",
    "day",
    "today",
    "is",
    "the",
    "day",
    "is",
    "the",
    "day",
    "is",
    "the",
    "day",
    "today",
    "is",
    "the",
    "day",
    "is",
    "the",
    "day",
    "is",
    "the",
    "day",
    "today",
    "is",
    "the",
    "day",
    "is",
    "the",
    "day",
    "is",
    "the",
    "day",
    "today",
    "is",
    "the",
    "day",
    "is",
    "the",
    "day",
    "is",
    "the",
    "day",
  ],
});

export const wordsState = atomFamily({
  key: "wordsState",
  default: selectorFamily({
    key: "wordsState/default",
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
  key: "inputAtom",
  default: [""],
});

export const inputAtIndex = selectorFamily({
  key: "inputAtom/index",
  get:
    (index: number) =>
    ({ get }) =>
      get(inputAtom)[index] || "",
});

export const indexAtom = atom({
  key: "indexAtom",
  default: 0,
});

export const currentLetter = selector({
  key: "indexAtom/letter",
  get: ({ get }) => {
    const word = get(wordsAtom);
    const idx = get(indexAtom);
    const expected = word[idx];
    const got = get(inputAtIndex(idx));

    return got.length;
    let inputLength = get(inputAtom)[get(indexAtom)].length + 1;
    // if (inputLength === 0) inputLength = 1;
    // else inputLength += 1;

    return inputLength;
  },
});
