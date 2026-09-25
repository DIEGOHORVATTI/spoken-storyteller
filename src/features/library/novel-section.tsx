import type { ReactNode } from 'react'

import List from '@mui/material/List'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

type NovelSectionProps = {
  title: string
  children: ReactNode
}

export function NovelSection({ title, children }: NovelSectionProps) {
  return (
    <Stack spacing={1}>
      <Typography variant="overline" color="text.secondary">
        {title}
      </Typography>
      <List disablePadding>{children}</List>
    </Stack>
  )
}
