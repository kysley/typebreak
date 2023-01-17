import { RefObject, useLayoutEffect, useMemo } from 'react';
import { animated, useSpring, easings } from 'react-spring';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { currentLetterAtom, eolAtom } from '../state';
import { AllSlices, useStore, WordState } from '../state/words-slice';
import { styled } from '../stitches.conf';

const selector = (state: AllSlices) => ({dispatch: state.dispatch, curLetter: state.wordsState[state.index].input.length})
export const Caret = ({
  index,
  words,
  wordsRef,
  secondLineTop,
  line,
}: {
  wordsRef: RefObject<HTMLDivElement>;
  index: number;
  words: WordState[];
  secondLineTop: number;
  line: 1 | 2;
}) => {
  // const curLetter = useRecoilValue(currentLetterAtom);
  // const setEol = useSetRecoilState(eolAtom);
  const {dispatch, curLetter} = useStore(selector)
  const [caretPos, setCaretPos] = useSpring(() => ({
    transform: 'translate(0,0)',
    config: {
      duration: 200,
      easing: easings.easeOutCubic,
    },
  }));

  const horizontalSpaceBetweenWords = useMemo(
    () =>
      Math.abs(
        (wordsRef?.current?.children[0]?.getBoundingClientRect().right || 30) -
          (wordsRef?.current?.children[1]?.getBoundingClientRect().left || 20),
      ),
    [wordsRef],
  );

  useLayoutEffect(() => {}, []);

  // Handle the caret position
  useLayoutEffect(() => {
    console.log('caret effect');
    if (!wordsRef.current) return;

    const wordsDom = Array.from(wordsRef.current.children);
    const containerBounding = wordsRef.current.getBoundingClientRect();

    const thisWord = wordsDom[index] as Element;

    const letters = Array.from(thisWord.children);

    let dir: 'left' | 'right';
    let letter;
    let isExtraLetter = false;
    if (curLetter >= words[index].word.length) {
      letter = letters[curLetter - 1];
      dir = 'right';
      isExtraLetter = true;
    } else {
      letter = letters[curLetter];
      dir = 'left';
    }
    const letterBounding = letter.getBoundingClientRect();
    const isEol =
      isExtraLetter &&
      letterBounding['right'] + horizontalSpaceBetweenWords * 2 >
        containerBounding.right;

    dispatch({endOfLine: isEol});

    setCaretPos({
      transform: `translate(${
        letterBounding[dir] - containerBounding.left - 2 || 0
      }px, ${line === 1 ? -4 : secondLineTop / 2.3}px)`,
    });
  }, [
    curLetter,
    index,
    horizontalSpaceBetweenWords,
    setCaretPos,
    words,
    wordsRef,
    line,
    secondLineTop,
  ]);

  return <StyledCaret style={caretPos} />;
};

const StyledCaret = styled(animated.div, {
  left: 0,
  top: 5,
  width: '3px',
  height: '1.5rem',
  position: 'absolute',
  backgroundColor: '$caret',
});
