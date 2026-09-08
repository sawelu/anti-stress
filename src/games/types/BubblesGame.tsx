import { useEffect, useRef, useState } from 'react'
import { GameShell } from './GameShell'

type Bubble = {
  id: number
  x: number
  y: number
  size: number
  hue: number
  alive: boolean
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function SoapBubble({ size, hue, burst }: { size: number; hue: number; burst: boolean }) {
  const id = `bub-${hue % 100}`.replace('.', '')
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={burst ? 'bubble-rip' : 'bubble-wobble'}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <radialGradient id={`${id}-body`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
          <stop offset="28%" stopColor={`hsla(${hue}, 60%, 85%, 0.55)`} />
          <stop offset="62%" stopColor={`hsla(${hue}, 55%, 70%, 0.28)`} />
          <stop offset="88%" stopColor={`hsla(${(hue + 60) % 360}, 50%, 78%, 0.5)`} />
          <stop offset="100%" stopColor={`hsla(${hue}, 45%, 65%, 0.1)`} />
        </radialGradient>
        <radialGradient id={`${id}-sheen`} cx="50%" cy="42%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0) " />
          <stop offset="60%" stopColor={`hsla(${(hue + 90) % 360}, 70%, 80%, 0.35)`} />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="47" fill={`url(#${id}-body)`} stroke="rgba(255,255,255,0.65)" strokeWidth="1.5" />
      <ellipse cx="50" cy="43" rx="44" ry="40" fill={`url(#${id}-sheen)`} opacity="0.65" />
      <ellipse cx="34" cy="27" rx="12" ry="8" fill="rgba(255,255,255,0.95)" transform="rotate(-26 34 27)" />
      <ellipse cx="67" cy="68" rx="5" ry="3.4" fill="rgba(255,255,255,0.55)" transform="rotate(20 67 68)" />
    </svg>
  )
}

export default function BubblesGame({ gameId, onScoreUpdate }: { gameId: string; onScoreUpdate: (best: number) => void }) {
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const idRef = useRef(0)

  const spawn = (count: number) => {
    const next: Bubble[] = Array.from({ length: count }, () => ({
      id: ++idRef.current,
      x: rand(8, 88),
      y: rand(10, 80),
      size: rand(46, 96),
      hue: rand(190, 330),
      alive: true,
    }))
    setBubbles((prev) => [...prev, ...next].slice(-14))
  }

  useEffect(() => {
    spawn(6)
    const t = window.setInterval(() => spawn(1), 900)
    return () => window.clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="game-wrap" style={{ background: 'linear-gradient(160deg, #bfdbfe, #c7d2fe 40%, #ddd6fe 70%, #f5d0fe)' }}>
      <GameShell gameId={gameId} onScoreUpdate={onScoreUpdate}>
        {(api) => (
          <>
            <div className="game-hint">Лопай пузырьки 🫧</div>
            <div className="game-stage" style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'radial-gradient(circle at 25% 18%, rgba(255,255,255,0.85), transparent 42%), radial-gradient(circle at 80% 75%, rgba(255,255,255,0.5), transparent 40%)',
                  pointerEvents: 'none',
                }}
              />
              {bubbles.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setBubbles((prev) => prev.map((x) => (x.id === b.id ? { ...x, alive: false } : x)))
                    api.add(1, 'bubble')
                  }}
                  style={{
                    position: 'absolute',
                    left: `${b.x}%`,
                    top: `${b.y}%`,
                    width: b.size,
                    height: b.size,
                    transform: 'translate(-50%, -50%)',
                    opacity: b.alive ? 1 : 0,
                    transition: 'opacity 0.35s ease',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    animation: `bubbleFloat ${rand(3, 5)}s ease-in-out infinite`,
                    filter: b.alive ? 'drop-shadow(0 6px 14px rgba(120,160,220,0.35))' : 'none',
                  }}
                >
                  <SoapBubble size={b.size} hue={b.hue} burst={!b.alive} />
                </button>
              ))}
            </div>
          </>
        )}
      </GameShell>
    </div>
  )
}