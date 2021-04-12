import { css } from '@emotion/react';

export const addTaskModal_input = css`
  margin: 0 0 16px 0;
`;

export const addTaskModal_label = (theme) => css`
  ${theme.text.bodyMD};
  color: ${theme.color.neutral[5]};
  margin: 0 0 4px 0;
`;
