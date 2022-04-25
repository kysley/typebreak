import { useTypingTimer } from './hooks/use-typing-timer';
import { WordsRenderer } from './components/words-renderer';
import './App.css';
import { useRecoilValue } from 'recoil';
import { comboAtom, scoreAtom } from './state';

function App() {
  const time = useTypingTimer();
  const score = useRecoilValue(scoreAtom);
  const combo = useRecoilValue(comboAtom);

  return (
    <div className='App container'>
      <span>time: {time}</span>
      <span>score: {score}</span>
      <span>combo: {combo}</span>
      {/* <button tabIndex={0} onClick={resetWordsState}>
        reset
      </button> */}
      <WordsRenderer />
    </div>
  );
}

export default App;
