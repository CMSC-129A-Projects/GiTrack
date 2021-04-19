import { css } from '@emotion/react';

export const addBoard = css`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 80vh;
`;

export const addBoard_input = (theme) => css`
  ${theme.text.headingMD};
  color: ${theme.color.neutral[7]};
  border: none;
  outline: none;
  text-align: center;
  margin: 0 0 32px 0;

  &::placeholder {
    opacity: 0.2;
  }
`;
