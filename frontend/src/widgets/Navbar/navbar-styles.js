import { css } from '@emotion/react';

export const navbar = (theme) => css`
  background-color: ${theme.color.neutral[0]};
  box-shadow: 0px 12px 24px -12px rgba(0, 25, 68, 0.2);
  padding: 20px 40px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
`;

export const navbar_imageContainer = (theme) => css`
  width: 187px;
`;

export const navbar_image = (theme) => css`
  width: 100%;
`;
