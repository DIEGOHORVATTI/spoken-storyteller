import './global.css'

import { QueryClientProvider } from '@tanstack/react-query'

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

import { Router } from './routes'
import { queryClient } from './lib/query-client'
import { themeConfig, ThemeProvider } from './theme'

export function App() {
  return (
    <>
      <InitColorSchemeScript
        modeStorageKey={themeConfig.modeStorageKey}
        attribute={themeConfig.cssVariables.colorSchemeSelector}
        defaultMode={themeConfig.defaultMode}
      />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          modeStorageKey={themeConfig.modeStorageKey}
          defaultMode={themeConfig.defaultMode}
        >
          <Router />
        </ThemeProvider>
      </QueryClientProvider>
    </>
  )
}
