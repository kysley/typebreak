import { useRecoilValue } from 'recoil';
import { indexAtom, inputAtIndex, wordsState } from '../state';
import './word.css';

type WordProps = {
  myIndex: number;
  indexState: number;
};
export function Word({ myIndex, indexState }: WordProps) {
  const word = useRecoilValue(wordsState(myIndex));
  const input = useRecoilValue(inputAtIndex(myIndex));

  const show = myIndex <= indexState;

  return (
    <span className='word'>
      {word.name.split('').map((letter, idx) => {
        const notYetTyped = input.length - 1 >= idx;
        const letterClass =
          show && notYetTyped
            ? input[idx] === letter
              ? 'correct'
              : 'incorrect'
            : '';
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
