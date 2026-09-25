import type { Script } from '../script'
import type { VoiceContext, VoiceOverrides } from '../voices'

import Stack from '@mui/material/Stack'
import Dialog from '@mui/material/Dialog'
import Slider from '@mui/material/Slider'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'

import { characterVoice } from '../voices'
import { VoiceSelect } from './voice-select'

type CharacterVoicesDialogProps = {
  open: boolean
  script: Script
  context: VoiceContext
  onChange: (overrides: VoiceOverrides) => void
  onPreview: (speaker: string) => void
  onClose: () => void
}

const GENDER_LABEL = { male: 'masculino', female: 'feminino' }

function speakersOf(script: Script) {
  const counts = new Map<string, number>()
  script.lines.flat().forEach(({ speaker }) => counts.set(speaker, (counts.get(speaker) ?? 0) + 1))
  return [...counts].toSorted((a, b) => b[1] - a[1]).map(([speaker, count]) => ({ speaker, count }))
}

export function CharacterVoicesDialog({
  open,
  script,
  context,
  onChange,
  onPreview,
  onClose,
}: CharacterVoicesDialogProps) {
  const { overrides } = context

  const update = (speaker: string, patch: Partial<VoiceOverrides[string]>) => {
    const current = characterVoice(speaker, script.genders.get(speaker), context)
    onChange({
      ...overrides,
      [speaker]: { voiceURI: current.voice?.voiceURI, pitch: current.pitch, ...patch },
    })
  }

  const reset = (speaker: string) => {
    onChange(Object.fromEntries(Object.entries(overrides).filter(([name]) => name !== speaker)))
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Vozes dos personagens</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Cada personagem mantém a mesma voz em todos os capítulos desta obra. Ajuste aqui se alguma
          não combinar.
        </Typography>
        <Stack divider={<Divider />} spacing={2}>
          {speakersOf(script).map(({ speaker, count }) => {
            const gender = script.genders.get(speaker)
            const resolved = characterVoice(speaker, gender, context)
            const isCustom = !!overrides[speaker]

            return (
              <Stack key={speaker} spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                    {speaker}
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      {count} {count === 1 ? 'trecho' : 'trechos'}
                      {gender && ` · ${GENDER_LABEL[gender]}`}
                    </Typography>
                  </Typography>
                  <Tooltip title="Ouvir">
                    <IconButton size="small" onClick={() => onPreview(speaker)}>
                      <PlayArrowRoundedIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  alignItems={{ sm: 'center' }}
                >
                  <VoiceSelect
                    label="Voz"
                    value={isCustom ? (resolved.voice?.voiceURI ?? '') : ''}
                    voices={context.voices}
                    emptyLabel={`Automática (${resolved.voice?.name ?? 'padrão'})`}
                    onChange={(voiceURI) =>
                      voiceURI ? update(speaker, { voiceURI }) : reset(speaker)
                    }
                  />
                  <Stack sx={{ minWidth: 180 }}>
                    <Typography variant="caption" color="text.secondary">
                      Tom {resolved.pitch.toFixed(2)}
                    </Typography>
                    <Slider
                      size="small"
                      value={resolved.pitch}
                      min={0.5}
                      max={1.8}
                      step={0.05}
                      onChange={(_, pitch) => update(speaker, { pitch: pitch as number })}
                    />
                  </Stack>
                </Stack>
              </Stack>
            )
          })}
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
