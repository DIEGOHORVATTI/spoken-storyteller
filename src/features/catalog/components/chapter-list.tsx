import type { ChapterSummary } from '../api'

import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import List from '@mui/material/List'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'

import { paths } from 'src/paths'

import { chapterLabel } from '../utils'

type ChapterListProps = {
  novelSlug: string
  novelTitle: string
  chapters: ChapterSummary[]
  currentSlug?: string
}

const PAGE_SIZE = 100

export function ChapterList({ novelSlug, novelTitle, chapters, currentSlug }: ChapterListProps) {
  const [filter, setFilter] = useState('')
  const [visible, setVisible] = useState(PAGE_SIZE)

  const normalizedFilter = filter.trim().toLowerCase()
  const filtered = chapters.filter((chapter) =>
    chapter.title.toLowerCase().includes(normalizedFilter),
  )

  return (
    <Stack spacing={2}>
      <TextField
        size="small"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
        placeholder="Filtrar capítulos, ex.: volume 16"
      />
      <List disablePadding dense>
        {filtered.slice(0, visible).map((chapter) => (
          <ListItemButton
            key={chapter.id}
            component={RouterLink}
            to={paths.chapter(novelSlug, chapter.slug)}
            selected={chapter.slug === currentSlug}
            sx={{ borderRadius: 1 }}
          >
            <ListItemText primary={chapterLabel(chapter.title, novelTitle)} />
          </ListItemButton>
        ))}
      </List>
      {filtered.length > visible && (
        <Button color="inherit" onClick={() => setVisible((count) => count + PAGE_SIZE)}>
          Mostrar mais ({filtered.length - visible})
        </Button>
      )}
    </Stack>
  )
}
