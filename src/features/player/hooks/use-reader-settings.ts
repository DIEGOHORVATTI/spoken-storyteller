import type { VoiceOverrides } from '../voices'

import { useLocalStorage } from 'minimal-shared/hooks'

export type ReaderSettings = {
  rate: number
  fontSize: number
  narratorVoiceURI?: string
  characterVoices: boolean
  autoAdvance: boolean
}

const DEFAULT_SETTINGS: ReaderSettings = {
  rate: 1,
  fontSize: 18,
  characterVoices: true,
  autoAdvance: true,
}

const NO_OVERRIDES: VoiceOverrides = {}

export function useReaderSettings() {
  return useLocalStorage<ReaderSettings>('reader-settings', DEFAULT_SETTINGS)
}

export function useCharacterVoices(novelSlug: string) {
  const { state, setState } = useLocalStorage<Record<string, VoiceOverrides>>(
    'character-voices',
    {},
  )
  const overrides = state[novelSlug] ?? NO_OVERRIDES

  const setOverrides = (next: VoiceOverrides) => setState({ [novelSlug]: next })

  return { overrides, setOverrides }
}
