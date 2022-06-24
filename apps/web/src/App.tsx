import { WordsRenderer } from './components/words-renderer';
import './App.css';
import { TypingInfo } from './components/info/typing-info';
import { styled } from './stitches.conf';
import { useTypingTimer } from './hooks/use-typing-timer';
import { TypingResults } from './components/typing-results';
import { useEffect } from 'react';
import { useWords } from './hooks/use-words';

function App() {
  const { time, state } = useTypingTimer();
  const { reset } = useWords();

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
  const { reset } = useWords();
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
