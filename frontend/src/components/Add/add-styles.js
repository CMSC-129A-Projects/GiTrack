import { css } from '@emotion/react';

export const add = (theme) => css`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${theme.color.primary[3]};
  height: 36px;
  width: 36px;
  background-color: ${theme.color.neutral[0]};
  border-radius: 50%;
  border: 1px solid ${theme.color.primary[3]};
  cursor: pointer;
  padding: 0;
`;

export const add_icon = css`
  font-size: 1.5rem;
`;
