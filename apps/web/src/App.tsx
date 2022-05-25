import { WordsRenderer } from './components/words-renderer';
import './App.css';
import { TypingInfo } from './components/info/typing-info';
import { styled } from './stitches.conf';
import { useArcadeMode } from './hooks/use-arcade-mode';
import { useTypingTimer } from './hooks/use-typing-timer';
import { TypingResults } from './components/typing-results';
import { useEffect } from 'react';

function App() {
  const { time, state } = useTypingTimer();
  const { reset } = useArcadeMode();

  useEffect(() => {
    reset();
  }, [reset]);

  return (
    <div className='App container'>
      {state !== 'DONE' ? (
        <>
          <InfoContainer>
            <TypingInfo duration={time} />
          </InfoContainer>
          <WordsRenderer />
          <ResetButton />
        </>
      ) : (
        <TypingResults time={time} />
      )}
    </div>
  );
}

function ResetButton() {
  const { reset } = useArcadeMode();
  return (
    <button onClick={reset} tabIndex={0}>
      reset
    </button>
  );
}

const InfoContainer = styled('div', {
  color: '$text',
  display: 'flex',
  width: '925px',
  marginBottom: '1em',
  // justifyContent: 'flex-start',
});

export default App;
