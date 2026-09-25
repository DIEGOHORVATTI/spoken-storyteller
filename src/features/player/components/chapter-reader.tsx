import type { ReaderSettings } from '../hooks/use-reader-settings'
import type { Novel, Chapter, ChapterSummary } from 'src/features/catalog/api'

import { useNavigate } from 'react-router-dom'
import { useBoolean } from 'minimal-shared/hooks'

import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'

import { paths } from 'src/paths'
import { useReadingProgress } from 'src/features/library/use-reading-progress'

import { PlayerBar } from './player-bar'
import { characterVoice } from '../voices'
import { ChapterText } from './chapter-text'
import { previewVoice } from '../speech-player'
import { useChapterPlayer } from '../hooks/use-chapter-player'
import { ReaderSettingsDialog } from './reader-settings-dialog'
import { CharacterVoicesDialog } from './character-voices-dialog'
import { useCharacterVoices } from '../hooks/use-reader-settings'

type ChapterReaderProps = {
  novel: Novel
  chapter: Chapter
  chapters: ChapterSummary[]
  settings: ReaderSettings
  startParagraph: number
  autoplay: boolean
  onChangeSettings: (patch: Partial<ReaderSettings>) => void
}

const RATES = [0.8, 1, 1.2, 1.5, 1.75, 2]

export function ChapterReader({
  novel,
  chapter,
  chapters,
  settings,
  startParagraph,
  autoplay,
  onChangeSettings,
}: ChapterReaderProps) {
  const navigate = useNavigate()
  const voicesDialog = useBoolean()
  const settingsDialog = useBoolean()
  const { save } = useReadingProgress()
  const { overrides, setOverrides } = useCharacterVoices(novel.slug)

  const index = chapters.findIndex((item) => item.slug === chapter.slug)
  const previous = index > 0 ? chapters[index - 1] : undefined
  const next = index >= 0 ? chapters[index + 1] : undefined

  const goTo = (target: ChapterSummary, keepPlaying: boolean) =>
    navigate(paths.chapter(novel.slug, target.slug), { state: { autoplay: keepPlaying } })

  const { player, state, script, voiceContext } = useChapterPlayer({
    paragraphs: chapter.paragraphs,
    settings,
    overrides,
    startParagraph,
    autoplay,
    onParagraphChange: (paragraph) =>
      save({
        novelSlug: novel.slug,
        novelTitle: novel.title,
        chapterSlug: chapter.slug,
        chapterTitle: chapter.title,
        paragraph,
      }),
    onFinished: () => settings.autoAdvance && next && goTo(next, true),
  })

  const isPlaying = state.status === 'playing'

  const cycleRate = () => {
    const nextRate = RATES.find((rate) => rate > settings.rate + 0.01) ?? RATES[0]
    onChangeSettings({ rate: nextRate })
  }

  const preview = (speaker: string) => {
    player.pause()
    const { voice, pitch } = characterVoice(speaker, script.genders.get(speaker), voiceContext)
    previewVoice(voice, pitch, settings.rate)
  }

  return (
    <Box sx={{ pb: 16 }}>
      {state.error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {state.error}
        </Alert>
      )}

      <ChapterText
        paragraphs={chapter.paragraphs}
        lines={script.lines}
        activeParagraph={state.paragraph}
        followPlayback={isPlaying}
        fontSize={settings.fontSize}
        onSelectParagraph={(paragraph) => player.play(paragraph)}
      />

      <PlayerBar
        state={state}
        totalParagraphs={chapter.paragraphs.length}
        rate={settings.rate}
        onCycleRate={cycleRate}
        hasPrevious={!!previous}
        hasNext={!!next}
        onToggle={() => player.toggle()}
        onSkip={(offset) => player.skip(offset)}
        onSeek={(paragraph) => player.seek(paragraph)}
        onPreviousChapter={() => previous && goTo(previous, isPlaying)}
        onNextChapter={() => next && goTo(next, isPlaying)}
        onOpenVoices={voicesDialog.onTrue}
        onOpenSettings={settingsDialog.onTrue}
      />

      <CharacterVoicesDialog
        open={voicesDialog.value}
        script={script}
        context={voiceContext}
        onChange={setOverrides}
        onPreview={preview}
        onClose={voicesDialog.onFalse}
      />

      <ReaderSettingsDialog
        open={settingsDialog.value}
        settings={settings}
        voices={voiceContext.voices}
        onChange={onChangeSettings}
        onClose={settingsDialog.onFalse}
      />
    </Box>
  )
}
