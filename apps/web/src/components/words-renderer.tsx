import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { indexAtom, wordsAtom } from '../state';
import { Caret } from './caret';
import { HiddenInput } from './hidden-input';
import { Word } from './word';

export const WordsRenderer = () => {
  const words = useRecoilValue(wordsAtom);
  const inputRef = useRef<HTMLInputElement>(null);
  const index = useRecoilValue(indexAtom);
  const wordsRef = useRef<HTMLDivElement>(null);

  const [breakAt, setBreak] = useState<number>();
  const [breakIndex, setbreakIndex] = useState<number>(0);
  const [lastBreakIndex, setLastBreakIndex] = useState<number>();
  const [timesBroke, setTimesBroke] = useState(0);

  const handleFocus = () => {
    inputRef.current?.focus();
  };
  // todo: fix edge case where you break again at the last broken index
  // this happens when you backspace to the previous line to fix a word
  useEffect(() => {
    if (breakAt) {
      if (index >= breakAt) {
        console.log({ lastBreakIndex, breakAt });
        // if (lastBreakIndex !== breakAt) {
        setTimesBroke((prev) => (prev += 1));
        // }
        setLastBreakIndex(breakIndex);
        setbreakIndex(breakAt);
      }
    }
  }, [breakAt, breakIndex, index, lastBreakIndex, setbreakIndex]);

  // handle line break
  useLayoutEffect(() => {
    if (!wordsRef.current) return;
    const words = Array.from(wordsRef.current.children);

    let nextLineBreak: number | null = null;
    let prevTop = null;
    for (let idx = index; idx <= words.length - 1; idx++) {
      const word = words[idx];

      // if (idx < index) return;
      const top = word.getBoundingClientRect().top;
      if (prevTop === null) {
        prevTop = top;
      }
      if (prevTop !== top) {
        // console.log({ prevTop, top, idx });

        nextLineBreak = idx;
        break;
      }
      prevTop = top;
    }

    if (nextLineBreak) setBreak(nextLineBreak);
  }, [index]);
  return (
    <div className='App container'>
      <HiddenInput ref={inputRef} />

      {words.length && (
        <>
          <div className='wrapper'>
            <div onClick={handleFocus} ref={wordsRef} id='dev'>
              {words.map((word, idx) => (
                <Word
                  myIndex={idx}
                  key={`${word.id}-${idx}`}
                  show={idx <= index}
                  hidden={timesBroke > 1 && (lastBreakIndex || 0) > idx}
                />
              ))}
            </div>
          </div>
          <Caret
            wordsRef={wordsRef}
            index={index}
            words={words}
            breakAt={breakAt}
          />
        </>
      )}
    </div>
  );
};
