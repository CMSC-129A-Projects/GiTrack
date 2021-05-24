import { css } from '@emotion/react';

export const addDeveloperModal_input = css`
  margin: 0 0 16px 0;
`;

export const addDeveloperModal_note = (theme) => css`
  ${theme.text.bodyMD};
  color: ${theme.color.neutral[6]};
`;
