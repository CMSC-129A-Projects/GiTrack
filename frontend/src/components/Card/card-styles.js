import { css } from '@emotion/react';

export const card = (theme) => css`
  background-color: ${theme.color.neutral[0]};
  border-radius: 16px;
  box-shadow: 0px 12px 24px -12px rgba(0, 25, 68, 0.2);
  height: max-content;
  padding: 14px;
`;
