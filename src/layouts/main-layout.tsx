import { Outlet, Link as RouterLink } from 'react-router-dom'

import Link from '@mui/material/Link'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import { useColorScheme } from '@mui/material/styles'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded'

function ColorModeButton() {
  const { mode, systemMode, setMode } = useColorScheme()
  const isDark = (mode === 'system' ? systemMode : mode) === 'dark'

  return (
    <Tooltip title={isDark ? 'Tema claro' : 'Tema escuro'}>
      <IconButton onClick={() => setMode(isDark ? 'light' : 'dark')}>
        {isDark ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
      </IconButton>
    </Tooltip>
  )
}

export function MainLayout() {
  return (
    <>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.default' }}
      >
        <Container maxWidth="md">
          <Toolbar disableGutters sx={{ gap: 1 }}>
            <Link
              component={RouterLink}
              to="/"
              underline="none"
              color="text.primary"
              variant="h6"
              sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}
            >
              <AutoStoriesRoundedIcon color="primary" />
              Spoken Storyteller
            </Link>
            <ColorModeButton />
          </Toolbar>
        </Container>
      </AppBar>

      <Container component="main" maxWidth="md" sx={{ py: 4, flexGrow: 1 }}>
        <Outlet />
      </Container>
    </>
  )
}
