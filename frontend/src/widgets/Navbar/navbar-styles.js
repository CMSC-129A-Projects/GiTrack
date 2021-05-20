import { css } from '@emotion/react';

export const navbar = (theme) => css`
  background-color: ${theme.color.neutral[0]};
  box-shadow: 0px 12px 24px -12px rgba(0, 25, 68, 0.2);
  padding: 20px 40px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const navbar_nav = css`
  display: flex;
  align-items: center;
`;

export const navbar_image = css`
  width: 187px;
`;

export const navbar_imageContainer = css`
  margin: 0 48px 0 0;
`;

export const navbar_boardsContainer = css`
  position: relative;
`;

export const navbar_boardsButton = (theme) => css`
  ${theme.text.titleLG};
  padding: 8px 12px;
  border-radius: 12px;
  background-color: rgba(32, 87, 227, 0.1);
  color: ${theme.color.primary[3]};
  border: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 108px;
  cursor: pointer;
`;

export const navbar_boardsDropdown = (theme) => css`
  position: absolute;
  top: 48px;
  left: 0px;
  border: 1px solid ${theme.color.neutral[3]};
  width: 240px;
  border-radius: 12px;
  overflow: hidden;
`;

export const navbar_boardsDropdown_button = (theme) => css`
  ${theme.text.titleMD};
  background: ${theme.color.neutral[0]};
  border: none;
  border-bottom: 1px solid ${theme.color.neutral[3]};
  display: flex;
  align-items: center;
  padding: 24px 16px;
  cursor: pointer;
  color: ${theme.color.neutral[7]};
  text-decoration: none;

  &:hover {
    background: ${theme.color.neutral[1]};
  }
`;

export const navbar_boardsDropdown_button___add = (theme) => css`
  ${theme.text.titleMD};
  background: ${theme.color.neutral[0]};
  border: none;
  display: flex;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  color: ${theme.color.primary[3]};
  text-decoration: none;

  &:hover {
    background: ${theme.color.neutral[1]};
  }
`;

export const navbar_boardsDropdown_button_icon = (theme) => css`
  color: ${theme.color.primary[3]};
  margin: 0 12px 0 0;
`;

export const navbar_user = css`
  position: relative;
`;

export const navbar_userButton = css`
  background: none;
  border: none;
  cursor: pointer;
`;

export const navbar_actionsDropdown = (theme) => css`
  position: absolute;
  top: 48px;
  right: 0;
  border: 1px solid ${theme.color.neutral[3]};
  width: 140px;
  border-radius: 12px;
  overflow: hidden;
`;

export const navbar_actionsDropdown_button = (theme) => css`
  ${theme.text.titleMD};
  background: ${theme.color.neutral[0]};
  border: none;
  display: flex;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  color: ${theme.color.neutral[7]};
  text-decoration: none;

  &:hover {
    background: ${theme.color.neutral[1]};
  }
`;

export const navbar_actionsDropdown_button_icon = (theme) => css`
  color: ${theme.color.neutral[4]};
  margin: 0 12px 0 0;
`;
