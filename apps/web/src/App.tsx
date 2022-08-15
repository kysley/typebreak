import { WordsRenderer } from './components/words-renderer';
import './App.css';
import { TypingInfo } from './components/info/typing-info';
import { styled, terminal } from './stitches.conf';
import { useTypingTimer } from './hooks/use-typing-timer';
import { TypingResults } from './components/typing-results';
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
    <div className={`App container ${terminal}`}>
      <GameContainer>
        {state !== 'DONE' ? (
          <>
            <InfoContainer>
              <TypingInfo duration={time} />
            </InfoContainer>
            <WordsRenderer />
            <ResetButton opaque={state === 'STARTED'} />
          </>
        ) : (
          <TypingResults time={time} />
        )}
      </GameContainer>
    </div>
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

const InfoContainer = styled('div', {
  color: '$text',
  display: 'flex',
  // width: '925px',
  // marginBottom: '1em',
  // justifyContent: 'flex-start',
});

const GameContainer = styled('div', {
  background: '$background',
  // padding: '56px 96px',
  borderRadius: '9px',
  maxWidth: '1075px',
  // height: '70vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: '25px',
  gap: '15px',
});

export default App;
