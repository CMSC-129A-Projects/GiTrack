import { css } from '@emotion/react';

import materialIcons_ttf from 'assets/fonts/MaterialIcons-Regular.ttf';
import materialIcons_woff from 'assets/fonts/MaterialIcons-Regular.woff';
import materialIcons_woff2 from 'assets/fonts/MaterialIcons-Regular.woff2';

export default css`
  @font-face {
    font-family: 'Material Icons';
    font-style: normal;
    font-weight: 400;
    src: url(${materialIcons_ttf}); /* For IE6-8 */
    src: url(${materialIcons_woff2}) format('woff2'),
      url(${materialIcons_woff}) format('woff'),
      url(${materialIcons_ttf}) format('truetype');
    font-display: swap;
  }
`;
