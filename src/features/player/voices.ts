import type { Gender, Script } from './script'

import { NARRATOR } from './script'

export type VoiceChoice = {
  voiceURI?: string
  pitch: number
}

export type VoiceOverrides = Record<string, VoiceChoice>

export type VoiceContext = {
  voices: SpeechSynthesisVoice[]
  narratorVoiceURI?: string
  overrides: VoiceOverrides
  characterVoices: boolean
}

export type ResolvedVoice = {
  voice?: SpeechSynthesisVoice
  pitch: number
}

export type Utterance = ResolvedVoice & {
  paragraph: number
  text: string
}

const FEMALE_VOICE =
  /female|mulher|maria|francisca|luciana|heloisa|leticia|thalita|brenda|elza|giovanna|leila|manuela|yara|camila|vitoria|raquel|google português/i
const MALE_VOICE =
  /\bmale|homem|daniel|antonio|donato|fabio|humberto|julio|nicolau|valerio|ricardo|duarte/i
const BASE_PITCH: Record<Gender, number> = { female: 1.2, male: 0.8 }
const MAX_CHUNK = 200

export function estimateGender(voice: SpeechSynthesisVoice): Gender | undefined {
  if (FEMALE_VOICE.test(voice.name)) return 'female'
  if (MALE_VOICE.test(voice.name)) return 'male'
  return undefined
}

export function isPortuguese(voice: SpeechSynthesisVoice) {
  return voice.lang.toLowerCase().startsWith('pt')
}

export function defaultNarratorVoice(voices: SpeechSynthesisVoice[]) {
  return (
    voices.find((voice) => voice.lang.toLowerCase() === 'pt-br') ??
    voices.find(isPortuguese) ??
    voices[0]
  )
}

function hash(text: string) {
  let value = 0
  for (const char of text) value = (value * 31 + char.charCodeAt(0)) % 2 ** 32
  return value
}

export function characterVoice(
  speaker: string,
  gender: Gender | undefined,
  context: VoiceContext,
): ResolvedVoice {
  const byUri = (uri?: string) => context.voices.find((voice) => voice.voiceURI === uri)
  const narrator = byUri(context.narratorVoiceURI) ?? defaultNarratorVoice(context.voices)
  const override = context.overrides[speaker]

  if (override) return { voice: byUri(override.voiceURI) ?? narrator, pitch: override.pitch }
  if (speaker === NARRATOR || !context.characterVoices) return { voice: narrator, pitch: 1 }

  const portuguese = context.voices.filter(isPortuguese)
  const sameGender = portuguese.filter((voice) => gender && estimateGender(voice) === gender)
  const pool = sameGender.length ? sameGender : portuguese.length ? portuguese : context.voices
  const seed = hash(speaker)
  const pitchOffset = (Math.floor(seed / 16) % 5) * 0.06 - 0.12

  return {
    voice: pool.length ? pool[seed % pool.length] : narrator,
    pitch: Number(((gender ? BASE_PITCH[gender] : 1) + pitchOffset).toFixed(2)),
  }
}

export function splitIntoChunks(text: string, maxLength = MAX_CHUNK) {
  const sentences = text.match(/[^.!?…]+(?:[.!?…]+["'”»)]*\s*|$)/g) ?? [text]

  return sentences
    .reduce<string[]>((chunks, sentence) => {
      const last = chunks.at(-1)
      if (last && last.length + sentence.length <= maxLength)
        chunks[chunks.length - 1] = last + sentence
      else chunks.push(sentence)
      return chunks
    }, [])
    .map((chunk) => chunk.trim())
    .filter(Boolean)
}

export function buildQueue(script: Script, context: VoiceContext): Utterance[] {
  const cache = new Map<string, ResolvedVoice>()
  const resolve = (speaker: string) => {
    if (!cache.has(speaker)) {
      cache.set(speaker, characterVoice(speaker, script.genders.get(speaker), context))
    }
    return cache.get(speaker)!
  }

  return script.lines.flatMap((segments, paragraph) =>
    segments.flatMap((segment) =>
      splitIntoChunks(segment.text).map((text) => ({
        paragraph,
        text,
        ...resolve(segment.speaker),
      })),
    ),
  )
}
