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

  const refocus = useRefocus();

  const [lineBreakIndex, setLineBreakIndex] = useState<number | null>(null);
  const [timesBroke, setTimesBroke] = useState(0);
  const [lineState, setLineState] = useState(0);
  const [lastBreak, setLastBreak] = useState(0);
  // firstBreak, setFirstBreak. Used as an offset index for hiding words
  const [fb, sfb] = useState(null);

  // TODO: send line back to 1 if previous
  const [onPrevLine, setOnPrevLine] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, [focusTrigger]);

  useEffect(() => {
    if (!wordsRef.current) return;

    const words = Array.from(wordsRef.current.children);

    let nextLineIndex = 0;
    let prevTop = null;

    console.log({ lineBreakIndex, timesBroke });

    for (let idx = index; idx <= words.length - 1; idx++) {
      const word = words[idx];

      // if (idx < index) return;
      const top = word.getBoundingClientRect().top;
      if (prevTop === null) {
        prevTop = top;
      } else if (prevTop !== top) {
        // console.log({ prevTop, top, idx });

        nextLineIndex = idx;
        break;
      }
      prevTop = top;
    }
    if (lineState === 0) {
      setLineState(words[nextLineIndex].getBoundingClientRect().top);
    }

    setLineBreakIndex(nextLineIndex);
  }, [index, lineBreakIndex, lineState, timesBroke]);

  useEffect(() => {
    if (lineBreakIndex && index >= lineBreakIndex) {
      console.log('broke');
      setTimesBroke((prev) => (prev += 1));
      setLastBreak(lineBreakIndex);
    }
  }, [index, lineBreakIndex]);

  useEffect(() => {
    // if we havent set the first break index yet.. do that
    if (!fb) {
      sfb(lastBreak);
    }
  }, [fb, index, lastBreak]);

  // // todo: fix edge case where you break again at the last broken index
  // // this happens when you backspace to the previous line to fix a word
  // useEffect(() => {
  //   if (breakAt) {
  //     if (index >= breakAt) {
  //       console.log({ lastBreakIndex, breakAt, breakIndex });
  //       // if (lastBreakIndex !== breakAt) {
  //       setTimesBroke((prev) => (prev += 1));
  //       // }
  //       setLastBreakIndex(breakIndex || breakAt);
  //       setbreakIndex(breakAt);
  //     }
  //   }
  // }, [breakAt, breakIndex, index, lastBreakIndex, setbreakIndex]);

  // // handle line break
  // useLayoutEffect(() => {
  //   if (!wordsRef.current) return;
  //   const words = Array.from(wordsRef.current.children);

  //   let nextLineBreak: number | null = null;
  //   let prevTop = null;
  //   for (let idx = index; idx <= words.length - 1; idx++) {
  //     const word = words[idx];

  //     // if (idx < index) return;
  //     const top = word.getBoundingClientRect().top;
  //     if (prevTop === null) {
  //       prevTop = top;
  //     } else if (prevTop !== top) {
  //       // console.log({ prevTop, top, idx });

  //       nextLineBreak = idx;
  //       break;
  //     }
  //     prevTop = top;
  //   }
  //   console.log(nextLineBreak);
  //   if (nextLineBreak) setBreak(nextLineBreak);
  // }, [index]);

  return (
    <div style={{ position: 'relative' }}>
      <HiddenInput ref={inputRef} />

      {words.length && (
        <>
          <div className='wrapper'>
            <div ref={wordsRef} id='dev' onClick={() => refocus()}>
              {words.map((word, idx) => (
                <Word
                  myIndex={idx}
                  key={`${word.id}-${idx}`}
                  show={idx <= index}
                  hidden={timesBroke > 1 && lastBreak - (fb || 0) > idx}
                  // should be on the second line, subtract the last break index by the first break
                  // this will hide the # of words on the previous line
                  // FIX: we have some weird "off by 1-3 errors here"
                />
              ))}
            </div>
          </div>
          <Caret
            wordsRef={wordsRef}
            index={index}
            words={words}
            secondLineTop={lineState}
            line={
              lineBreakIndex === null || lineBreakIndex === 0 || timesBroke < 1
                ? 1
                : 2
            }
          />
        </>
      )}
    </div>
  );
});
