import type { ReaderSettings } from '../hooks/use-reader-settings'

import Stack from '@mui/material/Stack'
import Dialog from '@mui/material/Dialog'
import Slider from '@mui/material/Slider'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import FormControlLabel from '@mui/material/FormControlLabel'

import { VoiceSelect } from './voice-select'
import { defaultNarratorVoice } from '../voices'

type ReaderSettingsDialogProps = {
  open: boolean
  settings: ReaderSettings
  voices: SpeechSynthesisVoice[]
  onChange: (patch: Partial<ReaderSettings>) => void
  onClose: () => void
}

export function ReaderSettingsDialog({
  open,
  settings,
  voices,
  onChange,
  onClose,
}: ReaderSettingsDialogProps) {
  const narratorVoiceURI = settings.narratorVoiceURI ?? defaultNarratorVoice(voices)?.voiceURI ?? ''

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Configurações</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ pt: 1 }}>
          <VoiceSelect
            label="Voz do narrador"
            value={narratorVoiceURI}
            voices={voices}
            onChange={(voiceURI) => onChange({ narratorVoiceURI: voiceURI })}
          />

          <div>
            <Typography variant="subtitle2">Velocidade: {settings.rate.toFixed(2)}x</Typography>
            <Slider
              value={settings.rate}
              min={0.5}
              max={2.5}
              step={0.05}
              onChange={(_, rate) => onChange({ rate: rate as number })}
            />
          </div>

          <div>
            <Typography variant="subtitle2">Tamanho do texto: {settings.fontSize}px</Typography>
            <Slider
              value={settings.fontSize}
              min={14}
              max={28}
              onChange={(_, fontSize) => onChange({ fontSize: fontSize as number })}
            />
          </div>

          <FormControlLabel
            control={
              <Switch
                checked={settings.characterVoices}
                onChange={(event) => onChange({ characterVoices: event.target.checked })}
              />
            }
            label="Vozes diferentes por personagem"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.autoAdvance}
                onChange={(event) => onChange({ autoAdvance: event.target.checked })}
              />
            }
            label="Tocar o próximo capítulo automaticamente"
          />
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
