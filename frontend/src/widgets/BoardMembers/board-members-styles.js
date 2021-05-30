import { css } from '@emotion/react';

export const boardMembers = css`
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-end;
  align-items: center;
  margin: 8px 0 0 0;
`;

export const boardMembers_member = (theme) => css`
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
  text-decoration: none;
  cursor: pointer;
  background-color: ${theme.color.neutral[2]};
  border-radius: 50%;
  padding: 0;
  margin: 0 -4px 0 0;
`;
