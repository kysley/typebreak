import { WordsRenderer } from './components/words-renderer';
import './App.css';
import { TypingInfo } from './components/typing-info';
import { styled } from './stitches.conf';
import { useArcadeMode } from './hooks/use-arcade-mode';
import { useTypingTimer } from './hooks/use-typing-timer';

function App() {
  const duration = useTypingTimer();
  return (
    <div className='App container'>
      <InfoContainer>
        <TypingInfo duration={duration} />
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
