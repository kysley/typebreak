import { WordsRenderer } from './components/words-renderer';
import './App.css';
import { TypingInfo } from './components/info/typing-info';
import { keyframes, light, styled, terminal } from './stitches.conf';
import { useTypingTimer } from './hooks/use-typing-timer';
import { Box, TypingResults } from './components/typing-results';
import { useEffect } from 'react';
import { useWords } from './hooks/use-words';
import { Refresh } from 'tabler-icons-react';

function App() {
  const { time, state } = useTypingTimer();
  const { reset } = useWords();

  useEffect(() => {
    reset();
  }, [reset]);

  return (
    <Wrapper className={`App container ${light}`}>
      {state !== 'DONE' ? (
        <>
          <InfoContainer detached={state === 'STARTED'}>
            <TypingInfo duration={time} />
          </InfoContainer>
          <GameContainer detached={state === 'STARTED'}>
            <WordsRenderer />
          </GameContainer>
          <ResetButton opaque={state === 'STARTED'} />
        </>
      ) : (
        <TypingResults time={time} />
      )}
    </Wrapper>
  );
}

function ResetButton(props: any) {
  const { reset } = useWords();
  return (
    <StyledResetButton onClick={reset} tabIndex={0} {...props}>
      <Refresh size={35} />
    </StyledResetButton>
  );
}

const StyledResetButton = styled('button', {
  color: '$text',
  // opacity: '0.2',
  padding: '0.5rem',
  borderRadius: '5px',
  border: 'none',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  width: '200px',
  alignSelf: 'center',
  '&:hover': {
    opacity: 0.2,
    backgroundColor: '$sub',
  },
  variants: {
    opaque: {
      true: {},
    },
  },
});

const InfoDetachKeyframes = keyframes({
  '0%': {
    transform: 'translateY(0)',
  },
  '50%': {
    transform: 'translateY(-0.75rem)',
  },
  '80%': {
    transform: 'translateY(-.47rem)',
  },
  '100%': {
    transform: 'translateY(-.5rem)',
  },
});

const InfoContainer = styled('div', {
  color: '$text',
  display: 'flex',
  maxWidth: '1075px',
  width: '100%',
  background: '$background2',
  borderRadius: '3vh 3vh 0 0',
  // height: '50px',
  alignItems: 'center',
  padding: '.5rem 1rem',
  transition: 'all .1s',

  variants: {
    detached: {
      true: {
        animation: `${InfoDetachKeyframes} .3s`,
        // transform: 'translateY(-0.5rem)',
        borderRadius: '3vh',
        transform: 'translateY(-.5rem)',
      },
    },
  },
});

const GameContainer = styled('div', {
  background: '$background3',
  borderRadius: '0 0 3vh 3vh',
  maxWidth: '1075px',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: '20px',
  gap: '15px',
  transition: 'margin .5s, border-radius .1s ',

  variants: {
    detached: {
      true: {
        // marginTop: '.5rem',
        borderRadius: '3vh',
        // marginBottom: '.5rem',
      },
    },
  },
});

const Wrapper = styled('main', {
  backgroundColor: '$background',
});

export default App;
