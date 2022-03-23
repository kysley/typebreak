import { useRef } from "react";
import "./App.css";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { indexAtom, inputAtom, wordsAtom, wordsState } from "./state";
import { Word } from "./components/word";

function App() {
  const words = useRecoilValue(wordsAtom);
  const [input, setInput] = useRecoilState(inputAtom);
  const [index, setIndex] = useRecoilState(indexAtom);
  const inputRef = useRef<HTMLInputElement>(null);

  const inputValueRef = useRef("");

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  const handleChange = (e: React.KeyboardEvent) => {
    console.log(e.key);
    if (e.key.match(/^[A-Za-z0-9_@./#&+-][1]*$/)) {
      inputValueRef.current += e.key;
      setInput((prev) => {
        const copy = [...prev];
        copy[index] = inputValueRef.current;
        return copy;
      });
    } else if (e.key === " ") {
      setIndex((prev) => (prev += 1));
      inputValueRef.current = "";
    } else if (e.key === "Backspace") {
      inputValueRef.current = inputValueRef.current.slice(0, -1);
      setInput((prev) => {
        const copy = [...prev];
        copy[index] = inputValueRef.current;
        return copy;
      });
    }
  };

  return (
    <div className="App">
      <input className="input-hidden" ref={inputRef} onKeyDown={handleChange} />
      <div onClick={handleFocus}>
        {words.map((word, idx) => (
          <div key={`${word}-${idx}}`}>
            <Word myIndex={idx} input={input[idx]} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
