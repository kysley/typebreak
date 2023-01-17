import { forwardRef, useRef } from 'react';
import { useRecoilCallback } from 'recoil';
import {
  eolAtom,
  indexAtom,
  typingStateAtom,
  wordsStateAtom,
  wordsStateAtCurrentIndex,
  WordState,
  multiplierAtom,
  scoreAtom,
  mistakesAtom,
} from '../state';
import { useStore } from '../state/words-slice';

export const HiddenInput = forwardRef((props, ref: any) => {
  // const selectedAllRef = useRef(false);
  // const hasBackspacedCurrentWord = useRef(false);
  const {handler} = useStore(state => ({handler: state.onKeyDown}))

  // Todo: modify newWordState directly and setWordState at the end
  // this also makes our handleWordModifier's a lot cleaner
  // const handleKeyDown = useRecoilCallback(
  //   ({ snapshot, set }) =>
  //     async (e: React.KeyboardEvent<HTMLInputElement>) => {
  //       const usertypingState = await snapshot.getPromise(typingStateAtom);
  //       const eol = await snapshot.getPromise(eolAtom);
  //       const wordState = await snapshot.getPromise(wordsStateAtCurrentIndex);
  //       const isCtrl = e.ctrlKey || e.metaKey;
  //       const isText = e.key.length === 1 && e.key !== ' ' && !isCtrl && !eol;
  //       const isBackspace = e.key === 'Backspace';
  //       const isSpace = e.key === ' ';

  //       const newWordState = { ...wordState };

  //       if (isText) {
  //         if (usertypingState === 'IDLE') {
  //           set(typingStateAtom, 'STARTED');
  //         }
  //         if (selectedAllRef.current) {
  //           console.log('all selected, replacing with next key');
  //           newWordState.input = e.key;
  //         } else {
  //           newWordState.input += e.key;
  //           if (
  //             newWordState.input[newWordState.input.length - 1] ===
  //             newWordState.name[newWordState.input.length - 1]
  //           ) {
  //             // set(comboAtom, (prev) => (prev += 1));
  //           } else {
  //             // set(comboAtom, 0);
  //             set(mistakesAtom, (prev) => (prev += 1));
  //           }
  //           if (wordState.modifier?.trigger === 'TYPE') {
  //             handleWordModifier(newWordState);
  //           }
  //         }
  //       }

  //       if (isCtrl) {
  //         if (isBackspace) {
  //           console.log('ctrl + backspace');
  //           newWordState.input = '';
  //         }
  //         if (e.key === 'a') {
  //           console.log('ctrl + a');
  //           selectedAllRef.current = true;
  //         }
  //         set(wordsStateAtCurrentIndex, newWordState);
  //       }

  //       if (isBackspace) {
  //         hasBackspacedCurrentWord.current = true;
  //         set(eolAtom, false);
  //         if (wordState.input.length === 0) {
  //           console.log('backspacing through word');
  //           handleCanBackspaceThroughWord();
  //           return;
  //         }
  //         if (selectedAllRef.current) {
  //           console.log('backspacing all');
  //           newWordState.input = '';
  //         } else {
  //           console.log('backspacing normal');
  //           set(mistakesAtom, (prev) => (prev += 1));

  //           newWordState.input = newWordState.input.substring(
  //             0,
  //             newWordState.input.length - 1,
  //           );
  //         }
  //       }

  //       if (isSpace) {
  //         if (wordState.input.length === 0) return;
  //         if (wordState.modifier?.trigger === 'SPACE') {
  //           handleWordModifier(newWordState);
  //         }
  //         console.log('space');
  //         updateOnSpace(hasBackspacedCurrentWord.current);
  //         hasBackspacedCurrentWord.current = false;
  //       }

  //       if ((isText || isBackspace) && selectedAllRef.current) {
  //         selectedAllRef.current = false;
  //       }

  //       set(wordsStateAtCurrentIndex, newWordState);
  //     },
  //   [],
  // );

  // const handleWordModifier = useRecoilCallback(
  //   ({ snapshot, set }) =>
  //     async (wordState: WordState) => {
  //       const indexState = await snapshot.getPromise(indexAtom);

  //       const executed = wordState.modifier?.onTrigger?.(
  //         { snapshot, set },
  //         wordState,
  //         indexState,
  //       );
  //       if (executed && wordState.modifier?.type === 'MINE') {
  //         set(indexAtom, (prev) => (prev += 4));
  //       }
  //       console.log(executed);
  //     },
  // );

  // const handleCanBackspaceThroughWord = useRecoilCallback(
  //   ({ snapshot, set }) =>
  //     async () => {
  //       const indexState = await snapshot.getPromise(indexAtom);

  //       const previousWordState = await snapshot.getPromise(
  //         wordsStateAtom(indexState - 1),
  //       );
  //       if (previousWordState.perfect || previousWordState.destroyed) return;

  //       set(indexAtom, (prev) => (prev -= 1));
  //     },
  //   [],
  // );

  // const updateOnSpace = useRecoilCallback(
  //   ({ snapshot, set }) =>
  //     async (hasBackspaced: boolean) => {
  //       const currentWordState = await snapshot.getPromise(
  //         wordsStateAtCurrentIndex,
  //       );
  //       const indexState = await snapshot.getPromise(indexAtom);
  //       const multiplierState = await snapshot.getPromise(multiplierAtom);
  //       const isPerfect = currentWordState.name === currentWordState.input;

  //       if (isPerfect) {
  //         // set(multiplierAtom, (prev) => (prev += 0.11));
  //         set(scoreAtom, (prev) =>
  //           prev === 0 ? 50 : (prev += 50 * multiplierState),
  //         );
  //       } else {
  //         set(multiplierAtom, 1.0);
  //       }
  //       // We handle the frozen modifier logic in handleWordModifier
  //       // todo: is there a better way to do this?
  //       if (!currentWordState.frozen) {
  //         set(wordsStateAtom(indexState), {
  //           ...currentWordState,
  //           perfect: isPerfect,
  //           flawless: isPerfect && !hasBackspaced,
  //         });
  //         // setEol(false);
  //         set(eolAtom, false);
  //         set(indexAtom, (prev) => (prev += 1));
  //       }
  //     },
  //   [],
  // );

  return (
    <input
      className='input-hidden'
      ref={ref}
      onKeyDown={handler}
      // value={wordState.input}
      autoFocus
      readOnly
      style={{
        zIndex: -1,
        resize: 'none',
        position: 'fixed',
        pointerEvents: 'none',
        opacity: 0,
      }}
    />
  );
});
