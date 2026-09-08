import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useScore } from '../../core/state/ScoreContext'
import { useSound } from '../../core/sound/SoundContext'

export type GameApi = {
  localScore: number
  add: (delta: number, soundEvent?: string) => void
  play: (eventName: string) => void
}

export type GameShellProps = {
  gameId: string
  onScoreUpdate: (best: number) => void
  children: (api: GameApi) => ReactNode
}

export function GameShell({ gameId, onScoreUpdate, children }: GameShellProps) {
  const { addToGlobal, updateRecord } = useScore()
  const { play: playSound } = useSound()
  const [localScore, setLocalScore] = useState(0)

  const add = useCallback(
    (delta: number, soundEvent?: string) => {
      if (!Number.isFinite(delta) || delta === 0) return
      setLocalScore((s) => {
        const next = Math.max(0, s + delta)
        updateRecord(gameId, next)
        onScoreUpdate(next)
        return next
      })
      addToGlobal(delta)
      if (soundEvent) playSound(soundEvent)
    },
    [addToGlobal, gameId, onScoreUpdate, playSound, updateRecord],
  )

  const api = useMemo<GameApi>(
    () => ({
      localScore,
      add,
      play: playSound,
    }),
    [localScore, add, playSound],
  )

  return <>{children(api)}</>
}