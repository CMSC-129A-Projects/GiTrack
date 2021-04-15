import { css } from '@emotion/react';

export const loginPage = css`
  padding: 48px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const loginCard = css`
  width: 420px;
  height: 385px;
`;

export const loginPage_image = css`
  width: 100%;
`;

export const loginPage_imageContainer = css`
  width: 262px;
`;

export const loginPage_inputs = css`
  padding-bottom: 20px;
`;

export const loginPage_footer = (theme) => css`
  color: ${theme.color.neutral[0]};
  ${theme.text.bodyLG}
  padding: 80px;
`;
