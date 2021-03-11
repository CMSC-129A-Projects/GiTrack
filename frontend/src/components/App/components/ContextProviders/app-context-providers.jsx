// Components
import { ThemeProvider } from '@emotion/react'

import theme from 'utils/theme'

export default function ContextProviders({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}