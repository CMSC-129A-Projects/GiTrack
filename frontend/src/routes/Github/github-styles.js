import { css } from '@emotion/react';

export const github = css`
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
`;

export const github_h1 = (theme) => css`
  ${theme.text.headingMD};
  color: ${theme.color.neutral[6]};
`;
