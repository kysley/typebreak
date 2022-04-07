import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './App.css';
import { useRecoilValue } from 'recoil';
import { indexAtom, wordsAtom } from './state';
import { Word } from './components/word';
import { HiddenInput } from './components/hidden-input';
import { Caret } from './components/caret';
import { useTypingTimer } from './hooks/use-typing-timer';

function App() {
  const words = useRecoilValue(wordsAtom);
  const index = useRecoilValue(indexAtom);
  const inputRef = useRef<HTMLInputElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);

  const [breakAt, setBreak] = useState<number>();
  const [breakIndex, setbreakIndex] = useState<number>(0);
  const [lastBreakIndex, setLastBreakIndex] = useState<number>();
  const [timesBroke, setTimesBroke] = useState(0);
  const [eol, setEol] = useState(false);

  const time = useTypingTimer();

  const handleFocus = () => {
    inputRef.current?.focus();
  };

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

  // useEffect(() => {
  //   if (index < lastBreakIndex) {
  //     console.log('backwards');
  //     setbreakIndex(lastBreakIndex);
  //   }
  // }, [index, lastBreakIndex]);

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
      <HiddenInput ref={inputRef} eol={eol} setEol={(v) => setEol(v)} />
      <span>time: {time}</span>
      <div className='wrapper'>
        <div onClick={handleFocus} ref={wordsRef} id='dev'>
          {words.map((word, idx) => (
            <Word
              myIndex={idx}
              key={`${word}-${idx}`}
              indexState={index}
              hidden={timesBroke > 1 && lastBreakIndex > idx}
            />
          ))}
        </div>
      </div>
      <Caret
        wordsRef={wordsRef}
        index={index}
        words={words}
        setEol={(v) => setEol(v)}
        breaks={breakAt}
      />
    </div>
  );
}

export default App;
