import { useState } from 'react'
import type { PointerEvent } from 'react'
import { GameShell } from './GameShell'
import type { GameApi } from './GameShell'

type Trail = { x: number; y: number }

export default function SwirlFishGame({ gameId, onScoreUpdate }: { gameId: string; onScoreUpdate: (best: number) => void }) {
  const [fish, setFish] = useState({ x: 50, y: 60 })
  const [trail, setTrail] = useState<Trail[]>([])
  const [angle, setAngle] = useState(0)

  const move = (e: PointerEvent<HTMLDivElement>, api: GameApi) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setFish((old) => {
      setAngle(Math.atan2(y - old.y, x - old.x) * 180 / Math.PI)
      return { x, y }
    })
    setTrail((t) => [...t.slice(-30), { x, y }])
    api.add(0.5, 'swirl')
  }

  return (
    <div className="game-wrap" style={{ background: 'linear-gradient(180deg, #0ea5e9, #38bdf8 50%, #7dd3fc)' }}>
      <GameShell gameId={gameId} onScoreUpdate={onScoreUpdate}>
        {(api) => (
          <>
            <div className="game-hint" style={{ color: '#f0f9ff' }}>Веди рыбку 🐠</div>
            <div
              className="game-stage"
              onPointerDown={(e) => move(e, api)}
              onPointerMove={(e) => e.buttons === 1 && move(e, api)}
              style={{ position: 'relative', touchAction: 'none', cursor: 'grab' }}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 60% 20%, rgba(255,255,255,0.35), transparent 45%)', pointerEvents: 'none' }} />
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                {trail.slice(1).map((t, i) => {
                  const prev = trail[i]
                  return (
                    <line key={i} x1={`${prev.x}%`} y1={`${prev.y}%`} x2={`${t.x}%`} y2={`${t.y}%`} stroke="rgba(255,255,255,0.7)" strokeWidth="4" strokeLinecap="round" opacity={0.25 + (i / trail.length) * 0.6} />
                  )
                })}
              </svg>
              <div
                className="fish"
                style={{
                  position: 'absolute',
                  left: `${fish.x}%`,
                  top: `${fish.y}%`,
                  width: 44,
                  height: 28,
                  transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                  transition: 'left 0.08s linear, top 0.08s linear',
                }}
              >
                <div className="fish-body" style={{ position: 'absolute', inset: 0, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', background: 'linear-gradient(90deg,#fbbf24,#f59e0b)', boxShadow: '0 8px 24px rgba(245,158,11,0.5)' }}>
                  <div style={{ position: 'absolute', top: 7, right: 8, width: 5, height: 5, borderRadius: '50%', background: '#1f2937' }} />
                  <div style={{ position: 'absolute', top: 7, right: 1, width: 3, height: 3, borderRadius: '50%', background: '#1f2937' }} />
                </div>
                <div className="fish-tail" style={{ position: 'absolute', left: -12, top: 3, borderWidth: 0, borderLeft: '14px solid #f59e0b', borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderStyle: 'solid' }} />
              </div>
            </div>
          </>
        )}
      </GameShell>
    </div>
  )
}