import { getWords } from 'wordkit';
import { v4 as uuidv4 } from 'uuid';
import {
  icyWordFactory,
  mineModifierFactory,
  ModifierTypes,
  WordModifier,
} from '../modifiers';
import { WordState } from '../state';
import { useCallback } from 'react';
import { useResetWordsState } from './use-reset-words-state';

export function useArcadeMode() {
  const { resetWordsState } = useResetWordsState();

  const reset = useCallback(() => {
    const words = getWords(50).split(',');
    const arcadeWords = arcadifyWords(words);
    resetWordsState(arcadeWords);
  }, [resetWordsState]);

  return {
    reset,
  };
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

    if (wordsSinceLastModifier > 3 || idx < 5) {
      if (chance > 0.85) {
        modifierType = 'MINE';
        wordsSinceLastModifier = 0;
      } else if (chance < 0.1) {
        modifierType = 'ICY';
        wordsSinceLastModifier = 0;
      }
    } else {
      wordsSinceLastModifier += 1;
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
