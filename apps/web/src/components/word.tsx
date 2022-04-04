import { useRecoilValue } from 'recoil';
import { indexAtom, inputAtIndex, wordsState } from '../state';
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

  return (
    <span className={`word ${hidden && 'hidden'}`}>
      {word.name.split('').map((letter, idx) => {
        const notYetTyped = inputLength >= idx;
        const letterClass =
          show && notYetTyped
            ? input[idx] === letter
              ? 'correct'
              : 'incorrect'
            : 'upcoming';
        return (
          <span className={`letter ${letterClass}`} key={`${letter}-${idx}`}>
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
