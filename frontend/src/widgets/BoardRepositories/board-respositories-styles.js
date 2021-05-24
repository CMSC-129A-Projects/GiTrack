import { css } from '@emotion/react';

export const repo_repo = (theme) => css`
  display: flex;
  justify-content: center;
  align-items: center;

  ${theme.text.headingXS};
  color: ${theme.color.primary[3]};

  background-color: rgba(32, 87, 227, 0.1);
  height: 36px;
  width: 36px;
  margin: -3px;
  border-radius: 50%;
  box-shadow: 0 0 0 4px #fff;
`;

export const repo_add = (theme) => css`
  display: flex;
  justify-content: center;
  align-items: center;

  color: ${theme.color.neutral[5]};
  font-size: 2rem;

  background-color: ${theme.color.neutral[2]};
  height: 36px;
  width: 36px;
  margin: -3px;
  border-radius: 50%;
  box-shadow: 0 0 0 4px #fff;
  cursor: pointer;
`;
