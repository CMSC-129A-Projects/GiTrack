import { css } from '@emotion/react';

export const signinGithubModal = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const signinGithubModal_text = (theme) => css`
  ${theme.text.bodyMD};
  color: ${theme.color.neutral[4]};
`;

export const signinGithubModal_images = css`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const signinGithubModal_image = css`
  width: 100%;
`;

export const signinGithubModal_imageContainer = css`
  width: 52px;
`;

export const signinGithubModal_imageTextContainer = css`
  width: 120px;
`;
