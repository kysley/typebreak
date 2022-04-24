import { useEffect } from 'react';
import { useRecoilCallback, useRecoilState, useSetRecoilState } from 'recoil';
import { getWords } from 'wordkit';
import { eolState, indexAtom, wordsAtom, wordsState } from '../state';
import { useTypingTimer } from './use-typing-timer';

export function useArcadeMode() {
  const timer = useTypingTimer();
  const setWords = useSetRecoilState(wordsAtom);

  // useEffect(() => {}, []);

  const reset = () => {};
}

function arcadifyWords(words: string[]) {
  let lastModIndex: number | null = null;
  let mineLength = 5;

  words.map((word, idx) => ({
    word,
  }));
}

function canPlaceMine(word, index, since) {}

export function useResetWordsState() {
  const resetWordsState = useRecoilCallback(
    ({ snapshot, reset, set }) =>
      async () => {
        const idx = await snapshot.getPromise(wordsAtom);
        // set(wordsAtom, getWords(50).split(','));
        for (let i = idx.length; i >= 0; i--) {
          reset(wordsState(i));
        }
        // set(wordsAtom, []);
        reset(indexAtom);
        reset(eolState);
      },
    [],
  );
  return { resetWordsState };
}
