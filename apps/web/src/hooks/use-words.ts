import { getWords, Seed } from "wordkit";
import { v4 as uuidv4 } from "uuid";
import {
	camoWordFactory,
	icyWordFactory,
	mineModifierFactory,
	ModifierTypes,
	WordModifier,
} from "../modifiers";
import { useCallback } from "react";
import { useResetWordsState } from "./use-reset-words-state";
import { useSetRecoilState } from "recoil";
import {
	AllSlices,
	useStore,
	WordState,
	WordStatus,
} from "../state/words-slice";

const selector = (state: AllSlices) => ({
	dispatch: state.dispatch,
	setWords: state.setWords,
});
export function useWords(mode: "normal" | "arcade" = "normal") {
	const { resetWordsState } = useResetWordsState();
	// const setSeed = useSetRecoilState(seedState);
	const { dispatch, setWords } = useStore(selector);

	const reset = useCallback(() => {
		const sdr = new Seed();
		const words = getWords(100, sdr).split(",");

		let hydratedWords: WordState[] = [];

		if (mode === "arcade") {
			hydratedWords = arcadifyWords(words, sdr);
		} else {
			hydratedWords = hydrateWords(words);
		}

		dispatch({ seed: sdr.providedSeed || sdr._seed });
		setWords(hydratedWords);
		// resetWordsState(hydratedWords);

	}, [mode]);

	return {
		reset,
	};
}

// export function useArcadeMode() {
//   const { resetWordsState } = useResetWordsState();
//   const setSeed = useSetRecoilState(seedState);

//   const reset = useCallback(() => {
//     const sdr = new Seed();
//     const words = getWords(100, sdr).split(',');
//     setSeed(sdr.providedSeed || sdr._seed);
//     // const arcadeWords = arcadifyWords(words, sdr);

//     resetWordsState(arcadeWords);
//   }, [resetWordsState, setSeed]);

//   return {
//     reset,
//   };
// }

const modifierFactoryMap: Record<ModifierTypes, () => WordModifier> = {
	MINE: mineModifierFactory,
	ICY: icyWordFactory,
	CAMO: camoWordFactory,
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

const STATUS_FOR_MODIFIER: Record<ModifierTypes, WordStatus> = {};

export function arcadifyWords(words: string[], gen: Seed) {
	let wordsSinceLastModifier: number = 0;
	// let modNotAllowedFor: number = 0;

	const wordState = words.map(
		(word, idx): WordState => {
			let modifierType: ModifierTypes | null = null;
			const chance = gen.next();

			if (wordsSinceLastModifier > 3 || idx < 5) {
				if (chance > 0.85) {
					modifierType = "MINE";
					wordsSinceLastModifier = 0;
				} else if (chance < 0.1) {
					modifierType = "ICY";
					wordsSinceLastModifier = 0;
				} else if (chance > 0.25 && chance < 0.35) {
					modifierType = "CAMO";
					wordsSinceLastModifier = 0;
				}
			} else {
				wordsSinceLastModifier += 1;
			}

			return {
				status: modifierType === "ICY" ? WordStatus.FROZEN : undefined,
				flawless: false,
				input: "",
				word,
				modifier: modifierType ? modifierFactoryMap[modifierType]() : undefined,
				id: uuidv4(),
			};
		},
	);
	return wordState;
}
