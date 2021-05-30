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
  grid-template-rows: 500px;
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

export const boardIndex_iconRow = css`
  display: flex;
  flex-direction: row;
  margin: 12px 0 0 0;
`;

export const boardIndex_imageContainer = css`
  height: 100%;
  margin: -3px;
  border-radius: 50%;
  box-shadow: 0 0 0 4px #fff;
`;

export const boardIndex_panelButton = css`
  border: none;
  outline: none;
  text-decoration: none;
  cursor: pointer;
  margin: -10px;
  background-color: rgba(0, 0, 0, 0.00005);
`;

export const boardIndex_icon__clickable = (theme) => css`
  display: flex;
  justify-content: center;
  align-items: center;

  color: ${theme.color.neutral[5]};
  font-size: 1.5rem;

  background-color: ${theme.color.neutral[2]};
  height: 36px;
  width: 36px;
  border-radius: 50%;
  border: solid white;
`;
