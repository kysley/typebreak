import { styled } from '../stitches.conf';
import { ComboDisplay } from './info/combo-display';
import { EslapsedDisplay } from './info/eslapsed-display';
import { ScoreDisplay } from './info/score-display';

export const TypingInfo = ({ duration }: { duration: number }) => {
  return (
    <Container>
      <EslapsedDisplay duration={duration} />
      <ComboDisplay />
      <ScoreDisplay />
    </Container>
  );
};

const Container = styled('div', {
  display: 'grid',
  gap: '1em',
  gridTemplateColumns: '1fr 1fr 1fr',
  justifyContent: 'space-between',
  width: '100%',
  alignItems: 'center',
});
