import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useRefocus } from '../hooks/use-refocus';
import { focusedAtom, indexAtom, wordsAtom } from '../state';
import { Caret } from './caret';
import { HiddenInput } from './hidden-input';
import { Word } from './word';

export const WordsRenderer = memo(() => {
  const words = useRecoilValue(wordsAtom);
  const inputRef = useRef<HTMLInputElement>(null);
  const index = useRecoilValue(indexAtom);
  const wordsRef = useRef<HTMLDivElement>(null);

  const focusTrigger = useRecoilValue(focusedAtom);

  const [offsets, setOffsets] = useState<number[]>([]);
  const [breaks, setBreaks] = useState<number[]>([]);
  const [timesBroken, setTimesBroken] = useState(0);
  const [hideUnder, setHideUnder] = useState(0);

  useEffect(() => {
    inputRef.current?.focus();
  }, [focusTrigger]);

  useLayoutEffect(() => {
    if (wordsRef.current) {
      const words = Array.from(wordsRef.current.children) as HTMLDivElement[];

      const _breaks: number[] = [];
      const _offsets: number[] = [];

      let prevTop = 0;
      for (let i = hideUnder; i <= words.length - 1; ++i) {
        const offsetTop = words[i].offsetTop;

        if (offsetTop !== prevTop) {
          prevTop = offsetTop;
          _breaks.push(i);
          _offsets.push(offsetTop);
        }

        // handle case when 1 break left?
        if (_breaks.length === 3) {
          break;
        }
      }

      setBreaks(_breaks);
      setOffsets(_offsets);
    }
  }, [index]);

  useEffect(() => {
    let pastBreak = false;
    if (timesBroken === 0) {
      pastBreak = index >= breaks[0];
    } else {
      pastBreak = index >= breaks[1];
      if (pastBreak) setHideUnder(breaks[0]);
    }
    if (pastBreak) {
      setTimesBroken((prev) => (prev += 1));
    }
  }, [index]);

  const line = breaks.length ? (index >= breaks[0] ? 2 : 1) : 1;
  // console.log({ index, breaks, line, timesBroken, hideUnder });

  const refocus = useRefocus();

  return (
    <div style={{ position: 'relative' }}>
      <HiddenInput ref={inputRef} />

      {words.length && (
        <>
          <div className='wrapper' style={{ position: 'relative' }}>
            <div ref={wordsRef} id='dev' onClick={() => refocus()}>
              {words.map((word, idx) => (
                <Word
                  myIndex={idx}
                  key={`${word.id}-${idx}`}
                  show={idx <= index}
                  hidden={timesBroken >= 2 && idx < hideUnder}
                />
              ))}
            </div>
          </div>
          <Caret
            wordsRef={wordsRef}
            index={index}
            words={words}
            secondLineTop={offsets[1] || 0}
            line={line}
          />
        </>
      )}
    </div>
  );
});
