import { css } from '@emotion/react';
import Background from 'assets/images/Vector.svg';

export const login = (theme) => css`
  background-color: ${theme.color.primary[3]};
  height: 100vh;
`;

export const login_background = css`
  background-image: url(${Background});
  width: 100vw;
  height: 100vh;
  background-size: cover;
`;
