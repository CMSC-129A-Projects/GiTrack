import { css } from '@emotion/react';

export const boardIndex = css`
  padding: 64px;
`;

export const boardIndex_button = css`
  position: fixed;
  right: 64px;
  bottom: 64px;
`;

export const boardIndex_header = css`
  margin-bottom: 24px;
`;

export const boardIndex_header_boardName = (theme) => css`
  color: ${theme.color.neutral[6]};
  ${theme.text.bodyMD};
  margin: 0;
`;

export const boardIndex_header_name = (theme) => css`
  color: ${theme.color.neutral[7]};
  ${theme.text.headingMD};
  margin: 0;
`;

export const boardIndex_columns = css`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 640px;
  grid-gap: 32px;
`;

export const boardIndex_sidePanel = css`
  padding: 0 0 0 30px;
`;

export const boardIndex_text = (theme) => css`
  color: ${theme.color.neutral[6]};
  ${theme.text.bodyMD};
  margin: 24px 0 0 0;
`;

export const boardIndex_imageContainer = css`
  height: 100%;
  margin: -3px;
  border-radius: 50%;
  box-shadow: 0 0 0 4px #fff;
`;
