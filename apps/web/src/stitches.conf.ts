import { createStitches } from '@stitches/react';

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
} = createStitches({
  theme: {
    colors: {
      background: '#272822',
      caret: '#66d9ef',
      text: '#e2e2dc',
      sub: '#e6db74',
      error: '#f92672',
      extra: '#fd971f',
    },
  },
  media: {
    bp1: '(min-width: 480px)',
  },
});

export const terminal = createTheme('terminal', {
  colors: {
    background: '#191a1b',
    caret: '#79a617',
    text: '#e7eae0',
    sub: '#48494b',
    error: '#a61717',
    extra: '#731010',
  },
});

export const light = createTheme('light', {
  colors: {
    background: '#f5f5f7',
    background2: '#dfdfdf',
    background3: '#dad7d0',
    caret: '#d73a49',
    text: '#0000ff',
    sub: '#000000',
    error: '#a31515',
    extra: '#008000',
  },
});
