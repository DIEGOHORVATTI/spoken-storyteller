import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'

type VoiceSelectProps = {
  label: string
  value: string
  voices: SpeechSynthesisVoice[]
  emptyLabel?: string
  onChange: (voiceURI: string) => void
}

export function VoiceSelect({ label, value, voices, emptyLabel, onChange }: VoiceSelectProps) {
  return (
    <TextField
      select
      fullWidth
      size="small"
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {emptyLabel && <MenuItem value="">{emptyLabel}</MenuItem>}
      {voices.map((voice) => (
        <MenuItem key={voice.voiceURI} value={voice.voiceURI}>
          {voice.name} ({voice.lang})
        </MenuItem>
      ))}
    </TextField>
  )
}
