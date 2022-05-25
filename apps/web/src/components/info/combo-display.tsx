import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ModifierTypes } from '../../modifiers';
import { multiplierAtom, wordsStateAtPreviousIndex } from '../../state';
import { styled } from '../../stitches.conf';

const COMBO_PLACEHOLDER = Array.from({ length: 5 }, () => Math.random());

export function ComboDisplay() {
  const [multiplier, setMultiplierState] = useRecoilState(multiplierAtom);
  const prevState = useRecoilValue(wordsStateAtPreviousIndex);

  const [chain, setChain] = useState<(ModifierTypes | 'flawless')[]>([]);

  useEffect(() => {
    if (!prevState) return;

    if (prevState.flawless) {
      setChain((prev) => [...prev, prevState.modifier?.type || 'flawless']);
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
          <Dot key={id} color={chain[idx]} />
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
    color: {
      flawless: {
        backgroundColor: '$text',
      },
      CAMO: {
        backgroundColor: 'green',
      },
      ICY: {
        backgroundColor: 'blue',
      },
      MINE: {
        backgroundColor: 'Gray',
      },
    },
  },
});
