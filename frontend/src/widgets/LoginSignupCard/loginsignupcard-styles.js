import { css } from '@emotion/react';

export const loginSignupCard = css`
  padding: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  width: 420px;
  height: 385px;
  margin-top: 48px;
`;

export const loginSignupCard_title = (theme) => css`
  ${theme.text.headingMD};
  color: ${theme.color.neutral[7]};
  padding-top: 48px;
  padding-bottom: 28px;
  margin: 0;
`;
export const loginSignupCard_children = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const loginSignupCard_button = css`
  margin-top: 28px;
`;

export const loginSignupCard_subtext = (theme) => css`
  ${theme.text.bodyMD};
  color: ${theme.color.neutral[4]};
  padding: 32px 44px 44px 44px;
`;

export const loginSignupCard_link = (theme) => css`
  color: ${theme.color.primary[3]};
  text-decoration: none;
`;
