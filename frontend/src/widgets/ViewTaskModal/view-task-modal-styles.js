import { css } from '@emotion/react';

export const viewTaskModal_input = css`
  margin: 0 0 16px 0;
`;

export const viewTaskModal_label = (theme) => css`
  ${theme.text.bodyMD};
  color: ${theme.color.neutral[5]};
  margin: 0 0 4px 0;
`;

export const viewTaskModal_title = (theme) => css`
  ${theme.text.headingXS};
  color: ${theme.color.neutral[7]};
  margin: 0 0 4px 0;
`;

export const viewTaskModal_body = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const viewTaskModal_bodyTitle = (theme) => css`
  ${theme.text.titleMD};
  color: ${theme.color.neutral[7]};
  margin-top: 24px;
  margin-bottom: 0px;
`;

export const viewTaskModal_bodyText = (theme) => css`
  ${theme.text.bodyMD};
  color: ${theme.color.neutral[7]};
`;

export const viewTaskModal_list = (theme) => css`
  ${theme.text.bodyMD};
  color: ${theme.color.neutral[7]};
  list-style-type: none;

  li:before {
    content: '-';
    position: absolute;
    margin-left: -10px;
  }
`;

export const viewTaskModal_progress = (theme) => css`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;

  ${theme.text.bodyXS};
  margin-top: 4px;
  margin-bottom: 0;
`;

export const viewTaskModal_progressTime = (theme) => css`
  color: ${theme.color.primary[3]};

  background-color: rgba(32, 87, 227, 0.1);
  padding: 6px 8px;
  margin: 0;
  border-radius: 8px;
  width: max-content;
  text-align: center;
`;

export const viewTaskModal_progressText = (theme) => css`
  color: ${theme.color.neutral[7]};
  padding-left: 8px;
`;

export const viewTaskModal_Card = css`
  width: 260px;
  padding: 20px;
`;
