import { WordsRenderer } from './components/words-renderer';
import './App.css';
import { TypingProgress } from './components/typing-progress';
import { styled } from './stitches.conf';
import { useArcadeMode } from './hooks/use-arcade-mode';
import { useTypingTimer } from './hooks/use-typing-timer';

function App() {
  const duration = useTypingTimer();
  return (
    <div className='App container'>
      {/* <button tabIndex={0} onClick={resetWordsState}>
        reset
      </button> */}
      <InfoContainer>
        <span>{duration}s</span>
        <TypingProgress />
      </InfoContainer>
      <WordsRenderer />
      <ResetButton />
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
