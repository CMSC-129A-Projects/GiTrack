import { css } from '@emotion/react';

export const signupPage = css`
  padding: 48px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const signupPage_image = css`
  width: 100%;
`;

export const signupPage_imageContainer = css`
  width: 262px;
`;

export const signupPage_inputs = css`
  padding-bottom: 20px;
`;

export const signupPage_footer = (theme) => css`
  color: ${theme.color.neutral[0]};
  ${theme.text.bodyLG}
  padding: 80px;
`;

export const signupPage_errorMessage = (theme) => css`
  color: ${theme.color.red[3]};
  ${theme.text.bodySM}
`;
