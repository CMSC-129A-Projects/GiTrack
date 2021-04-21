import { css } from '@emotion/react';

export const loginSignupCard = css`
  padding: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 48px 0 0 0;
  width: 420px;
`;

export const loginSignupCard_title = (theme) => css`
  ${theme.text.headingMD};
  color: ${theme.color.neutral[7]};
  margin: 0 0 28px 0;
`;

export const loginSignupCard_button = css`
  margin: 28px 0 0 0;
  width: 100%;
`;

export const loginSignupCard_subtext = (theme) => css`
  ${theme.text.bodyMD};
  color: ${theme.color.neutral[4]};
  margin: 32px 0 0 0;
  text-align: center;
`;

export const loginSignupCard_link = (theme) => css`
  color: ${theme.color.primary[3]};
  text-decoration: none;
`;
