import { useCallback, useEffect, useRef } from 'react'

const BASE = import.meta.env.BASE_URL

const SOUND_SRC: Record<string, string> = {
  tap: `${BASE}sounds/tap.wav`,
  tick: `${BASE}sounds/tick.wav`,
  pop: `${BASE}sounds/pop.wav`,
  bubble: `${BASE}sounds/bubble.wav`,
  meow: `${BASE}sounds/meow.wav`,
  sparkle: `${BASE}sounds/sparkle.wav`,
  ghost: `${BASE}sounds/ghost.wav`,
  musicbox: `${BASE}sounds/musicbox.wav`,
  breath: `${BASE}sounds/breath.wav`,
  sand: `${BASE}sounds/sand.wav`,
  wind: `${BASE}sounds/wind.wav`,
  ribbon: `${BASE}sounds/ribbon.wav`,
  paper: `${BASE}sounds/paper.wav`,
  piano: `${BASE}sounds/piano.wav`,
  cloud: `${BASE}sounds/cloud.wav`,
  swirl: `${BASE}sounds/swirl.wav`,
  success: `${BASE}sounds/success.wav`,
  record: `${BASE}sounds/record.wav`,
}

export function useSoundEngine() {
  const ctxRef = useRef<AudioContext | null>(null)
  const masterRef = useRef<GainNode | null>(null)
  const buffersRef = useRef<Map<string, AudioBuffer>>(new Map())
  const loadingRef = useRef<Set<string>>(new Set())

  const ensureContext = useCallback((): AudioContext | null => {
    if (ctxRef.current) return ctxRef.current
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return null
    const ctx = new Ctx()
    const master = ctx.createGain()
    master.gain.value = 0.55
    master.connect(ctx.destination)
    ctxRef.current = ctx
    masterRef.current = master
    return ctx
  }, [])

  const load = useCallback(
    (name: string) => {
      const ctx = ensureContext()
      const src = SOUND_SRC[name]
      if (!ctx || !src || buffersRef.current.has(name) || loadingRef.current.has(name)) return
      loadingRef.current.add(name)
      void fetch(src)
        .then((res) => {
          if (!res.ok) throw new Error(res.statusText)
          return res.arrayBuffer()
        })
        .then((buf) => ctx.decodeAudioData(buf))
        .then((audioBuf) => {
          buffersRef.current.set(name, audioBuf)
          loadingRef.current.delete(name)
        })
        .catch(() => loadingRef.current.delete(name))
    },
    [ensureContext],
  )

  const unlock = useCallback(() => {
    const ctx = ensureContext()
    if (!ctx) return
    if (ctx.state === 'suspended') void ctx.resume().catch(() => {})
    for (const name of Object.keys(SOUND_SRC)) load(name)
  }, [ensureContext, load])

  useEffect(() => {
    const onGesture = () => unlock()
    window.addEventListener('pointerdown', onGesture)
    window.addEventListener('touchstart', onGesture)
    return () => {
      window.removeEventListener('pointerdown', onGesture)
      window.removeEventListener('touchstart', onGesture)
    }
  }, [unlock])

  const play = useCallback(
    (eventName: string) => {
      const ctx = ctxRef.current
      const master = masterRef.current
      const buffer = buffersRef.current.get(eventName)
      if (!ctx || !master || !buffer) {
        if (!ctx) ensureContext()
        load(eventName)
        return
      }
      const now = ctx.currentTime
      const source = ctx.createBufferSource()
      source.buffer = buffer
      const gain = ctx.createGain()
      gain.gain.value = 1
      source.connect(gain)
      gain.connect(master)
      source.start(now)
    },
    [ensureContext, load],
  )

  return { play, load, unlock }
}