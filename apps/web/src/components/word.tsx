import { useRecoilValue } from "recoil";
import { indexAtom, wordsState } from "../state";
import "./word.css";

type WordProps = {
  myIndex: number;
  input: string;
};
export function Word({ myIndex, input = "" }: WordProps) {
  const word = useRecoilValue(wordsState(myIndex));
  const indexState = useRecoilValue(indexAtom);

  const show = myIndex <= indexState;

  return (
    <span className="word">
      {word.name.split("").map((letter, idx) => {
        const notYetTyped = input.length - 1 >= idx;
        const letterClass =
          show && notYetTyped
            ? input[idx] === letter
              ? "correct"
              : "incorrect"
            : "";
        return (
          <span className={`letter ${letterClass}`} key={`${letter}-${idx}`}>
            {letter}
          </span>
        );
      })}
    </span>
  );
}
