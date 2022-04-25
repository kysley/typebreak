import { forwardRef, useRef } from 'react';
import { useRecoilCallback, useRecoilState } from 'recoil';
import {
  eolAtom,
  indexAtom,
  typingStateAtom,
  wordsStateAtom,
  wordsStateAtCurrentIndex,
  WordState,
} from '../state';

export const HiddenInput = forwardRef((props, ref: any) => {
  const [eol, setEol] = useRecoilState(eolAtom);
  const [wordState, setWordState] = useRecoilState(wordsStateAtCurrentIndex);
  const selectedAllRef = useRef(false);
  const [usertypingState, setTypingState] = useRecoilState(typingStateAtom);

  const hasBackspacedCurrentWord = useRef(false);

  // Todo: modify newWordState directly and setWordState at the end
  // this also makes our handleWordModifier's a lot cleaner
  //
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isCtrl = e.ctrlKey || e.metaKey;
    const isText = e.key.length === 1 && e.key !== ' ' && !isCtrl && !eol;
    const isBackspace = e.key === 'Backspace';
    const isSpace = e.key === ' ';

    const newWordState = { ...wordState };

    if (isText) {
      if (usertypingState === 'IDLE') {
        setTypingState('STARTED');
      }
      if (selectedAllRef.current) {
        console.log('all selected, replacing with next key');
        newWordState.input = e.key;
      } else {
        newWordState.input += e.key;
        if (wordState.modifier?.trigger === 'TYPE') {
          handleWordModifier(newWordState);
        }
      }
    }

    if (isCtrl) {
      if (isBackspace) {
        console.log('ctrl + backspace');
        newWordState.input = '';
      }
      if (e.key === 'a') {
        console.log('ctrl + a');
        selectedAllRef.current = true;
      }
      setWordState(newWordState);
    }

    if (isBackspace) {
      hasBackspacedCurrentWord.current = true;
      setEol(false);
      if (wordState.input.length === 0) {
        console.log('backspacing through word');
        handleCanBackspaceThroughWord();
        return;
      }
      if (selectedAllRef.current) {
        console.log('backspacing all');
        newWordState.input = '';
      } else {
        console.log('backspacing normal');

        newWordState.input = newWordState.input.substring(
          0,
          newWordState.input.length - 1,
        );
      }
    }

    if (isSpace) {
      if (wordState.input.length === 0) return;
      if (wordState.modifier?.trigger === 'SPACE') {
        handleWordModifier(newWordState);
      }
      console.log('space');
      updateOnSpace(hasBackspacedCurrentWord.current);
      hasBackspacedCurrentWord.current = false;
    }

    if ((isText || isBackspace) && selectedAllRef.current) {
      selectedAllRef.current = false;
    }

    setWordState(newWordState);
  };

  const handleWordModifier = useRecoilCallback(
    ({ snapshot, set }) =>
      async (wordState: WordState) => {
        const indexState = await snapshot.getPromise(indexAtom);

        function modifyWord(value: Partial<WordState>, index?: number) {
          if (index) {
            set(wordsStateAtom(index), (prev) => ({ ...prev, ...value }));
          } else {
            set(wordsStateAtom(indexState), { ...wordState, ...value });
          }
        }

        const executed = wordState.modifier?.onTrigger(
          { modifyWord, addWord: () => {} },
          wordState,
          indexState,
        );
        if (executed && wordState.modifier?.type === 'MINE') {
          set(indexAtom, (prev) => (prev += 4));
        }
        console.log(executed);
        if (!executed) {
          set(wordsStateAtom(indexState), wordState);
        }
      },
  );

  const handleCanBackspaceThroughWord = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        const indexState = await snapshot.getPromise(indexAtom);

        const previousWordState = await snapshot.getPromise(
          wordsStateAtom(indexState - 1),
        );
        if (previousWordState.perfect || previousWordState.destroyed) return;

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

        // We handle the frozen modifier logic in handleWordModifier
        // todo: is there a better way to do this?
        if (!currentWordState.frozen) {
          set(wordsStateAtom(indexState), {
            ...currentWordState,
            perfect: isPerfect,
            flawless: isPerfect && !hasBackspaced,
          });
          setEol(false);
          set(indexAtom, (prev) => (prev += 1));
        }
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
