import { RefObject, useLayoutEffect, useMemo } from 'react';
import { animated } from 'react-spring';
import { useSpring } from 'react-spring';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { currentLetterAtom, eolAtom } from '../state';
import { styled } from '../stitches.conf';

export const Caret = ({
  index,
  words,
  wordsRef,
  breakAt,
}: {
  wordsRef: RefObject<HTMLDivElement>;
  index: number;
  words: string[];
  breakAt?: number;
}) => {
  const curLetter = useRecoilValue(currentLetterAtom);
  const setEol = useSetRecoilState(eolAtom);
  const [caretPos, setCaretPos] = useSpring(() => ({
    transform: 'translate(0,0)',
    config: { duration: 55, friction: 5, precision: 1 },
  }));

  const horizontalSpaceBetweenWords = useMemo(
    () =>
      Math.abs(
        (wordsRef?.current?.children[0]?.getBoundingClientRect().right || 30) -
          (wordsRef?.current?.children[1]?.getBoundingClientRect().left || 20),
      ),
    [wordsRef],
  );

  // Handle the caret position
  useLayoutEffect(() => {
    console.log('caret effect');
    if (!wordsRef.current) return;

    const wordsDom = Array.from(wordsRef.current.children);
    const containerBounding = wordsRef.current.getBoundingClientRect();

    const thisWord = wordsDom[index] as any;

    const letters = Array.from(thisWord.children);

    let dir: 'left' | 'right';
    let letter;
    let isExtraLetter = false;
    if (curLetter >= words[index].name.length) {
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

    setEol(isEol);

    setCaretPos({
      transform: `translate(${letterBounding[dir]}px, ${
        letterBounding.bottom - letterBounding.height
      }px)`,
    });
  }, [
    curLetter,
    index,
    horizontalSpaceBetweenWords,
    setCaretPos,
    words,
    wordsRef,
    breakAt,
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
