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

  transition: background-color 0.3s;
  cursor: pointer;

  &:hover,
  &:focus,
  &:active {
    background-color: #f6f9ff;
  }
`;
