import { css } from '@emotion/react';

export const viewRepoModal = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: -10px 0 0 0;
`;

export const viewRepoModal_heading = (theme) => css`
  ${theme.text.headingXS}
  color: ${theme.color.primary[3]}
`;

export const viewRepoModal_image = css`
  height: 130px;
`;

export const viewRepoModal_imageContainer = css`
  height: 100%;
`;
