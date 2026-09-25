import type { ReactNode } from 'react'

import { Link as RouterLink } from 'react-router-dom'

import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'

import { NovelCover } from './novel-cover'
import { useNovel } from '../hooks/use-catalog'

type NovelListItemProps = {
  slug: string
  title: string
  to: string
  secondary?: ReactNode
  action?: ReactNode
}

export function NovelListItem({ slug, title, to, secondary, action }: NovelListItemProps) {
  const { data: novel } = useNovel(slug)

  return (
    <ListItem disablePadding secondaryAction={action}>
      <ListItemButton component={RouterLink} to={to} sx={{ gap: 2, borderRadius: 1.5 }}>
        <NovelCover src={novel?.cover} title={title} width={48} />
        <ListItemText
          primary={title}
          secondary={secondary ?? (novel ? `${novel.chapterCount} capítulos` : ' ')}
          slotProps={{ primary: { variant: 'subtitle1' } }}
        />
      </ListItemButton>
    </ListItem>
  )
}
