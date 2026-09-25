import type { ReadingProgress } from './use-reading-progress'

import List from '@mui/material/List'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { paths } from 'src/paths'
import { NovelListItem } from 'src/features/catalog/components/novel-list-item'

type ContinueReadingProps = {
  items: ReadingProgress[]
}

export function ContinueReading({ items }: ContinueReadingProps) {
  if (!items.length) return null

  return (
    <Stack spacing={1}>
      <Typography variant="overline" color="text.secondary">
        Continuar ouvindo
      </Typography>
      <List disablePadding>
        {items.map((item) => (
          <NovelListItem
            key={item.novelSlug}
            slug={item.novelSlug}
            title={item.novelTitle}
            to={paths.chapter(item.novelSlug, item.chapterSlug)}
            secondary={item.chapterTitle}
          />
        ))}
      </List>
    </Stack>
  )
}
