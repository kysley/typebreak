import { WordsRenderer } from './components/words-renderer';
import './App.css';
import { TypingProgress } from './components/typing-progress';
import { styled } from './stitches.conf';

function App() {
  return (
    <div className='App container'>
      {/* <button tabIndex={0} onClick={resetWordsState}>
        reset
      </button> */}
      <InfoContainer>
        <TypingProgress />
      </InfoContainer>
      <WordsRenderer />
    </div>
  );
}

const InfoContainer = styled('div', {
  color: '$text',
  display: 'flex',
  width: '72vw',
  // justifyContent: 'flex-start',
});

export default App;
