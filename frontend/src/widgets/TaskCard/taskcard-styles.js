import { css } from '@emotion/react';

export const taskCard = css`
  margin-bottom: 10px;
  padding: 14px;
`;

export const taskCard_header = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
`;

export const taskCard_title = (theme) => css`
  ${theme.text.titleLG};
  color: ${theme.color.neutral[7]};
  margin: 0;
`;

export const taskCard_imageContainer = css`
  height: 25px;
`;

export const taskCard_image = css`
  height: 100%;
`;

export const taskCard_body = (theme) => css`
  ${theme.text.bodyXS};
  color: ${theme.color.neutral[4]};
  padding: 8px 0;
  margin: 0;
`;

export const taskCard_tag = (theme) => css`
  ${theme.text.bodyXS};
  color: ${theme.color.primary[3]};
  background-color: rgba(32, 87, 227, 0.1);
  padding: 6px 8px;
  margin: 0;
  border-radius: 8px;
  width: max-content;
  text-align: center;
`;
