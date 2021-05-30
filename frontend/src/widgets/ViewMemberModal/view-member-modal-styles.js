import { css } from '@emotion/react';

export const viewMemberModal = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: -10px 0 0 0;
`;

export const viewMemberModal_heading = (theme) => css`
  ${theme.text.headingXS}
  color: ${theme.color.primary[3]}
`;

export const viewMemberModal_image = css`
  height: 120px;
  width: 120px;

  p {
    font-size: 4.5rem;
    line-height: 1;
  }
`;
