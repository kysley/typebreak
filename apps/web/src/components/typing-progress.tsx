import { useRecoilValue } from 'recoil';
import { animated, useSpring } from 'react-spring';
import {
  comboAtom,
  COMBO_LIMIT,
  multiplierAtom,
  percentCompletedAtom,
  scoreAtom,
} from '../state';
import { styled } from '../stitches.conf';

const COMBO_PLACEHOLDER = Array.from({ length: COMBO_LIMIT }, () =>
  Math.random(),
);

export const TypingProgress = () => {
  const percentCompleted = useRecoilValue(percentCompletedAtom);
  const multiplier = useRecoilValue(multiplierAtom);
  const combo = useRecoilValue(comboAtom);
  const score = useRecoilValue(scoreAtom);
  const props = useSpring({ val: score, from: { val: 0 } });

  // fix: this fills the combo backwards
  const relativeCombo = multiplier * COMBO_LIMIT - combo || combo;

  return (
    <Container>
      <span>{percentCompleted}%</span>
      <div>
        score{' '}
        <animated.span>{props.val.to((val) => Math.floor(val))}</animated.span>
      </div>
      <span>{multiplier}x</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        {COMBO_PLACEHOLDER.map((id, idx) => (
          <Dot key={id} filled={relativeCombo > idx} />
        ))}
      </div>
    </Container>
  );
};

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
  gridTemplateColumns: 'auto auto auto auto',
});
