import { useRecoilValue } from 'recoil';
import { useWPM } from '../../hooks/use-wpm';
import { timerTypeAtom, ratioCompletedAtom } from '../../state';

export const EslapsedDisplay = ({ duration }: { duration: number }) => {
  const mode = useRecoilValue(timerTypeAtom);
  const ratio = useRecoilValue(ratioCompletedAtom);
  const wpm = useWPM(duration);

  if (mode === 'INCREMENTAL') {
    return (
      <span>
        {ratio} | {wpm || 0}
      </span>
    );
  }
  return (
    <span>
      {duration}s | {wpm || 0}
    </span>
  );
};
