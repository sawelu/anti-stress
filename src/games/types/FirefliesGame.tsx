import { useEffect, useState } from 'react'
import type { PointerEvent } from 'react'
import { GameShell } from './GameShell'
import type { GameApi } from './GameShell'

type Firefly = { id: number; x: number; y: number; vx: number; vy: number; lit: boolean }

export default function FirefliesGame({ gameId, onScoreUpdate }: { gameId: string; onScoreUpdate: (best: number) => void }) {
  const [flies, setFlies] = useState<Firefly[]>(() =>
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * 75 + 12,
      y: Math.random() * 65 + 15,
      vx: (Math.random() - 0.5) * 1.4,
      vy: (Math.random() - 0.5) * 1.4,
      lit: Math.random() > 0.5,
    })),
  )

  useEffect(() => {
    const t = window.setInterval(() => {
      setFlies((prev) =>
        prev.map((f) => {
          let nx = f.x + f.vx
          let ny = f.y + f.vy
          if (nx < 5 || nx > 95) nx = 5
          if (ny < 5 || ny > 90) ny = 5
          return { ...f, x: nx, y: ny, lit: f.lit }
        }),
      )
    }, 50)
    return () => window.clearInterval(t)
  }, [])

  const catchFly = (id: number, api: GameApi) => {
    setFlies((prev) => prev.map((f) => (f.id === id ? { ...f, lit: true } : f)))
    api.add(2, 'sparkle')
  }

  return (
    <div className="game-wrap" style={{ background: 'linear-gradient(180deg, #0f172a, #1e1b4b 60%, #172554)' }}>
      <GameShell gameId={gameId} onScoreUpdate={onScoreUpdate}>
        {(api) => (
          <>
            <div className="game-hint" style={{ color: '#fbbf24' }}>Лови светлячков ✨ (води пальцем)</div>
            <div
              className="game-stage"
              onPointerMove={(e: PointerEvent<HTMLDivElement>) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = ((e.clientX - rect.left) / rect.width) * 100
                const y = ((e.clientY - rect.top) / rect.height) * 100
                setFlies((prev) => {
                  let caught = false
                  const next = prev.map((f) => {
                    if (!f.lit && Math.hypot(f.x - x, f.y - y) < 8) {
                      caught = true
                      return { ...f, lit: true }
                    }
                    return f
                  })
                  if (caught) api.add(2, 'sparkle')
                  return next
                })
              }}
              style={{ position: 'relative', touchAction: 'none' }}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 80%, rgba(30,27,75,0.7), transparent 50%)', pointerEvents: 'none' }} />
              {flies.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => catchFly(f.id, api)}
                  className="firefly"
                  style={{
                    position: 'absolute',
                    left: `${f.x}%`,
                    top: `${f.y}%`,
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    border: 'none',
                    background: f.lit
                      ? 'radial-gradient(circle, rgba(255,255,210,1), rgba(255,220,120,0.8))'
                      : 'radial-gradient(circle, rgba(80,90,115,0.6), rgba(60,70,90,0.2))',
                    boxShadow: f.lit ? '0 0 28px 8px rgba(255,220,120,0.55), 0 0 60px 16px rgba(255,220,120,0.2)' : 'none',
                    animation: f.lit ? 'twinkle 1.4s ease-in-out infinite' : 'none',
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