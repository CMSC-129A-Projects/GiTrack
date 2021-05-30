import { css } from '@emotion/react';

export const column = (theme) => css`
  background-color: ${theme.color.neutral[2]};
  border-radius: 12px;
`;

export const column_title = (theme) => css`
  ${theme.text.titleMD};
  color: ${theme.color.neutral[6]};
  margin: 0;
  padding: 24px 24px 0 24px;
  margin: 0 0 16px 0;
`;

export const column_body = css`
  overflow: auto;
  height: calc(100% - 56px);
  padding: 0 12px;
`;
