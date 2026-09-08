import { useCallback, useMemo } from 'react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { SoundContext } from './SoundContext'
import { useSoundEngine } from './useSoundEngine'
import { getStoredBoolean, setStoredBoolean } from '../storage/storage'

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState<boolean>(() => getStoredBoolean('as:sound', false))
  const { play: enginePlay } = useSoundEngine()

  const toggle = useCallback(() => {
    setEnabled((v) => {
      const next = !v
      setStoredBoolean('as:sound', next)
      return next
    })
  }, [])

  const play = useCallback(
    (eventName: string) => {
      if (enabled) enginePlay(eventName)
    },
    [enabled, enginePlay],
  )

  const value = useMemo(() => ({ enabled, toggle, play }), [enabled, toggle, play])

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}