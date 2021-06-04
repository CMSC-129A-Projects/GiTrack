import { css } from '@emotion/react';

export const userImage = (theme) => css`
  display: flex;
  justify-content: center;
  align-items: center;

  ${theme.text.headingXS};
  height: 40px;
  width: 40px;
  border-radius: 50%;
  border: 2px solid white;
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
  font-size: 1.25rem;
`;
