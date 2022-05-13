import { useSetRecoilState } from 'recoil';
import { focusedAtom } from '../state';

export function useRefocus() {
  const setRefocusState = useSetRecoilState(focusedAtom);
  return () => setRefocusState((p) => p + 1);
}
