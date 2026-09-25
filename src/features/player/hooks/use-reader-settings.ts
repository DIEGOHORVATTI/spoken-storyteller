import type { VoiceOverrides } from '../voices'

import { useStoredState } from 'src/lib/use-stored-state'

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
  return useStoredState<ReaderSettings>('reader-settings', DEFAULT_SETTINGS)
}

export function useCharacterVoices(novelSlug: string) {
  const { state, setState } = useStoredState<Record<string, VoiceOverrides>>('character-voices', {})
  const overrides = state[novelSlug] ?? NO_OVERRIDES

  const setOverrides = (next: VoiceOverrides) => setState({ [novelSlug]: next })

  return { overrides, setOverrides }
}
