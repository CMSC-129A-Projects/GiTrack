import { css } from '@emotion/react';

export const column = (theme) => css`
  background-color: ${theme.color.neutral[1]};
  border-radius: 16px;
  padding: 14px;
`;

export const column_title = (theme) => css`
  ${theme.text.titleMD};
  color: ${theme.color.neutral[5]};
  padding: 16px;
  margin: 0;
`;
