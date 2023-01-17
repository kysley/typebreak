import { useRecoilValue } from 'recoil';
import { wordsStateAtom } from '../state';
import { memo } from 'react';
import { styled } from '../stitches.conf';
import { AllSlices, useStore, WordStatus, WordState } from '../state/words-slice';

type WordProps = {
  word: WordState;
  hidden: boolean;
  show: boolean;
};

function WordComponent({ word, hidden, show }: WordProps) {
  // const word = useRecoilValue(wordsStateAtom(myIndex));
  // const {word} = useStore((state) => ({
  //   word: state.wordsState[myIndex]
  // }))

  const inputLength = word.input.length - 1;

  return (
    <StyledWord
      flawless={word.flawless}
      // perfect={(!word.flawless && word.perfect) || false}
      incorrect={!word.perfect && word.perfect !== undefined}
      destroyed={word.status === WordStatus.DESTROYED}
      frozen={word.status === WordStatus.FROZEN}
      hidden={hidden}
      mine={word.modifier?.type === 'MINE'}
      camo={!show && word.modifier?.type === 'CAMO'}
    >
      {word.word.split('').map((letter, idx) => {
        const notYetTyped = inputLength >= idx;
        return (
          <StyledLetter
            correct={show && notYetTyped && word.input[idx] === letter}
            incorrect={show && notYetTyped && word.input[idx] !== letter}
            key={`${letter}-${idx}`}
          >
            {letter}
          </StyledLetter>
        );
      })}
      {word.input.length > word.word.length && (
        <>
          {word.input
            .substring(word.word.length)
            .split('')
            .map((letter, idx) => {
              return (
                <StyledLetter extra key={`${letter}-${idx}`}>
                  {letter}
                </StyledLetter>
              );
            })}
        </>
      )}
    </StyledWord>
  );
}

export const Word = memo(WordComponent);

export const StyledWord = styled('span', {
  color: '$sub',
  fontSize: '1.5rem',
  lineHeight: '1.5rem',
  borderBottom: '2px solid transparent',
  // transition: 'all .1s ease-in',
  variants: {
    mine: {
      true: {
        borderBottom: '1px dashed red',
      },
    },
    camo: {
      true: {
        borderBottom: '2px groove green',
        color: '$background',
      },
    },
    hidden: {
      true: {
        display: 'none',
      },
    },
    frozen: {
      true: {
        // borderBottom: '2px dotted powderblue',
        boxShadow: 'inset 0 0 20px #61cae4',
        borderRadius: '3px',
      },
    },
    destroyed: {
      true: {
        borderbottom: '2px gray outset',
        opacity: '.3',
      },
    },
    flawless: {
      true: {
        borderBottom: '2px solid $text',
      },
    },
    // perfect: {
    //   true: {
    //     borderBottom: '2px solid blue',
    //   },
    // },
    incorrect: {
      true: {
        borderBottom: '2px solid $error',
      },
    },
  },
});

const StyledLetter = styled('span', {
  variants: {
    incorrect: {
      true: {
        color: '$error',
      },
    },
    correct: {
      true: {
        color: '$text',
      },
    },
    extra: {
      true: {
        color: '$extra',
      },
    },
  },
});
