import { css } from '@emotion/react';

export const userImage = (theme) => css`
  display: flex;
  justify-content: center;
  align-items: center;

  ${theme.text.headingXS};
  height: 36px;
  width: 36px;
  margin: -3px;
  border-radius: 50%;
  box-shadow: 0 0 0 4px #fff;
`;

export const userImage___red = css`
  background-color: #b53c24;
  color: #fff;
`;

export const userImage___blue = css`
  background-color: #1e8ed4;
  color: #fff;
`;

export const userImage___purple = css`
  background-color: #7c18ba;
  color: #fff;
`;

export const userImage___green = css`
  background-color: #1fa65c;
  color: #fff;
`;

export const userImage___orange = css`
  background-color: #e87e15;
  color: #fff;
`;

export const userImage_text = css`
  margin: 0;
`;
