import { useRecoilValue } from 'recoil';
import clsx from 'clsx';
import { wordsState } from '../state';
import './word.css';
import { memo } from 'react';

type WordProps = {
  myIndex: number;
  hidden: boolean;
  show: boolean;
};
function WordComponent({ myIndex, hidden, show }: WordProps) {
  const word = useRecoilValue(wordsState(myIndex));

  const inputLength = word.input.length - 1;

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
              correct: show && notYetTyped && word.input[idx] === letter,
              incorrect: show && notYetTyped && word.input[idx] !== letter,
              upcoming: !show,
            })}
          >
            {letter}
          </span>
        );
      })}
      {word.input.length > word.name.length && (
        <>
          {word.input
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

export const Word = memo(WordComponent);
