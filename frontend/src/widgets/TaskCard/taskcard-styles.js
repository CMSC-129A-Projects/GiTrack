import { css } from '@emotion/react';

export const taskCard = (theme) => css`
  margin-left: 14px;
  margin-right: 18px;
  margin-bottom: 20px;
`;

export const taskCard_header = (theme) => css`
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

export const taskCard_imageContainer = (theme) => css`
  height: 25px;
`;

export const taskCard_image = (theme) => css`
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

  :empty {
    display: none;
  }
`;
