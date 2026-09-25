import { useStoredState } from 'src/lib/use-stored-state'

export type ReadingProgress = {
  novelSlug: string
  novelTitle: string
  chapterSlug: string
  chapterTitle: string
  paragraph: number
  updatedAt: number
}

export function useReadingProgress() {
  const { state, setState } = useStoredState<Record<string, ReadingProgress>>(
    'reading-progress',
    {},
  )

  const recent = Object.values(state).toSorted((a, b) => b.updatedAt - a.updatedAt)

  const save = (progress: Omit<ReadingProgress, 'updatedAt'>) =>
    setState({ [progress.novelSlug]: { ...progress, updatedAt: Date.now() } })

  return { progressByNovel: state, recent, save }
}
