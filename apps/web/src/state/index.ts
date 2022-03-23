import { atom, atomFamily, selectorFamily } from "recoil";

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

export const indexAtom = atom({
  key: "indexAtom",
  default: 0,
});
