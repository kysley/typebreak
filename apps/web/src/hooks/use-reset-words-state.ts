import { useRecoilCallback } from 'recoil';
import {
  eolAtom,
  indexAtom,
  wordsAtom,
  wordsStateAtom,
  WordState,
} from '../state';

export function useResetWordsState() {
  const resetWordsState = useRecoilCallback(
    ({ snapshot, reset, set }) =>
      async (state: WordState[]) => {
        const idx = await snapshot.getPromise(wordsAtom);

        set(wordsAtom, state);
        for (let i = idx.length; i >= 0; i--) {
          reset(wordsStateAtom(i));
        }
        reset(indexAtom);
        reset(eolAtom);
      },
    [],
  );
  return { resetWordsState };
}
