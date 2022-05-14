import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { multiplierAtom, wordsStateAtPreviousIndex } from '../../state';
import { styled } from '../../stitches.conf';

const COMBO_PLACEHOLDER = Array.from({ length: 6 }, () => Math.random());

export function ComboDisplay() {
  const multiplier = useRecoilValue(multiplierAtom);
  const prevState = useRecoilValue(wordsStateAtPreviousIndex);
  const setMultiplierState = useSetRecoilState(multiplierAtom);

  const [chain, setChain] = useState<string[]>([]);

  useEffect(() => {
    if (!prevState) return;

    if (prevState.flawless) {
      setChain((prev) => [prevState.modifier?.type || 'flawless', ...prev]);
    }
  }, [prevState]);

  useEffect(() => {
    if (chain.length === 5) {
      setMultiplierState(
        (prev) =>
          (prev += chain.reduce((acc, c) => {
            switch (c) {
              case 'flawless':
                acc += 1;
                break;
              case 'CAMO':
                acc += 1.5;
                break;
              case 'MINE':
                acc += 3;
                break;
              case 'ICY':
                acc += 2;
                break;
            }

            return acc;
          }, 0)),
      );
      setChain([]);
      return;
    }
  }, [chain, setMultiplierState]);

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
          // <Dot key={id} filled={COMBO_LIMIT - relativeCombo > idx} />
          <Dot key={id} filled={!!chain[idx]} />
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
