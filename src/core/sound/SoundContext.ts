import { createContext, useContext } from 'react'

export type SoundContextValue = {
  enabled: boolean
  toggle: () => void
  play: (eventName: string) => void
}

export const SoundContext = createContext<SoundContextValue | null>(null)

export function useSound(): SoundContextValue {
  const ctx = useContext(SoundContext)
  if (!ctx) throw new Error('SoundProvider is missing')
  return ctx
}