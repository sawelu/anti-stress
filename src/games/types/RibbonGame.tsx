import { useState } from 'react'
import type { PointerEvent } from 'react'
import { GameShell } from './GameShell'
import type { GameApi } from './GameShell'

type Dot = { x: number; y: number; color: string }

const PALETTE = ['#f472b6', '#a78bfa', '#60a5fa', '#34d399', '#fbbf24']

export default function RibbonGame({ gameId, onScoreUpdate }: { gameId: string; onScoreUpdate: (best: number) => void }) {
  const [dots, setDots] = useState<Dot[]>([])

  const handleDraw = (e: PointerEvent<HTMLDivElement>, api: GameApi) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    const color = PALETTE[Math.floor(Math.random() * PALETTE.length)]
    setDots((d) => {
      const next = [...d.slice(-140), { x, y, color }]
      if (next.length % 10 === 0) api.add(1, 'ribbon')
      return next
    })
  }

  return (
    <div className="game-wrap" style={{ background: 'linear-gradient(160deg, #1e1b4b, #312e81 50%, #4c1d95)' }}>
      <GameShell gameId={gameId} onScoreUpdate={onScoreUpdate}>
        {(api) => (
          <>
            <div className="game-hint" style={{ color: '#c4b5fd' }}>Тяни пальцем ленту 🎀</div>
            <div
              className="game-stage"
              onPointerMove={(e) => handleDraw(e, api)}
              style={{ position: 'relative', touchAction: 'none', cursor: 'crosshair' }}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 30%, rgba(99,102,241,0.3), transparent 60%)', pointerEvents: 'none' }} />
              <svg className="ribbon-svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                {dots.slice(1).map((d, i) => {
                  const prev = dots[i]
                  return (
                    <line
                      key={i}
                      x1={`${prev.x}%`}
                      y1={`${prev.y}%`}
                      x2={`${d.x}%`}
                      y2={`${d.y}%`}
                      stroke={d.color}
                      strokeWidth="7"
                      strokeLinecap="round"
                      opacity={0.5 + (i / dots.length) * 0.5}
                    />
                  )
                })}
              </svg>
              {dots.length > 0 && (
                <div
                  className="ribbon-tip"
                  style={{
                    position: 'absolute',
                    left: `${dots[dots.length - 1].x}%`,
                    top: `${dots[dots.length - 1].y}%`,
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: dots[dots.length - 1].color,
                    boxShadow: `0 0 26px 8px ${dots[dots.length - 1].color}90`,
                    pointerEvents: 'none',
                  }}
                />
              )}
            </div>
          </>
        )}
      </GameShell>
    </div>
  )
}