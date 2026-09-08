import { createContext, useContext, useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'
import { useScoreStore } from './useScoreStore'
import type { RecordEntry, ToastState } from './useScoreStore'
import { useSound } from '../sound/SoundContext'

export type ScoreContextValue = {
  globalScore: number
  records: Record<string, RecordEntry>
  toast: ToastState
  addToGlobal: (delta: number) => void
  updateRecord: (gameId: string, best: number) => void
  getBest: (gameId: string) => number
}

const ScoreContext = createContext<ScoreContextValue | null>(null)

export function ScoreProvider({ children }: { children: ReactNode }) {
  const store = useScoreStore()
  const { play: playSound } = useSound()

  useEffect(() => {
    if (store.toast.show && store.toast.text) {
      playSound('record')
    }
  }, [store.toast, playSound])

  const value = useMemo<ScoreContextValue>(
    () => ({
      globalScore: store.global,
      records: store.records,
      toast: store.toast,
      addToGlobal: store.addToGlobal,
      updateRecord: store.updateRecord,
      getBest: store.getBest,
    }),
    [store],
  )
  return <ScoreContext.Provider value={value}>{children}</ScoreContext.Provider>
}

export function useScore(): ScoreContextValue {
  const ctx = useContext(ScoreContext)
  if (!ctx) throw new Error('ScoreProvider is missing')
  return ctx
}