import create, { StateCreator } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { WordModifier } from "../modifiers";
import { Seed } from "wordkit";

export type AllSlices = WordsSlice & GameSlice & KeyboardSlice;

interface WordsSlice {
	wordsState: WordState[];
	setWords(words: WordState[]): void;
	setStateAt(newWordState: WordState, index: number): void;
}

export enum WordStatus {
	DESTROYED,
	FROZEN,
}

export type WordState = {
	id: string;
	word: string;
	perfect?: boolean;
	flawless: boolean;
	input: string;
	modifier?: WordModifier;
	status?: WordStatus;
};

export function hydrateWords(words: string[]) {
	return words.map(
		(word): WordState => ({
			flawless: false,
			input: "",
			word,
			id: uuidv4(),
		}),
	);
}

export const createWordsSlice: StateCreator<AllSlices, [], [], WordsSlice> = (
	set,
	get,
) => ({
	setWords: (words: WordState[]) => set(() => ({ wordsState: words })),
	wordsState: [],
	setStateAt: (newWordState: WordState, index: number) =>
		set((state) => {
			const words = [...state.wordsState];
			words[index] = newWordState;

			return {
				wordsState: words,
			};
		}),
});

interface GameSlice {
	index: number;
	// letter: number;
	timerType: "INCREMENTAL" | "DECREMENTAL";
	typingState: "IDLE" | "STARTED" | "DONE";
	mistakes: number;
	endOfLine: false;
	seed: number;
	completionRatio(): string;
	multiplier: number;
	score: number;
	incrementScore(amt: number): void;
	focused: number;
	dispatch(payload: Partial<GameSlice>): void;
	// reset(): void;
}

export const createGameSlice: StateCreator<AllSlices, [], [], GameSlice> = (
	set,
	get,
) => ({
	index: 0,
	// letter: 0,
	timerType: "DECREMENTAL",
	typingState: "IDLE",
	mistakes: 0,
	endOfLine: false,
	completionRatio() {
		const state = get();
		return `${state.index} / ${state.wordsState.length}`;
	},
	focused: 0,
	score: 0,
	multiplier: 1,
	seed: new Seed()._seed,
	incrementScore(amt) {
		set((state) => ({ score: (state.score += amt) }));
	},
	dispatch(payload) {
		set(() => payload);
	},
});

interface KeyboardSlice {
	onSpace(): void;
	onKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void;
	onText(key: string): void;
	hasBackspaced: boolean;
	selectAll: boolean;
}

export const createKeyboardSlice: StateCreator<
	AllSlices,
	[],
	[],
	KeyboardSlice
> = (set, get) => ({
	hasBackspaced: false,
	selectAll: false,
	onSpace() {
		const index = get().index;
		const state = get().wordsState;
		const multi = get().multiplier;

		const current = state[index];
		const isPerfect = current.word === current.input;

		if (!current.input.length) {
			return;
		}

		if (isPerfect) {
			get().incrementScore(50 * multi);
		} else {
			set(() => ({ multiplier: 1.0 }));
		}
		// handle word modifier?
		set(
			(state) => ({ endOfLine: false, index: (state.index += 1), letter: 0 }),
		);
	},
	onText(key: string) {
		const index = get().index;
		const state = get().wordsState;
		const selectAll = get().selectAll;
		const typingState = get().typingState;

		const current = { ...state[index] };

		if (typingState === "IDLE") {
			set(() => ({ typingState: "STARTED" }));
		}

		if (selectAll) {
			current.input = key;
		} else {
			current.input += key;
		}
		if (
			current.input[current.input.length - 1] !==
			current.word[current.input.length - 1]
		) {
			set((state) => ({ mistakes: (state.mistakes += 1) }));
		}
		// set((state) => ({ letter: (state.letter += 1) }));
		get()
			.setStateAt(current, index);
	},
	onKeyDown(e) {
		const endOfLine = get().endOfLine;
		const isCtrl = e.ctrlKey || e.metaKey;
		const isText = e.key.length === 1 && e.key !== " " && !isCtrl && !endOfLine;
		const isBackspace = e.key === "Backspace";
		const isSpace = e.key === " ";

		const index = get().index;
		const state = get().wordsState;

		const current = { ...state[index] };

		if (isText) {
			get().onText(e.key);
		}

		if (isCtrl && e.key === "a") {
			set(() => ({ selectAll: true }));
		}

		if (isBackspace) {
			set(() => ({ hasBackspaced: true, endOfLine: false }));

			if (!current.input.length) {
				// can backspace through word
				return;
			}

			if (get().selectAll) {
				current.input = "";
			} else {
				set((state) => ({ mistakes: (state.mistakes += 1) }));
				current.input = current.input.substring(0, current.input.length - 1);
			}

			if (isCtrl) {
				current.input = "";
			}
			get().setStateAt(current, index);
		}

		if (isSpace) {
			get().onSpace();
		}
	},
});

export const useStore = create<AllSlices>()(
	(...a) => ({
		...createGameSlice(...a),
		...createKeyboardSlice(...a),
		...createWordsSlice(...a),
	}),
);
