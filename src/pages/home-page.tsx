import { useState } from 'react'
import { useDebounce } from 'minimal-shared/hooks'

import List from '@mui/material/List'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'

import { paths } from 'src/paths'
import { chapterLabel } from 'src/features/catalog/utils'
import { useFavorites } from 'src/features/library/use-favorites'
import { NovelSection } from 'src/features/library/novel-section'
import { FavoriteButton } from 'src/features/library/favorite-button'
import { useNovelSearch } from 'src/features/catalog/hooks/use-catalog'
import { useReadingProgress } from 'src/features/library/use-reading-progress'
import { NovelListItem } from 'src/features/catalog/components/novel-list-item'

export function HomePage() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query.trim(), 400)
  const search = useNovelSearch(debouncedQuery)
  const { recent, progressByNovel } = useReadingProgress()
  const { favorites, isFavorite, toggle } = useFavorites()

  const isSearching = debouncedQuery.length >= 2
  const results = (search.data ?? []).toSorted(
    (a, b) => Number(isFavorite(b.slug)) - Number(isFavorite(a.slug)),
  )

  const lastChapter = (slug: string, title: string) => {
    const progress = progressByNovel[slug]
    return progress && chapterLabel(progress.chapterTitle, title)
  }

  const favoriteAction = (slug: string, title: string) => (
    <FavoriteButton active={isFavorite(slug)} onToggle={() => toggle({ slug, title })} />
  )

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h3">O que vamos ouvir hoje?</Typography>
        <Typography color="text.secondary">
          Busque uma obra do Central Novel e ouça os capítulos narrados, com vozes por personagem.
        </Typography>
      </Stack>

      <TextField
        fullWidth
        autoFocus
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Nome da obra, ex.: Mushoku Tensei"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon />
              </InputAdornment>
            ),
            endAdornment: search.isFetching && <CircularProgress size={20} />,
          },
        }}
      />

      {isSearching ? (
        <List disablePadding>
          {results.map((novel) => (
            <NovelListItem
              key={novel.id}
              slug={novel.slug}
              title={novel.title}
              to={paths.novel(novel.slug)}
              action={favoriteAction(novel.slug, novel.title)}
            />
          ))}
          {search.isSuccess && !results.length && (
            <Typography color="text.secondary">Nenhuma obra encontrada.</Typography>
          )}
          {search.isError && <Typography color="error">{search.error.message}</Typography>}
        </List>
      ) : (
        <>
          {!!favorites.length && (
            <NovelSection title="Favoritas">
              {favorites.map((favorite) => (
                <NovelListItem
                  key={favorite.slug}
                  slug={favorite.slug}
                  title={favorite.title}
                  to={paths.novel(favorite.slug)}
                  secondary={lastChapter(favorite.slug, favorite.title)}
                  action={favoriteAction(favorite.slug, favorite.title)}
                />
              ))}
            </NovelSection>
          )}

          {!!recent.length && (
            <NovelSection title="Continuar ouvindo">
              {recent.map((item) => (
                <NovelListItem
                  key={item.novelSlug}
                  slug={item.novelSlug}
                  title={item.novelTitle}
                  to={paths.chapter(item.novelSlug, item.chapterSlug)}
                  secondary={chapterLabel(item.chapterTitle, item.novelTitle)}
                  action={favoriteAction(item.novelSlug, item.novelTitle)}
                />
              ))}
            </NovelSection>
          )}
        </>
      )}
    </Stack>
  )
}
