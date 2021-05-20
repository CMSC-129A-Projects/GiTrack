import { css } from '@emotion/react';

export const addTaskModal_input = css`
  margin: 0 0 24px 0;
`;

export const addTaskModal_label = (theme) => css`
  ${theme.text.titleMD};
  color: ${theme.color.neutral[7]};
  margin: 0 0 4px 0;
`;

export const addTaskModal_actions = css`
  margin: 32px 0 0 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;

  @media (max-width: 767px) {
    flex-direction: column;
  }
`;

export const addTaskModal_actions_button = css`
  margin: 0 0 0 12px;

  @media (max-width: 767px) {
    margin: 12px 0 0 0;
    width: 100%;
  }
`;
