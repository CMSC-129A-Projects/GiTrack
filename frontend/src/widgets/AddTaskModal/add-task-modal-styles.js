import { css } from '@emotion/react';

export const addTaskModal_input = css`
  margin: 0 0 24px 0;
`;

export const addTaskModal_label = (theme) => css`
  ${theme.text.titleMD};
  color: ${theme.color.neutral[7]};
  margin: 0 0 4px 0;
`;
