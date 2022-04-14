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
