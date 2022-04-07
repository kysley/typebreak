import { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTimer } from 'use-timer';
import { timerType, typingState } from '../state';

export function useTypingTimer() {
  const timer = useRecoilValue(timerType);
  const [userTypingState, setTypingState] = useRecoilState(typingState);

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
