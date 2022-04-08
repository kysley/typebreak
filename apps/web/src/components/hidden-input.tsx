import { forwardRef, useRef } from 'react';
import { useRecoilCallback, useRecoilState } from 'recoil';
import {
  eolState,
  indexAtom,
  typingState,
  wordsState,
  wordsStateAtCurrentIndex,
} from '../state';

export const HiddenInput = forwardRef((props, ref: any) => {
  const [eol, setEol] = useRecoilState(eolState);
  const [wordState, setWordState] = useRecoilState(wordsStateAtCurrentIndex);
  const selectedAllRef = useRef(false);
  const [usertypingState, setTypingState] = useRecoilState(typingState);

  const hasBackspacedCurrentWord = useRef(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const ctrl = e.ctrlKey || e.metaKey;

    const newWordState = { ...wordState };

    if (e.key.length === 1 && e.key !== ' ' && !ctrl && !eol) {
      if (usertypingState === 'IDLE') {
        setTypingState('STARTED');
      }
      if (selectedAllRef.current) {
        console.log('all selected, replacing with next key');
        setWordState({ ...newWordState, input: e.key });
      } else {
        setWordState({
          ...newWordState,
          input: (newWordState.input += e.key),
        });
      }
    }

    if (ctrl) {
      if (e.key === 'Backspace') {
        console.log('ctrl + backspace');
        setWordState({ ...newWordState, input: '' });
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
      if (wordState.input.length === 0) {
        console.log('backspacing through word');
        handleCanBackspaceThroughWord();
        return;
      }
      if (selectedAllRef.current) {
        console.log('backspacing all');
        setWordState({ ...newWordState, input: '' });
      } else {
        console.log('backspacing normal');
        setWordState({
          ...newWordState,
          input: newWordState.input.substring(0, newWordState.input.length - 1),
        });
      }
    } else if (e.key === ' ') {
      if (wordState.input.length === 0) return;
      console.log('space');
      updateOnSpace(hasBackspacedCurrentWord.current);
      hasBackspacedCurrentWord.current = false;
    }

    selectedAllRef.current = false;
  };

  const handleCanBackspaceThroughWord = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        const indexState = await snapshot.getPromise(indexAtom);

        const previousWordState = await snapshot.getPromise(
          wordsState(indexState - 1),
        );

        if (previousWordState.perfect) return;

        set(indexAtom, (prev) => (prev -= 1));
      },
    [],
  );

  const updateOnSpace = useRecoilCallback(
    ({ snapshot, set }) =>
      async (hasBackspaced: boolean) => {
        const currentWordState = await snapshot.getPromise(
          wordsStateAtCurrentIndex,
        );
        const indexState = await snapshot.getPromise(indexAtom);
        const isPerfect = currentWordState.name === currentWordState.input;

        set(wordsState(indexState), {
          ...currentWordState,
          perfect: isPerfect,
          flawless: isPerfect && !hasBackspaced,
        });
        setEol(false);
        set(indexAtom, (prev) => (prev += 1));
      },
    [],
  );

  return (
    <input
      className='input-hidden'
      ref={ref}
      onKeyDown={handleKeyDown}
      value={wordState.input}
      readOnly
      // style={{ visibility: 'hidden' }} this doesnt let me focus the input
    />
  );
});
