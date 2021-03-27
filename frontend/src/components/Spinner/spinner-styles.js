import { css } from '@emotion/react'

export const spinner_container = css`
  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 12px;
  box-sizing: border-box;
`

export const spinner = css`
  width: 3.75rem;
  transform-origin: center;
  animation: rotate 2s linear infinite;
`

export const spinner_circle = (theme) => css`
  @keyframes dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 200;
      stroke-dashoffset: -35px;
    }
    100% {
      stroke-dashoffset: -125px;
    }
  }

  fill: none;
  stroke: ${theme.color.primary[4]};
  stroke-width: 4;
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
`
