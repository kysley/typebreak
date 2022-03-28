import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useSpring, animated } from "react-spring";
import "./App.css";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  indexAtom,
  inputAtom,
  currentLetter,
  wordsAtom,
  wordsState,
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
    marginLeft: 0,
    top: 5,
    config: { duration: 55, friction: 5, precision: 1 },
  }));

  const [breaks, setBreaks] = useState<number[]>([]);

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const wordHistory = e.target.value.split(" ");
    setInput(wordHistory);
    setIndex(wordHistory.length - 1);
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
      const top = word.getBoundingClientRect().top;
      if (prevTop !== top) {
        lineBreakIndixes.push(idx);
      }
      prevTop = top;
    });

    console.log(lineBreakIndixes);

    setBreaks(lineBreakIndixes);
  }, [index]);

  useLayoutEffect(() => {
    if (!wordsRef.current) return;

    const wordsDom = Array.from(wordsRef.current.children);

    const thisWord = wordsDom[index];

    const letters = Array.from(thisWord.children);

    let horiz: number;
    let letter;
    if (curLetter >= words[index].length) {
      letter = letters[curLetter - 1];

      horiz = letter.getBoundingClientRect().right;
    } else {
      letter = letters[curLetter];

      horiz = letter.getBoundingClientRect().left;
    }
    setCaretPos({
      marginLeft: horiz,
      marginTop: letter.getBoundingClientRect().top,
    });
  }, [curLetter, index, wordsRef, words]);

  return (
    <div className="App">
      <input className="input-hidden" ref={inputRef} onChange={handleChange} />
      <div onClick={handleFocus} ref={wordsRef} id="dev">
        {words.map((word, idx) => (
          <Word myIndex={idx} key={`${word}-${idx}}`} />
        ))}
      </div>
      <animated.div
        style={{
          ...caretPos,
          width: "4px",
          height: "25px",
          position: "absolute",
          background: "pink",
        }}
      />
    </div>
  );
}

function Caret() {}

export default App;
