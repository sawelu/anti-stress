import { useState } from 'react'
import type { PointerEvent } from 'react'
import { GameShell } from './GameShell'
import type { GameApi } from './GameShell'

type Dot = { x: number; y: number; color: string }

const PALETTE = ['#f472b6', '#a78bfa', '#60a5fa', '#34d399', '#fbbf24', '#fb7185']

export default function RibbonGame({ gameId, onScoreUpdate }: { gameId: string; onScoreUpdate: (best: number) => void }) {
  const [dots, setDots] = useState<Dot[]>([])

  const handleDraw = (e: PointerEvent<HTMLDivElement>, api: GameApi) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    const color = PALETTE[Math.floor(Math.random() * PALETTE.length)]
    setDots((d) => {
      const next = [...d.slice(-140), { x, y, color }]
      if (next.length % 6 === 0) api.add(1, 'ribbon')
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
                <defs>
                  <linearGradient id="satin" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="600" y2="500">
                    <stop offset="0%" stopColor="#f472b6" />
                    <stop offset="30%" stopColor="#a78bfa" />
                    <stop offset="55%" stopColor="#60a5fa" />
                    <stop offset="78%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                </defs>
                {dots.slice(1).map((d, i) => {
                  const prev = dots[i]
                  const prevDot = dots[i + 1]
                  return (
                    <g key={i}>
                      {/* soft glow */}
                      <line x1={`${prev.x}%`} y1={`${prev.y}%`} x2={`${d.x}%`} y2={`${d.y}%`} stroke={d.color} strokeWidth="15" strokeLinecap="round" opacity="0.22" filter="blur(3px)" />
                      {/* satin body */}
                      <line x1={`${prev.x}%`} y1={`${prev.y}%`} x2={`${d.x}%`} y2={`${d.y}%`} stroke="url(#satin)" strokeWidth="10" strokeLinecap="round" />
                      {/* bright core */}
                      <line x1={`${prev.x}%`} y1={`${prev.y}%`} x2={`${d.x}%`} y2={`${d.y}%`} stroke="rgba(255,255,255,0.65)" strokeWidth="2.6" strokeLinecap="round" />
                      {/* sparkle accents */}
                      {i % 5 === 0 && prevDot && (
                        <g transform={`translate(${(prev.x + d.x) / 2}%, ${(prev.y + d.y) / 2}%)`}>
                          <path d="M0 -5 Q 1 0 5 0 Q 1 1 0 5 Q -1 1 -5 0 Q -1 0 0 -5 Z" fill="#ffffff" opacity="0.9">
                            <animate attributeName="opacity" values="0.9;0.2;0.9" dur="1.4s" repeatCount="indefinite" />
                          </path>
                        </g>
                      )}
                    </g>
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
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: dots[dots.length - 1].color,
                    boxShadow: `0 0 24px 8px ${dots[dots.length - 1].color}99, 0 0 4px #fff inset`,
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