import { css } from '@emotion/react';

export const boardIndex = css`
  padding: 40px 64px 32px;
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
  grid-template-rows: 680px;
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

export const boardIndex_settingsButton = css`
  padding: 0;
  border: none;
  outline: none;
  text-decoration: none;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0);
`;

export const boardIndex_settings = (theme) => css`
  color: ${theme.color.primary[3]};
  font-size: 2.5rem;
  margin: 8px 0 0 -10px;
`;

export const boardIndex_settingsDropdown = (theme) => css`
  position: absolute;
  border: 1px solid ${theme.color.neutral[3]};
  height: max-content;
  width: max-content;
  border-radius: 12px;
  overflow: hidden;
`;

export const boardIndex_settingsDropdown_button = (theme) => css`
  ${theme.text.titleMD};
  background: ${theme.color.neutral[0]};
  border: none;
  display: flex;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  color: red;
  text-decoration: none;

  &:hover {
    background: #fff4f4;
  }
`;

export const boardIndex_settingsDropdown_button_icon = css`
  color: red;
  margin: 0 12px 0 0;
`;

export const boardIndex_filterOptions = css`
  display: flex;
  align-items: center;
  margin: 0 0 24px 0;
`;

export const boardIndex_search = css`
  width: 280px;
`;

export const boardIndex_filter = css`
  display: flex;
  align-items: center;
  margin: 0 0 0 24px;
`;

export const boardIndex_filter_label = (theme) => css`
  ${theme.text.bodyMD};
  color: ${theme.color.neutral[4]};
  margin: 0 12px 0 0;
`;

export const boardIndex_filter_dropdown = css`
  width: 200px;
`;
