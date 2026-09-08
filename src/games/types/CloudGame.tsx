import { useEffect, useState } from 'react'
import { GameShell } from './GameShell'

type Cloud = { id: number; x: number; y: number; vx: number; scale: number }

export default function CloudGame({ gameId, onScoreUpdate }: { gameId: string; onScoreUpdate: (best: number) => void }) {
  const [clouds, setClouds] = useState<Cloud[]>(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 70 + 15,
      y: Math.random() * 60 + 20,
      vx: (Math.random() - 0.5) * 0.6,
      scale: 0.8 + Math.random() * 0.5,
    })),
  )

  useEffect(() => {
    const t = window.setInterval(() => {
      setClouds((prev) =>
        prev.map((c) => {
          let nx = c.x + c.vx
          if (nx < 10 || nx > 90) return { ...c, vx: -c.vx, x: nx }
          return { ...c, x: nx }
        }),
      )
    }, 40)
    return () => window.clearInterval(t)
  }, [])

  return (
    <div className="game-wrap" style={{ background: 'linear-gradient(180deg, #7dd3fc, #bae6fd 50%, #e0f2fe)' }}>
      <GameShell gameId={gameId} onScoreUpdate={onScoreUpdate}>
        {(api) => (
          <>
            <div className="game-hint" style={{ color: '#0369a1' }}>Тапай по облакам ☁️</div>
            <div className="game-stage" style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 25%, rgba(255,255,255,0.7), transparent 45%)', pointerEvents: 'none' }} />
              {clouds.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setClouds((prev) => prev.map((x) => (x.id === c.id ? { ...x, vx: -x.vx, scale: 1.15 } : x)))
                    api.add(1, 'cloud')
                    window.setTimeout(() => setClouds((prev) => prev.map((x) => (x.id === c.id ? { ...x, scale: x.scale / 1.15 } : x))), 250)
                  }}
                  className="cloud"
                  style={{
                    position: 'absolute',
                    left: `${c.x}%`,
                    top: `${c.y}%`,
                    width: 110 * c.scale,
                    height: 52 * c.scale,
                    transform: 'translate(-50%, -50%)',
                    transition: 'width 0.2s ease, height 0.2s ease',
                    background: 'radial-gradient(ellipse at 35% 30%, rgba(255,255,255,0.95), rgba(255,255,255,0.6) 55%, rgba(255,255,255,0.3))',
                    boxShadow: '0 12px 34px rgba(2,132,199,0.25), inset 0 -8px 16px rgba(160,200,230,0.2), inset 0 8px 16px rgba(255,255,255,0.9)',
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