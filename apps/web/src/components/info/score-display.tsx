import { useEffect, useRef, useState } from 'react';
import { animated, useSpring, useTransition } from 'react-spring';
import { useRecoilValue } from 'recoil';
import { v4 } from 'uuid';
import { scoreAtom } from '../../state';

export function ScoreDisplay() {
  const score = useRecoilValue(scoreAtom);

  const props = useSpring({
    val: score,
    from: { val: 0 },
    config: {
      tension: 210,
      friction: 20,
      clamp: true,
    },
  });

  const prevScore = useRef<number | null>(null);

  const [deltas, setDelta] = useState<{ key: string; value: number }[]>([]);

  // maybe increase the top by -5 for each index in the array
  // this would cause the scores to gradually rise up when you are typing fast
  const numberTransitions = useTransition(deltas, {
    keys: (d) => d.key,
    from: { position: 'absolute', opacity: 0 },
    leave: { opacity: 0, top: -30 },
    enter: { opacity: 1, top: -15 },
    // expires: false,
    // delay: 200,
  });

  useEffect(() => {
    if (prevScore.current) {
      const d = score - prevScore.current;
      setDelta((prev) => [...prev, { key: v4(), value: d }]);
      setTimeout(
        () =>
          setDelta((prev) => {
            prev.shift();
            return prev;
          }),
        100,
      );
    }
    prevScore.current = score;
  }, [score]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'right',
        fontWeight: 600,
        fontSize: '1.2rem',
        position: 'relative',
      }}
    >
      <animated.span>{props.val.to((val) => Math.floor(val))}</animated.span>
      {numberTransitions((styles, item) => (
        //@todo
        //@ts-expect-error idk what to do there
        <animated.div style={styles}>+{item.value}</animated.div>
      ))}
    </div>
  );
}
