import type * as Stitches from '@stitches/react';
import { ReactNode, VFC } from 'react';
import { useRecoilValue } from 'recoil';
import { Backspace } from 'tabler-icons-react';
import { indexAtom, mistakesAtom, multiplierAtom, scoreAtom } from '../state';
import { styled } from '../stitches.conf';

export function TypingResults({ time }: { time: number }) {
  const index = useRecoilValue(indexAtom);
  const mistakes = useRecoilValue(mistakesAtom);
  const score = useRecoilValue(scoreAtom);
  const multi = useRecoilValue(multiplierAtom);

  return (
    <div id='dev'>
      <ResultsGrid>
        <Box css={{ flexDirection: 'row', display: 'flex', gap: '3rem' }}>
          <ResultItem title={'wpm'} content={90} size='lg' />
          <ResultItem title={'Words typed'} content={index} />
          <ResultItem
            icon={<Backspace />}
            title={'Mistakes'}
            content={mistakes}
          />
        </Box>
        <Box css={{ flexDirection: 'row', display: 'flex', gap: '3rem' }}>
          <ResultItem
            title={'Score'}
            content={score}
            size='lg'
            gridRow={2}
            gridColumn='1 / span 3'
          />
          <ResultItem
            title={'Multiplier'}
            content={multi}
            size='sm'
            gridRow={2}
          />
        </Box>
      </ResultsGrid>
    </div>
  );
}

const ResultsGrid = styled('div', {
  display: 'grid !important',
  // gridTemplateColumns: 'repeat(10, auto)',
  gap: '1.5rem 3rem',
  color: 'white',
  width: '100%',
});

export const ResultItem: VFC<
  { title: string; content: ReactNode } & Stitches.CSS &
    Stitches.VariantProps<typeof StyledResultContent>
> = ({ title, content, size = 'md', icon, ...rest }) => {
  return (
    <Box
      css={{
        flexDirection: 'column',
        display: 'flex',
        // background: '$text',
        // color: '$background',
        padding: '1rem',
        borderRadius: '2px',
        ...rest,
      }}
    >
      <Box
        css={{
          display: 'flex',
          gap: '0.5rem',
        }}
      >
        <>
          {icon}
          <StyledResultTitle>{title}</StyledResultTitle>
        </>
      </Box>
      <StyledResultContent size={size}>{content}</StyledResultContent>
    </Box>
  );
};

const StyledResultTitle = styled('h3', {
  margin: 0,
  fontWeight: 'normal',
});

const StyledResultContent = styled('h3', {
  margin: 0,
  fontSize: '6rem',
  variants: {
    size: {
      sm: {
        fontSize: '2rem',
      },
      md: {
        fontSize: '4rem',
      },
      lg: {
        fontSize: '6rem',
      },
    },
  },
});

export const Box = styled('div', {});
