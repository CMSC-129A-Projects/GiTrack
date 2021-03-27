import { css } from '@emotion/react';

export const input = (theme) => css`
  ${theme.text.bodyMD};
  background-color: transparent;
  color: ${theme.color.neutral[7]};
  border-radius: 8px;
  border: 1px solid ${theme.color.neutral[3]};
  padding: 8px 12px;
  width: 100%;
  box-sizing: border-box;
  height: 40px;
  outline: none;
  transition: ${theme.transition.default(['border-color'])};

  &:hover,
  &:active {
    border: 1px solid ${theme.color.primary[3]};
  }

  &:focus {
    border: 1px solid ${theme.color.primary[3]};
    box-shadow: 0 0 3px rgb(123, 117, 235);
  }

  &::placeholder {
    opacity: 0.3;
  }
`;

export const input___error = (theme) => css`
  border: 1px solid ${theme.color.red[4]};
`;

export const input_label = (theme) => css`
  color: ${theme.color.neutral[5]};
  ${theme.text.bodyMD};
  margin: 0 0 4px 0;
`;

export const input_errorMessage = (theme) => css`
  color: ${theme.color.red[4]};
  ${theme.text.bodySM};
  margin: 4px 0 0 0;
`;
