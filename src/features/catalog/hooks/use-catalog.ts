import { useQuery, keepPreviousData } from '@tanstack/react-query'

import { getNovel, getChapter, getChapters, searchNovels } from '../api'

export const catalogKeys = {
  search: (query: string) => ['catalog', 'search', query] as const,
  novel: (slug: string) => ['catalog', 'novel', slug] as const,
  chapters: (categoryId: number) => ['catalog', 'chapters', categoryId] as const,
  chapter: (slug: string) => ['catalog', 'chapter', slug] as const,
}

const HOUR = 60 * 60 * 1000

export function useNovelSearch(query: string) {
  return useQuery({
    queryKey: catalogKeys.search(query),
    queryFn: () => searchNovels(query),
    enabled: query.length >= 2,
    placeholderData: keepPreviousData,
  })
}

export function useNovel(slug: string) {
  return useQuery({
    queryKey: catalogKeys.novel(slug),
    queryFn: () => getNovel(slug),
    staleTime: HOUR,
  })
}

export function useChapters(categoryId?: number) {
  return useQuery({
    queryKey: catalogKeys.chapters(categoryId ?? 0),
    queryFn: () => getChapters(categoryId!),
    enabled: !!categoryId,
    staleTime: HOUR,
  })
}

export function useChapter(slug: string) {
  return useQuery({
    queryKey: catalogKeys.chapter(slug),
    queryFn: () => getChapter(slug),
    staleTime: Infinity,
  })
}
