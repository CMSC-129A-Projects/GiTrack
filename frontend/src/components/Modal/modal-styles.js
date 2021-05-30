import { css } from '@emotion/react';

const base = css`
  border-radius: 16px;
  outline: currentcolor none medium;
  height: max-content;
  box-shadow: 0px 12px 24px -12px rgba(0, 25, 68, 0.2);
  margin: 40px auto;
  position: relative;
  padding: 40px;

  @media (max-width: 767px) {
    margin: 0 auto;
  }
`;

export const modal___small = (theme) => css`
  ${base}
  border: 1px solid ${theme.color.neutral[2]};
  background-color: ${theme.color.neutral[0]};
  max-width: 340px;
`;

export const modal___medium = (theme) => css`
  ${base}
  border: 1px solid ${theme.color.neutral[2]};
  background-color: ${theme.color.neutral[0]};
  max-width: 560px;
`;

export const modal___large = (theme) => css`
  ${base}
  border: 1px solid ${theme.color.neutral[2]};
  background-color: ${theme.color.neutral[0]};
  max-width: 800px;
`;

export const modal_head = css`
  display: flex;
  align-items: center;
  margin: 0 0 32px 0;
`;

export const modal_iconContainer = (theme) => css`
  background-color: ${theme.color.primary[3]};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 36px;
  margin: 0 16px 0 0;
`;

export const modal_icon = (theme) => css`
  color: ${theme.color.neutral[0]};
  font-size: 1.25rem;
`;

export const modal_title = (theme) => css`
  margin: 0;
  ${theme.text.headingXS};
  color: ${theme.color.primary[3]};
`;

export const modal_actions_button = css`
  margin: 0 0 0 12px;

  @media (max-width: 767px) {
    margin: 12px 0 0 0;
    width: 100%;
  }
`;

export const modal_actions___two = css`
  margin: 32px 0 0 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;

  @media (max-width: 767px) {
    flex-direction: column;
  }
`;

export const modal_actions___one = css`
  margin: 32px 0 0 0;
  display: flex;
  justify-content: center;
`;

export const modal___loading_spinner = css`
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 2;
`;

export const modal___loading_background = (theme) => css`
  border-radius: 16px;
  background-color: ${theme.color.neutral[0]};
  opacity: 0.8;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
`;
