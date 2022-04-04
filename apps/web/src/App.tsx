import React, {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSpring, animated } from 'react-spring';
import './App.css';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  indexAtom,
  currentLetter,
  wordsAtom,
  inputAtCurrentIndex,
} from './state';
import { Word } from './components/word';

function App() {
  const words = useRecoilValue(wordsAtom);
  const index = useRecoilValue(indexAtom);
  const inputRef = useRef<HTMLInputElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);
  const curLetter = useRecoilValue(currentLetter);
  const [caretPos, setCaretPos] = useSpring(() => ({
    transform: 'translate(0,0)',
    config: { duration: 55, friction: 5, precision: 1 },
  }));

  const [breakAt, setBreak] = useState<number>();
  const [breakIndex, setbreakIndex] = useState<number>(0);
  const [lastBreakIndex, setLastBreakIndex] = useState<number>(0);
  const [timesBroke, setTimesBroke] = useState(0);
  const [eol, setEol] = useState(false);

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  const horizontalSpaceBetweenWords = useMemo(
    () =>
      Math.abs(
        (wordsRef?.current?.children[0]?.getBoundingClientRect().right || 30) -
          (wordsRef?.current?.children[1]?.getBoundingClientRect().left || 20),
      ),
    [],
  );

  useEffect(() => {
    if (breakAt) {
      if (index >= breakAt) {
        console.log({ index, breakAt });
        setLastBreakIndex(breakIndex);
        setbreakIndex(breakAt);
        setTimesBroke((prev) => (prev += 1));
      }
    }
  }, [breakAt, breakIndex, index, setbreakIndex]);

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
        console.log({ prevTop, top, idx });

        nextLineBreak = idx;
        break;
      }
      prevTop = top;
    }

    if (nextLineBreak) setBreak(nextLineBreak);
  }, [index]);

  // Handle the caret position
  useLayoutEffect(() => {
    console.log('caret effect');
    if (!wordsRef.current) return;

    const wordsDom = Array.from(wordsRef.current.children);
    const containerBounding = wordsRef.current.getBoundingClientRect();

    const thisWord = wordsDom[index];

    const letters = Array.from(thisWord.children);

    let dir: 'left' | 'right';
    let letter;
    let isExtraLetter = false;
    if (curLetter >= words[index].length) {
      letter = letters[curLetter - 1];
      dir = 'right';
      isExtraLetter = true;
    } else {
      letter = letters[curLetter];
      dir = 'left';
    }
    const letterBounding = letter.getBoundingClientRect();
    const isEol =
      isExtraLetter &&
      letterBounding['right'] + horizontalSpaceBetweenWords * 2 >
        containerBounding.right;

    setEol(isEol);

    // if (index === breakAt) {
    //   const top = wordsDom[breakAt].children[0].getBoundingClientRect().top;
    //   setCaretPos({
    //     transform: `translate(${letterBounding[dir]}px, ${
    //       letterBounding.bottom - top
    //     }px)`,
    //   });
    // } else {
    setCaretPos({
      transform: `translate(${letterBounding[dir]}px, ${
        letterBounding.bottom - letterBounding.height
      }px)`,
    });
    // }
  }, [
    curLetter,
    index,
    breakAt,
    horizontalSpaceBetweenWords,
    setCaretPos,
    words,
  ]);

  return (
    <div className='App'>
      <UnderlyingInput
        ref={inputRef}
        eol={eol}
        setEol={(v) => setEol(v)}
        curLetter={curLetter}
      />
      <div onClick={handleFocus} ref={wordsRef} id='dev'>
        {words.map((word, idx) => (
          <Word
            myIndex={idx}
            key={`${word}-${idx}}`}
            indexState={index}
            hidden={timesBroke > 1 && lastBreakIndex > idx}
          />
        ))}
      </div>
      <animated.div
        style={{
          ...caretPos,
          left: 0,
          top: 5,
          width: '3px',
          height: '1.5rem',
          position: 'absolute',
          background: 'pink',
        }}
      />
    </div>
  );
}

const UnderlyingInput = forwardRef(
  (
    {
      curLetter,
      eol,
      setEol,
    }: { curLetter: number; eol: boolean; setEol(v: boolean): void },
    ref: any,
  ) => {
    const setIndex = useSetRecoilState(indexAtom);
    const [value, setValue] = useRecoilState(inputAtCurrentIndex);
    const selectedAllRef = useRef(false);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const ctrl = e.ctrlKey || e.metaKey;

      if (e.key.length === 1 && e.key !== ' ' && !ctrl && !eol) {
        if (selectedAllRef.current) {
          console.log('all selected, replacing with next key');
          setValue(e.key);
        } else {
          setValue((prev) => (prev += e.key));
        }
      }

      if (ctrl) {
        if (e.key === 'Backspace') {
          console.log('ctrl + backspace');
          setValue('');
          return;
        }
        if (e.key === 'a') {
          console.log('ctrl + a');
          selectedAllRef.current = true;
          return;
        }
      }

      if (e.key === 'Backspace') {
        setEol(false);
        if (value.length === 0) {
          console.log('backspacing through word');
          setIndex((prev) => (prev === 0 ? 0 : (prev -= 1)));
        }
        if (selectedAllRef.current) {
          console.log('backspacing all');
          setValue('');
        } else {
          console.log('backspacing normal');
          setValue((prev) => prev.substring(0, prev.length - 1));
        }
      } else if (e.key === ' ') {
        setEol(false);
        console.log('space');
        setIndex((prev) => (prev += 1));
        setValue('');
      }

      selectedAllRef.current = false;
    };

    return (
      <input
        className='input-hidden'
        ref={ref}
        onKeyDown={handleKeyDown}
        value={value}
        readOnly
      />
    );
  },
);

function Caret() {}

export default App;
