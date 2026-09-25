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
import { useNovelSearch } from 'src/features/catalog/hooks/use-catalog'
import { ContinueReading } from 'src/features/library/continue-reading'
import { useReadingProgress } from 'src/features/library/use-reading-progress'
import { NovelListItem } from 'src/features/catalog/components/novel-list-item'

export function HomePage() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query.trim(), 400)
  const search = useNovelSearch(debouncedQuery)
  const { recent } = useReadingProgress()

  const isSearching = debouncedQuery.length >= 2
  const results = search.data ?? []

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
            />
          ))}
          {search.isSuccess && !results.length && (
            <Typography color="text.secondary">Nenhuma obra encontrada.</Typography>
          )}
          {search.isError && <Typography color="error">{search.error.message}</Typography>}
        </List>
      ) : (
        <ContinueReading items={recent} />
      )}
    </Stack>
  )
}
