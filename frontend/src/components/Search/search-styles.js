import { css } from '@emotion/react';

export const search = css`
  position: relative;
  border-radius: 12px;
`;

export const search_input = (theme) => css`
  ${theme.text.bodyMD};
  background-color: transparent;
  color: ${theme.color.neutral[7]};
  border: 1px solid ${theme.color.neutral[3]};
  border-radius: 8px;
  padding: 6px 10px 6px 36px;
  box-sizing: border-box;
  width: 100%;
  outline: none;
  height: 38px;
  transition: ${theme.transition.default(['border-color'])};

  &:hover,
  &:active {
    border: 1px solid ${theme.color.primary[3]};
  }

  &:focus {
    border-color: ${theme.color.primary[3]};
    box-shadow: 0 0 3px rgb(123, 117, 235);
  }
`;

export const search_icon = css`
  position: absolute;
  left: 10px;
  top: 10px;
  font-size: 1rem;
  margin: 0 10px 0 0;
`;
