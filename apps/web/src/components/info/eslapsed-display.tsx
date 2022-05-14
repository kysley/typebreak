import { useRecoilValue } from 'recoil';
import { timerTypeAtom, ratioCompletedAtom } from '../../state';

export const EslapsedDisplay = ({ duration }: { duration: number }) => {
  const mode = useRecoilValue(timerTypeAtom);
  const ratio = useRecoilValue(ratioCompletedAtom);

  if (mode === 'INCREMENTAL') {
    return <span>{ratio}</span>;
  }
  return <span>{duration}s</span>;
};
