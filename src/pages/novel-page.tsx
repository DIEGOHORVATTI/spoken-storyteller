import { useParams, Link as RouterLink } from 'react-router-dom'

import Card from '@mui/material/Card'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import HeadphonesRoundedIcon from '@mui/icons-material/HeadphonesRounded'

import { paths } from 'src/paths'
import { chapterLabel } from 'src/features/catalog/utils'
import { NovelCover } from 'src/features/catalog/components/novel-cover'
import { ChapterList } from 'src/features/catalog/components/chapter-list'
import { useNovel, useChapters } from 'src/features/catalog/hooks/use-catalog'
import { useReadingProgress } from 'src/features/library/use-reading-progress'

export function NovelPage() {
  const novelSlug = useParams().novelSlug!
  const novel = useNovel(novelSlug)
  const chapters = useChapters(novel.data?.categoryId)
  const { progressByNovel } = useReadingProgress()

  if (novel.isError) return <Alert severity="error">{novel.error.message}</Alert>
  if (!novel.data) return <LinearProgress />

  const { title, cover, synopsis, chapterCount } = novel.data
  const progress = progressByNovel[novelSlug]
  const firstChapter = chapters.data?.[0]
  const resume = progress
    ? {
        slug: progress.chapterSlug,
        label: `Continuar: ${chapterLabel(progress.chapterTitle, title)}`,
      }
    : firstChapter && { slug: firstChapter.slug, label: 'Começar a ouvir' }

  return (
    <Stack spacing={4}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ sm: 'flex-start' }}>
        <NovelCover
          src={cover}
          title={title}
          width={180}
          sx={{ boxShadow: (theme) => theme.vars.customShadows.z16 }}
        />
        <Stack spacing={2} sx={{ minWidth: 0 }}>
          <Typography variant="h4">{title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {chapterCount} capítulos
          </Typography>
          {synopsis && <Typography sx={{ whiteSpace: 'pre-line' }}>{synopsis}</Typography>}
          {resume && (
            <Button
              component={RouterLink}
              to={paths.chapter(novelSlug, resume.slug)}
              variant="contained"
              size="large"
              startIcon={<HeadphonesRoundedIcon />}
              sx={{ alignSelf: 'flex-start' }}
            >
              {resume.label}
            </Button>
          )}
        </Stack>
      </Stack>

      <Card sx={{ p: 2 }}>
        {chapters.isLoading && <LinearProgress />}
        {chapters.isError && <Alert severity="error">{chapters.error.message}</Alert>}
        {chapters.data && (
          <ChapterList
            novelSlug={novelSlug}
            novelTitle={title}
            chapters={chapters.data}
            currentSlug={progress?.chapterSlug}
          />
        )}
      </Card>
    </Stack>
  )
}
