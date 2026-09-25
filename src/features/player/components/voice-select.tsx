import type { SelectOption } from 'src/components/select-autocomplete'

import { SelectAutocomplete } from 'src/components/select-autocomplete'

import { isPortuguese } from '../voices'

type VoiceSelectProps = {
  label: string
  value: string
  voices: SpeechSynthesisVoice[]
  emptyLabel?: string
  onChange: (voiceURI: string) => void
}

export function VoiceSelect({ label, value, voices, emptyLabel, onChange }: VoiceSelectProps) {
  const options: SelectOption<string>[] = [
    ...(emptyLabel ? [{ value: '', label: emptyLabel }] : []),
    ...voices.map((voice) => ({
      value: voice.voiceURI,
      label: `${voice.name} (${voice.lang})`,
      group: isPortuguese(voice) ? 'Português' : 'Outros idiomas',
    })),
  ]

  return (
    <SelectAutocomplete
      label={label}
      value={value}
      options={options}
      onChange={onChange}
      sx={{ flex: 1, minWidth: 0 }}
    />
  )
}
