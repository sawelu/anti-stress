import { useEffect, useRef, useState } from 'react'
import { getStoredJSON, setStoredJSON } from '../storage/storage'

export type RecordEntry = { best: number; updatedAt: number }

const RECORDS_KEY = 'as:records'
const GLOBAL_KEY = 'as:global'

const MILESTONE_THRESHOLDS = [50, 100, 200, 300, 400, 500, 750, 1000]

export type ToastState = {
  text: string | null
  show: boolean
  key: number
}

const WORDS: Record<number, string> = {
  50: 'Супер!',
  100: 'Лучший!',
  200: 'Мега!',
  300: 'Мега+!',
  400: 'Невероятно!',
  500: 'Гений!',
  750: 'Легенда!',
  1000: 'Мастер!',
}

function milestoneWord(score: number): string {
  let word = 'Супер!'
  for (const t of MILESTONE_THRESHOLDS) {
    if (score >= t) word = WORDS[t] ?? 'Мега!'
  }
  return word
}

export function useScoreStore() {
  const [global, setGlobal] = useState<number>(() => getStoredJSON<number>(GLOBAL_KEY, 0))
  const [records, setRecords] = useState<Record<string, RecordEntry>>(() => getStoredJSON<Record<string, RecordEntry>>(RECORDS_KEY, {}))
  const [toast, setToast] = useState<ToastState>({ text: null, show: false, key: 0 })
  const lastCountRef = useRef<number>(global)
  const timerRef = useRef<number | null>(null)

  const showToast = (text: string) => {
    if (timerRef.current) window.clearTimeout(timerRef.current)
    setToast({ text, show: true, key: Date.now() })
    timerRef.current = window.setTimeout(() => setToast((t) => ({ ...t, show: false })), 1300)
  }

  useEffect(() => {
    const last = lastCountRef.current
    if (global < last) {
      lastCountRef.current = global
      return
    }
    for (const t of MILESTONE_THRESHOLDS) {
      if (last < t && global >= t) {
        showToast(milestoneWord(global))
        break
      }
    }
    lastCountRef.current = global
  }, [global])

  useEffect(() => {
    setStoredJSON(GLOBAL_KEY, global)
  }, [global])

  useEffect(() => {
    setStoredJSON(RECORDS_KEY, records)
  }, [records])

  const addToGlobal = (delta: number) => {
    if (!Number.isFinite(delta) || delta === 0) return
    setGlobal((g) => g + delta)
  }

  const updateRecord = (gameId: string, best: number) => {
    setRecords((prev) => {
      const current = prev[gameId]
      if (current && current.best >= best) return prev
      return { ...prev, [gameId]: { best, updatedAt: Date.now() } }
    })
  }

  const getBest = (gameId: string): number => records[gameId]?.best ?? 0

  return { global, records, toast, addToGlobal, updateRecord, getBest }
}