import { css } from '@emotion/react';

export const viewRepoModal_heading = (theme) => css`
  ${theme.text.headingXS}
  color: ${theme.color.primary[3]};
  margin: 0 0 16px 0;
`;

export const viewRepoModal_body = (theme) => css`
  color: ${theme.color.primary[3]};
  ${theme.text.bodySM};
`;

export const viewRepoModal_image = css`
  height: 130px;
`;

export const viewRepoModal_imageContainer = css`
  height: 100%;
`;
