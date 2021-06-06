import { css } from '@emotion/react';

export const taskCard = (theme) => css`
  margin-bottom: 10px;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid ${theme.color.neutral[2]};
`;

export const taskCard_header = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const taskCard_title = (theme) => css`
  ${theme.text.titleLG};
  color: ${theme.color.neutral[7]};
  margin: 0;
  display: flex;
  align-items: center;
`;

export const taskCard_tag = (theme) => css`
  ${theme.text.bodyXS};
  color: ${theme.color.primary[3]};
  background-color: rgba(32, 87, 227, 0.1);
  padding: 6px 8px;
  margin: 4px 0 0 0;
  border-radius: 8px;
  width: max-content;
  text-align: center;
`;

export const taskCard_assignees = css`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
`;

export const taskCard_userImage = css`
  height: 32px;
  width: 32px;
  margin: 0 0 0 -8px;

  p {
    font-size: 1rem;
  }
`;

export const taskCard___red = (theme) => css`
  border-color: ${theme.color.red[3]};
`;

export const taskCard_warningIcon = (theme) => css`
  color: ${theme.color.red[3]};
  margin: 0 0 0 4px;
`;
