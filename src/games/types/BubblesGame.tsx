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

export default function BubblesGame({ gameId, onScoreUpdate }: { gameId: string; onScoreUpdate: (best: number) => void }) {
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const idRef = useRef(0)

  const spawn = (count: number) => {
    const next: Bubble[] = Array.from({ length: count }, () => ({
      id: ++idRef.current,
      x: rand(8, 88),
      y: rand(10, 80),
      size: rand(34, 80),
      hue: rand(190, 320),
      alive: true,
    }))
    setBubbles((prev) => [...prev, ...next].slice(-14))
  }

  useEffect(() => {
    spawn(6)
    const t = window.setInterval(() => spawn(1), 900)
    return () => window.clearInterval(t)
  }, [])

  return (
    <div className="game-wrap" style={{ background: 'linear-gradient(160deg, #dbeafe, #e0e7ff 45%, #f5d0fe)' }}>
      <GameShell gameId={gameId} onScoreUpdate={onScoreUpdate}>
        {(api) => (
          <>
            <div className="game-hint">Лопай пузырьки 🫧</div>
            <div className="game-stage" style={{ position: 'relative' }}>
              <div className="bubbles-sheen" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.6), transparent 50%)', pointerEvents: 'none' }} />
              {bubbles.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setBubbles((prev) => prev.map((x) => (x.id === b.id ? { ...x, alive: false } : x)))
                    api.add(1, 'bubble')
                  }}
                  className="bubble"
                  style={{
                    position: 'absolute',
                    left: `${b.x}%`,
                    top: `${b.y}%`,
                    width: b.size,
                    height: b.size,
                    opacity: b.alive ? 1 : 0,
                    background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.9), hsla(${b.hue}, 75%, 75%, 0.55) 35%, hsla(${b.hue}, 60%, 60%, 0.18) 75%)`,
                    boxShadow: `0 10px 30px hsla(${b.hue}, 60%, 55%, 0.35), inset 0 -6px 16px hsla(${b.hue}, 45%, 45%, 0.25), inset 0 6px 10px rgba(255,255,255,0.7)`,
                  }}
                />
              ))}
            </div>
          </>
        )}
      </GameShell>
    </div>
  )
}