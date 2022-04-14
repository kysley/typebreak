import { useRecoilValue } from 'recoil';
import { wordsState } from '../state';
import { memo } from 'react';
import { styled } from '../stitches.conf';

type WordProps = {
  myIndex: number;
  hidden: boolean;
  show: boolean;
};
function WordComponent({ myIndex, hidden, show }: WordProps) {
  const word = useRecoilValue(wordsState(myIndex));

  const inputLength = word.input.length - 1;

  return (
    <StyledWord
      flawless={word.flawless}
      perfect={(!word.flawless && word.perfect) || false}
      incorrect={!word.perfect && word.perfect !== null}
      destroyed={word.destroyed}
      frozen={word.frozen}
      hidden={hidden}
      modifier={word.modifier?.type}
    >
      {word.name.split('').map((letter, idx) => {
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
      {word.input.length > word.name.length && (
        <>
          {word.input
            .substring(word.name.length)
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
  variants: {
    modifier: {
      ICY: {
        borderBottom: '2px dashed blue',
      },
      MINE: {
        borderBottom: '2px dashed red',
      },
    },
    hidden: {
      true: {
        display: 'none',
      },
    },
    frozen: {
      true: {
        backgroundColor: 'powderblue',
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
        borderBottom: '2px solid gold',
      },
    },
    perfect: {
      true: {
        borderBottom: '2px solid blue',
      },
    },
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
