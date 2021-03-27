import { css } from '@emotion/react';

const base = css`
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: none;
  padding: 12px 24px;
  border-radius: 64px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.05);

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

export const button_icon = (theme) => css`
  margin: 0 8px 0 0;
  font-size: 1.5rem;

  @media (max-width: 767px) {
    font-size: 1.25rem;
  }
`;

export const button___xlarge___primary = (theme) => css`
  ${base}
  ${theme.text.button1};
  padding: 16px 24px;
  background-color: ${theme.color.primary[3]};
  color: ${theme.color.neutral[0]};
  transition: ${theme.transition.default(['background-color'])};

  @media (max-width: 767px) {
    padding: 12px 16px;
  }
`;

export const button___large___primary = (theme) => css`
  ${base}
  ${theme.text.button2};
  padding: 16px 24px;
  background-color: ${theme.color.primary[3]};
  color: ${theme.color.neutral[0]};
  transition: ${theme.transition.default(['background-color'])};

  @media (max-width: 767px) {
    padding: 12px 16px;
  }
`;

export const button___small___primary = (theme) => css`
  ${base}
  ${theme.text.button3};
  padding: 12px 36px;
  background-color: ${theme.color.primary[3]};
  color: ${theme.color.neutral[0]};
  transition: ${theme.transition.default(['background-color'])};

  @media (max-width: 767px) {
    padding: 12px 16px;
  }
`;

export const button___small___secondary = (theme) => css`
  ${base}
  ${theme.text.button3};
  padding: 12px 36px;
  background-color: ${theme.color.neutral[0]};
  color: ${theme.color.primary[3]};
  transition: ${theme.transition.default(['background-color'])};

  @media (max-width: 767px) {
    padding: 12px 16px;
  }
`;
