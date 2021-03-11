import { Global, css } from '@emotion/react'

import global_font from './app-global-font-styles'
import global_reset from './app-global-reset-styles'
import global_root from './app-global-root-styles'

export default function GlobalStyles() {
  return (
    <Global
      styles={css`
        ${global_font};
        ${global_reset};
        ${global_root};
      `}
    />
  )
}
