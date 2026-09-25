import { useParams, useLocation, Link as RouterLink } from 'react-router-dom'

import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'

import { paths } from 'src/paths'
import { chapterLabel } from 'src/features/catalog/utils'
import { ChapterReader } from 'src/features/player/components/chapter-reader'
import { useReadingProgress } from 'src/features/library/use-reading-progress'
import { useReaderSettings } from 'src/features/player/hooks/use-reader-settings'
import { useNovel, useChapter, useChapters } from 'src/features/catalog/hooks/use-catalog'

type ChapterLocationState = { autoplay?: boolean } | null

export function ChapterPage() {
  const { novelSlug = '', chapterSlug = '' } = useParams()
  const location = useLocation()
  const novel = useNovel(novelSlug)
  const chapters = useChapters(novel.data?.categoryId)
  const chapter = useChapter(chapterSlug)
  const { state: settings, setState: setSettings } = useReaderSettings()
  const { progressByNovel } = useReadingProgress()

  const error = novel.error ?? chapter.error ?? chapters.error
  if (error) return <Alert severity="error">{error.message}</Alert>
  if (!novel.data || !chapter.data || !chapters.data) return <LinearProgress />

  const progress = progressByNovel[novelSlug]
  const startParagraph = progress?.chapterSlug === chapterSlug ? progress.paragraph : 0
  const autoplay = !!(location.state as ChapterLocationState)?.autoplay

  return (
    <Stack spacing={3}>
      <Stack spacing={1} alignItems="flex-start">
        <Button
          component={RouterLink}
          to={paths.novel(novelSlug)}
          color="inherit"
          size="small"
          startIcon={<ArrowBackRoundedIcon />}
        >
          {novel.data.title}
        </Button>
        <Typography variant="h4">{chapterLabel(chapter.data.title, novel.data.title)}</Typography>
      </Stack>

      <ChapterReader
        novel={novel.data}
        chapter={chapter.data}
        chapters={chapters.data}
        settings={settings}
        startParagraph={startParagraph}
        autoplay={autoplay}
        onChangeSettings={setSettings}
      />
    </Stack>
  )
}
