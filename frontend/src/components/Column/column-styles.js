import { css } from '@emotion/react';

export const column = (theme) => css`
  background-color: ${theme.color.neutral[2]};
  border-radius: 16px;
  padding: 14px;
`;

export const column_title = (theme) => css`
  ${theme.text.titleMD};
  color: ${theme.color.neutral[6]};
  margin: 12px 8px 16px 8px;
`;
