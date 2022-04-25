import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useTimer } from 'use-timer';
import { timerTypeAtom, typingStateAtom } from '../state';

export function useTypingTimer() {
  const timer = useRecoilValue(timerTypeAtom);
  const [userTypingState, setTypingState] = useRecoilState(typingStateAtom);

  const { start, reset, time } = useTimer({
    autostart: false,
    initialTime: 0,
    timerType: timer,
    onTimeOver: () => setTypingState('DONE'),
  });

  useEffect(() => {
    if (userTypingState === 'STARTED') {
      start();
    } else if (userTypingState === 'IDLE') {
      reset();
    }
  }, [reset, start, userTypingState]);

  return time;
}
