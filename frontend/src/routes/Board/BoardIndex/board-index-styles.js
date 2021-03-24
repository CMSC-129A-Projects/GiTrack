import { css } from '@emotion/react';

export const boardIndex = (theme) => css`
  padding: 64px;
`;

export const boardIndex_button = (theme) => css`
  position: fixed;
  right: 64px;
  bottom: 64px;
`;

export const boardIndex_header = (theme) => css`
  margin-bottom: 24px;
`;

export const boardIndex_header_boardName = (theme) => css`
  color: ${theme.color.neutral[5]};
  ${theme.text.bodyMD};
  margin: 0;
`;

export const boardIndex_header_name = (theme) => css`
  color: ${theme.color.neutral[7]};
  ${theme.text.headingMD};
  margin: 0;
`;

export const boardIndex_columns = (theme) => css`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 500px;
  grid-gap: 32px;
`;