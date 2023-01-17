import {
	atom,
	atomFamily,
	DefaultValue,
	selector,
	selectorFamily,
} from "recoil";
import { Seed } from "wordkit";
import { WordModifier } from "../modifiers";

// export const wordsAtom = atom({
//   key: 'wordsAtom',
//   default: arcadifyWords(getWords(50).split(',')),
// });

// export const seedAtom = atom<Seed>({
//   key: 'seedAtom',
//   default: new Seed(),
// });

export const wordsAtom = atom<WordState[]>({
	key: "wordsAtom",
	default: [],
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
	key: "wordsState",
	default: selectorFamily({
		key: "wordsState/default",
		set: (id: number) => ({ set, reset }, value: WordState | DefaultValue) => {
			if (value instanceof DefaultValue) {
				reset(wordsStateAtom(id));
				return;
			}
			set(wordsStateAtom(id), value);
		},
		get: (param: number) => ({ get }): WordState => {
			return get(wordsAtom)[param];
		},
	}),
});

export const wordsStateAtCurrentIndex = selector<WordState>({
	key: "wordsState/currentIndex",
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
	key: "wordsState/previousIndex",
	get: ({ get }) => get(wordsStateAtom(get(indexAtom) - 1)),
});

export const indexAtom = atom({
	key: "indexAtom",
	default: 0,
});

export const currentLetterAtom = selector({
	key: "indexAtom/letter",
	get: ({ get }) => {
		return get(wordsStateAtCurrentIndex).input.length;
	},
});

export const timerTypeAtom = atom<"INCREMENTAL" | "DECREMENTAL">({
	key: "timertype",
	default: "DECREMENTAL",
});

export type TypingState = "IDLE" | "STARTED" | "DONE";
export const typingStateAtom = atom<TypingState>({
	key: "typingstate",
	default: "IDLE",
});

export const mistakesAtom = atom<number>({
	key: "mistakesState",
	default: 0,
});

export const eolAtom = atom({
	key: "eol",
	default: false,
});

export const ratioCompletedAtom = selector({
	key: "ratioCompleted",
	get: ({ get }) => `${get(indexAtom)} / ${get(wordsAtom).length}`,
});

export const seedState = atom({
	key: "seed",
	default: new Seed()._seed,
});

export const multiplierAtom = atom<number>({
	key: "multiplierAtom",
	default: 1,
});

export const scoreAtom = atom({
	key: "scoreAtom",
	default: 0,
});

export const focusedAtom = atom({
	key: "focusedAtom",
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

export function calculateWPM({ index, time, wordsState, mistakes }: {
	index: number;
	time: number;
	wordsState: WordState[];
	mistakes: number;
}) {
	let correctLetters = 0;
	let incorrectLetters = 0;

	for (let i = 0; i <= index; i++) {
		const word = wordsState[i];
		if (!word) break;
		if (word.perfect) correctLetters += word.name.length;
		else {
			word.name.split("").forEach((letter, index) => {
				if (word.input[index]) {
					if (word.input[index] === letter) {
						correctLetters += 1;
					} else if (
						index < word.input.length - 1 &&
						word.input[index] !== letter
					) {
						incorrectLetters += 1;
					}
				}
			});
		}
	}
	const wpm = Math.round(((correctLetters + index) * (60 / time)) / 5);
	const total = correctLetters + index + incorrectLetters + mistakes;
	const acc = (1 - (incorrectLetters + mistakes) / total) * 100;

	console.log(acc);

	return { wpm, acc };
}
