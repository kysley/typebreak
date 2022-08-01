import { useEffect, useState } from 'react';
import { useRecoilCallback } from 'recoil';
import {
  calculateWPM,
  indexAtom,
  mistakesAtom,
  wordsAtom,
  wordsStateAtom,
} from '../state';

export function useWPM(time: number) {
  const [wpm, setWpm] = useState(0);

  const calc = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const words = await snapshot.getPromise(wordsAtom);
        const index = await snapshot.getPromise(indexAtom);
        const mistakes = await snapshot.getPromise(mistakesAtom);

        let state = [];
        for (let i = 0; i <= words.length; ++i) {
          const v = await snapshot.getPromise(wordsStateAtom(i));
          state.push(v);
        }

        return calculateWPM({ index, wordsState: state, time, mistakes });
      },
    [time],
  );

  useEffect(() => {
    async function doIt() {
      const { wpm, acc } = await calc();
      setWpm(wpm);
    }
    doIt();
  }, [time, calc]);

  return wpm;
}
