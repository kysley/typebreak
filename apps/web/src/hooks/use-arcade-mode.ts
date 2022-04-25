import { useRecoilCallback } from 'recoil';
import { getWords } from 'wordkit';
import { v4 as uuidv4 } from 'uuid';
import {
  icyWordFactory,
  mineModifierFactory,
  ModifierTypes,
  WordModifier,
} from '../modifiers';
import {
  eolAtom,
  indexAtom,
  wordsAtom,
  wordsStateAtom,
  WordState,
} from '../state';
import { useTypingTimer } from './use-typing-timer';

function useArcadeMode() {
  const timer = useTypingTimer();
  // const setWords = useSetRecoilState(wordsAtom);

  // useEffect(() => {}, []);

  const reset = () => {};
}

const modifierFactoryMap: Record<ModifierTypes, () => WordModifier> = {
  MINE: mineModifierFactory,
  ICY: icyWordFactory,
};

export function arcadifyWords(words: string[]) {
  let wordsSinceLastModifier: number = 0;
  // let modNotAllowedFor: number = 0;

  const wordState = words.map<WordState>((word, idx) => {
    let modifierType: ModifierTypes | null = null;
    const chance = Math.random();

    if (wordsSinceLastModifier > 5 || idx < 5) {
      if (chance > 0.85) {
        modifierType = 'MINE';
        wordsSinceLastModifier = 0;
      } else if (chance < 0.1) {
        modifierType = 'ICY';
        wordsSinceLastModifier = 0;
      } else {
        wordsSinceLastModifier += 1;
      }
    }

    return {
      destroyed: false,
      flawless: false,
      frozen: modifierType === 'ICY' ? true : false,
      input: '',
      name: word,
      perfect: null,
      modifier: modifierType ? modifierFactoryMap[modifierType]() : undefined,
      id: uuidv4(),
    };
  });
  return wordState;
}

export function useResetWordsState() {
  const resetWordsState = useRecoilCallback(
    ({ snapshot, reset, set }) =>
      async () => {
        const idx = await snapshot.getPromise(wordsAtom);
        const words = getWords(50).split(',');
        const arcadeWords = arcadifyWords(words);

        set(wordsAtom, arcadeWords);
        for (let i = idx.length; i >= 0; i--) {
          reset(wordsStateAtom(i));
        }
        // set(wordsAtom, []);
        reset(indexAtom);
        reset(eolAtom);
      },
    [],
  );
  return { resetWordsState };
}
