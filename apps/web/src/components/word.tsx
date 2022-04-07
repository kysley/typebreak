import { useRecoilValue } from 'recoil';
import clsx from 'clsx';
import { inputAtIndex, wordsState } from '../state';
import './word.css';

type WordProps = {
  myIndex: number;
  indexState: number;
  hidden: boolean;
};
export function Word({ myIndex, indexState, hidden }: WordProps) {
  const word = useRecoilValue(wordsState(myIndex));
  const input = useRecoilValue(inputAtIndex(myIndex));

  const show = myIndex <= indexState;
  const inputLength = input.length - 1;

  const wordClasses = clsx({
    word: true,
    hidden: hidden,
    flawless: word.flawless,
    perfect: !word.flawless && word.perfect,
    incorrect: !word.perfect,
  });

  return (
    <span className={wordClasses}>
      {word.name.split('').map((letter, idx) => {
        const notYetTyped = inputLength >= idx;
        return (
          <span
            key={`${letter}-${idx}`}
            className={clsx({
              letter: true,
              correct: show && notYetTyped && input[idx] === letter,
              incorrect: show && notYetTyped && input[idx] !== letter,
              upcoming: !show,
            })}
          >
            {letter}
          </span>
        );
      })}
      {input.length > word.name.length && (
        <>
          {input
            .substring(word.name.length)
            .split('')
            .map((letter, idx) => {
              return (
                <span className={`letter extra`} key={`${letter}-${idx}`}>
                  {letter}
                </span>
              );
            })}
        </>
      )}
    </span>
  );
}
