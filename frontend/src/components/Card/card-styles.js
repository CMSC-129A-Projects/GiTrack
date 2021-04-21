import { css } from '@emotion/react';

export const card = (theme) => css`
  background-color: ${theme.color.neutral[0]};
  border-radius: 16px;
  box-shadow: 0px 12px 24px -12px rgba(0, 25, 68, 0.2);
  height: max-content;
`;

export const card___clickable = (theme) => css`
  background-color: ${theme.color.neutral[0]};
  border-radius: 16px;
  box-shadow: 0px 12px 24px -12px rgba(0, 25, 68, 0.2);
  height: max-content;
  cursor: pointer;

  &:hover,
  &:focus,
  &:active {
    box-shadow: 0px 0px 0px 0px;
    border: 1px solid rgba(32, 87, 227, 0.3);
  }
`;
