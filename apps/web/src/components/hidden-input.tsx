import { forwardRef, useRef } from 'react';
import { useRecoilCallback, useRecoilState, useSetRecoilState } from 'recoil';
import {
  indexAtom,
  inputAtCurrentIndex,
  typingState,
  wordsState,
  wordsStateAtCurrentIndex,
} from '../state';

export const HiddenInput = forwardRef(
  ({ eol, setEol }: { eol: boolean; setEol(v: boolean): void }, ref: any) => {
    const setIndex = useSetRecoilState(indexAtom);
    const [value, setValue] = useRecoilState(inputAtCurrentIndex);
    const selectedAllRef = useRef(false);
    const [usertypingState, setTypingState] = useRecoilState(typingState);

    const hasBackspacedCurrentWord = useRef(false);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const ctrl = e.ctrlKey || e.metaKey;

      if (e.key.length === 1 && e.key !== ' ' && !ctrl && !eol) {
        if (usertypingState === 'IDLE') {
          setTypingState('STARTED');
        }
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
        hasBackspacedCurrentWord.current = true;
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
        console.log('space');
        updateWordStateCallback(hasBackspacedCurrentWord.current);
        setEol(false);
        setIndex((prev) => (prev += 1));
        setValue('');
        hasBackspacedCurrentWord.current = false;
      }

      selectedAllRef.current = false;
    };

    const updateWordStateCallback = useRecoilCallback(
      ({ snapshot, set }) =>
        async (hasBackspaced: boolean) => {
          // we might be able to add the users input for this word here
          const currentWordState = await snapshot.getPromise(
            wordsStateAtCurrentIndex,
          );
          const currentInputState = await snapshot.getPromise(
            inputAtCurrentIndex,
          );
          const indexState = await snapshot.getPromise(indexAtom);

          const isPerfect = currentWordState.name === currentInputState;
          console.log(hasBackspacedCurrentWord.current);
          set(wordsState(indexState), {
            ...currentWordState,
            perfect: isPerfect,
            flawless: isPerfect && !hasBackspaced,
          });
        },
      [],
    );

    return (
      <input
        className='input-hidden'
        ref={ref}
        onKeyDown={handleKeyDown}
        value={value}
        readOnly
        // style={{ visibility: 'hidden' }} this doesnt let me focus the input
      />
    );
  },
);
