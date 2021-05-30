import { css } from '@emotion/react';

export const boardRepositories = css`
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-end;
  align-items: center;
  margin: 8px 0 0 0;
`;

export const boardRepositories_repo = (theme) => css`
  display: flex;
  justify-content: center;
  align-items: center;

  ${theme.text.headingXS};
  color: ${theme.color.primary[3]};

  background-color: ${theme.color.primary[1]};
  height: 40px;
  width: 40px;
  margin: 0 -4px 0 0;
  border-radius: 50%;
  border: none;
  box-shadow: 0 0 0 3px #fff;
  padding: 0;
  cursor: pointer;
`;

export const boardRepositories_repo_text = css`
  margin: 0;
`;

export const boardRepositories_add = (theme) => css`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${theme.color.primary[3]};
  height: 32px;
  width: 32px;
  background-color: ${theme.color.neutral[0]};
  border-radius: 50%;
  border: 1px solid ${theme.color.primary[3]};
  cursor: pointer;
  padding: 0;
`;

export const boardRepositories_add_icon = css`
  font-size: 1.5rem;
`;
