import { useRecoilValue } from 'recoil';
import { Bolt, Clock, Gauge, HourglassHigh } from 'tabler-icons-react';
import { useWPM } from '../../hooks/use-wpm';
import { timerTypeAtom, ratioCompletedAtom } from '../../state';
import { styled } from '../../stitches.conf';

export const EslapsedDisplay = ({ duration }: { duration: number }) => {
  const mode = useRecoilValue(timerTypeAtom);
  const ratio = useRecoilValue(ratioCompletedAtom);
  const wpm = useWPM(60 - duration);

  return (
    <Container>
      <Wrapper>
        <HourglassHigh />
        <Text>{mode === 'INCREMENTAL' ? ratio : `${duration}s`}</Text>
      </Wrapper>
      <Wrapper>
        <Gauge />
        <Text>{wpm || 0}</Text>
      </Wrapper>
    </Container>
  );
};

const Container = styled('div', {
  display: 'grid',
  gap: '24px',
  justifyContent: 'flex-start',
  gridAutoFlow: 'column',
});

const Text = styled('span', {
  fontSize: '20px',
  fontWeight: 'bold',
});

const Wrapper = styled('div', {
  alignItems: 'center',
  display: 'flex',
  gap: '5px',
});
