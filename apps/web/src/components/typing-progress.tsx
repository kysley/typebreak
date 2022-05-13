import { useRecoilValue } from 'recoil';
import { animated, useSpring, useTransition } from 'react-spring';
import {
  comboAtom,
  COMBO_LIMIT,
  multiplierAtom,
  percentCompletedAtom,
  scoreAtom,
} from '../state';
import { styled } from '../stitches.conf';
import { useEffect, useRef, useState } from 'react';
import { v4 } from 'uuid';
const COMBO_PLACEHOLDER = Array.from({ length: COMBO_LIMIT }, () =>
  Math.random(),
);

export const TypingProgress = () => {
  const percentCompleted = useRecoilValue(percentCompletedAtom);

  return (
    <Container>
      <span>{percentCompleted}%</span>
      <ComboDisplay />
      <ScoreDisplay />
    </Container>
  );
};

function ScoreDisplay() {
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
        <animated.div style={styles}>{item.value}</animated.div>
        // <animated.span style={numberProps}>{delta}</animated.span>
      ))}
    </div>
  );
}

function ComboDisplay() {
  const multiplier = useRecoilValue(multiplierAtom);
  const combo = useRecoilValue(comboAtom);

  const relativeCombo = multiplier * COMBO_LIMIT - combo || combo;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        fontSize: '1.35rem',
        gap: '10px',
      }}
    >
      <span>{multiplier}x</span>
      <div style={{ display: 'flex', gap: '5px' }}>
        {COMBO_PLACEHOLDER.map((id, idx) => (
          <Dot key={id} filled={COMBO_LIMIT - relativeCombo > idx} />
        ))}
      </div>
    </div>
  );
}

const Dot = styled('div', {
  height: 5,
  width: 5,
  borderRadius: '50%',
  backgroundColor: '$sub',
  variants: {
    filled: {
      true: {
        backgroundColor: '$caret',
      },
    },
  },
});

const Container = styled('div', {
  display: 'grid',
  gap: '1em',
  gridTemplateColumns: '1fr 1fr 1fr',
  justifyContent: 'space-between',
  width: '100%',
  alignItems: 'center',
});
