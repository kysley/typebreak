import { forwardRef, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useSpring, animated } from "react-spring";
import "./App.css";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  indexAtom,
  inputAtom,
  currentLetter,
  wordsAtom,
  wordsState,
  inputAsString,
} from "./state";
import { Word } from "./components/word";

function App() {
  const words = useRecoilValue(wordsAtom);
  const setInput = useSetRecoilState(inputAtom);
  const [index, setIndex] = useRecoilState(indexAtom);
  const inputRef = useRef<HTMLInputElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);
  const curLetter = useRecoilValue(currentLetter);
  const [caretPos, setCaretPos] = useSpring(() => ({
    transform: "translate(0,0)",
    config: { duration: 55, friction: 5, precision: 1 },
  }));

  const [breaks, setBreaks] = useState<number[]>([]);
  const [eol, setEol] = useState(false);

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  const horizontalSpaceBetweenWords = useMemo(
    () =>
      Math.abs(
        (wordsRef?.current?.children[breaks[0]]?.getBoundingClientRect()
          .right || 30) -
          (wordsRef?.current?.children[breaks[0] + 1]?.getBoundingClientRect()
            .left || 20)
      ),
    [breaks]
  );

  useLayoutEffect(() => {
    if (!wordsRef.current) return;

    const words = Array.from(wordsRef.current.children);

    const lineBreakIndixes: number[] = [];
    let prevTop = 0;
    words.forEach((word, idx) => {
      // skip words that are before the current index
      // this saves expensive calls to getBoundingClientRect()
      if (idx < index) return;
      const top = word.getBoundingClientRect().top;
      if (prevTop !== top) {
        lineBreakIndixes.push(idx);
      }
      prevTop = top;
    });

    setBreaks(lineBreakIndixes);
  }, [index]);

  useLayoutEffect(() => {
    if (!wordsRef.current) return;

    const wordsDom = Array.from(wordsRef.current.children);
    const containerBounding = wordsRef.current.getBoundingClientRect();

    const thisWord = wordsDom[index];

    const letters = Array.from(thisWord.children);

    let dir: "left" | "right";
    let letter;
    if (curLetter >= words[index].length) {
      letter = letters[curLetter - 1];

      dir = "right";
    } else {
      letter = letters[curLetter];

      dir = "left";
    }
    const letterBounding = letter.getBoundingClientRect();
    const isEol =
      letterBounding["right"] + horizontalSpaceBetweenWords * 2 >
      containerBounding.right;

    console.log({
      cb: containerBounding.right,
      lb: letterBounding.right,
      isEol,
    });
    // don't bother setting false to false
    setEol(isEol);

    setCaretPos({
      transform: `translate(${letterBounding[dir]}px, ${
        letterBounding.bottom - letterBounding.height
      }px)`,
    });
  }, [curLetter, index, wordsRef, words]);

  // const rowsHidden = breaks.findIndex((breakIndex) => breakIndex < index);
  // console.log(rowsHidden);

  return (
    <div className="App">
      <UnderlyingInput
        ref={inputRef}
        eol={eol}
        setEol={(v) => setEol(v)}
        curLetter={curLetter}
      />
      <div onClick={handleFocus} ref={wordsRef} id="dev">
        {words.map((word, idx) => (
          <Word myIndex={idx} key={`${word}-${idx}}`} indexState={index} />
        ))}
      </div>
      <animated.div
        style={{
          ...caretPos,
          left: 0,
          top: 5,
          width: "3px",
          height: "1.5rem",
          position: "absolute",
          background: "pink",
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
    ref: any
  ) => {
    const setInput = useSetRecoilState(inputAtom);
    const setIndex = useSetRecoilState(indexAtom);
    const value = useRecoilValue(inputAsString);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // this can be optimized
      const wordHistory = e.target.value.split(" ");
      if (wordHistory[wordHistory.length - 1].length <= curLetter) {
        console.log("backspace");
        setEol(false);
      } else if (eol) {
        console.log("eol");
        e.stopPropagation();
        e.preventDefault();
        return;
      }
      setInput(wordHistory);
      setIndex(wordHistory.length - 1);
    };

    return (
      <input
        className="input-hidden"
        ref={ref}
        onChange={handleChange}
        value={value}
      />
    );
  }
);

function Caret() {}

export default App;
