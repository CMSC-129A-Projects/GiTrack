import { css } from '@emotion/react';
import theme from 'utils/theme';

export default css`
  .ql-snow {
    border-color: ${theme.color.neutral[3]} !important;
    color: ${theme.color.neutral[7]} !important;
  }

  .ql-stroke {
    stroke: ${theme.color.neutral[7]} !important;
  }

  .ql-picker {
    color: ${theme.color.neutral[7]} !important;
  }

  .ql-toolbar {
    border-radius: 8px 8px 0 0;
  }

  .ql-container {
    border-radius: 0 0 8px 8px;
    font-size: 0.875rem !important;
  }
`;
