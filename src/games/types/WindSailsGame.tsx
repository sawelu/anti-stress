import { useState } from 'react'
import type { PointerEvent } from 'react'
import { GameShell } from './GameShell'
import type { GameApi } from './GameShell'

function Yacht({ angle }: { angle: number }) {
  return (
    <svg width="196" height="212" viewBox="0 0 200 216" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d98e2b" />
          <stop offset="55%" stopColor="#b06a1c" />
          <stop offset="100%" stopColor="#7c4510" />
        </linearGradient>
        <linearGradient id="mainSail" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#fdf3dc" />
          <stop offset="100%" stopColor="#f3dcaf" />
        </linearGradient>
        <linearGradient id="jibSail" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#eef3f8" />
        </linearGradient>
        <linearGradient id="waterG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5fd0f5" />
          <stop offset="100%" stopColor="#1e90d8" />
        </linearGradient>
      </defs>

      {/* waves far */}
      <g>
        <path d="M0 188 Q 25 178 50 188 T 100 188 T 150 188 T 200 188 L 200 216 L 0 216 Z" fill="url(#waterG)" opacity="0.55" />
      </g>

      {/* mast */}
      <rect x="97" y="16" width="5" height="150" rx="2.5" fill="url(#wood)" />

      {/* mainsail (rotatable) */}
      <g transform={`rotate(${angle} 99.5 34)`}>
        <path d="M 99.5 34 C 120 44 150 92 150 118 C 130 150 112 158 99.5 166 C 100 122 99.5 80 99.5 34 Z" fill="url(#mainSail)" stroke="rgba(180,140,80,0.5)" strokeWidth="2" />
        {/* sail seams */}
        <g stroke="rgba(190,150,90,0.4)" strokeWidth="1.3" fill="none">
          <path d="M 99.8 66 C 116 74 138 102 142 116" />
          <path d="M 99.8 102 C 114 110 126 130 134 144" />
        </g>
        <path d="M 99.5 42 C 112 52 134 96 140 116" stroke="rgba(255,255,255,0.7)" strokeWidth="3" fill="none" />
      </g>

      {/* boom */}
      <rect x="99.5" y="160" width="52" height="4" rx="2" fill="url(#wood)" transform="rotate(6 99.5 162)" />

      {/* jib */}
      <path d="M 99.5 34 L 42 120 L 99.5 120 Z" fill="url(#jibSail)" stroke="rgba(140,170,200,0.5)" strokeWidth="2" />
      <path d="M 99.5 40 L 62 112" stroke="rgba(255,255,255,0.7)" strokeWidth="2.4" fill="none" />

      {/* hull */}
      <path d="M 22 158 C 60 150 140 150 178 158 C 186 166 186 176 178 184 C 134 194 66 194 22 184 C 14 176 14 166 22 158 Z" fill="url(#wood)" stroke="rgba(122,66,15,0.7)" strokeWidth="2" />
      {/* deck */}
      <path d="M 26 160 C 62 153 138 153 174 160 L 172 166 C 136 159 64 159 28 166 Z" fill="#e8a94f" />
      {/* hull planking */}
      <g stroke="rgba(90,48,12,0.5)" strokeWidth="1.3" fill="none">
        <path d="M 34 168 C 76 162 124 162 166 168" />
        <path d="M 30 176 C 76 169 124 169 170 176" />
      </g>
      {/* hull highlight */}
      <path d="M 40 162 C 76 156 124 156 160 162" stroke="rgba(255,210,140,0.7)" strokeWidth="3" fill="none" />

      {/* waves near (animated) */}
      <g className="wave-sway">
        <path d="M-20 184 Q 5 176 30 184 T 70 184 T 110 184 T 150 184 T 190 184 T 230 184 L 230 216 L -20 216 Z" fill="url(#waterG)" />
        <path d="M-20 196 Q 5 188 30 196 T 70 196 T 110 196 T 150 196 T 190 196 T 230 196 L 230 216 L -20 216 Z" fill="#1e7fc4" opacity="0.8" />
        <g stroke="rgba(255,255,255,0.55)" strokeWidth="2" fill="none" strokeLinecap="round">
          <path d="M-14 190 Q -2 186 10 190" />
          <path d="M22 202 Q 34 198 46 202" />
          <path d="M96 192 Q 110 187 124 192" />
          <path d="M150 206 Q 162 202 174 206" />
        </g>
      </g>
    </svg>
  )
}

export default function WindSailsGame({ gameId, onScoreUpdate }: { gameId: string; onScoreUpdate: (best: number) => void }) {
  const [angle, setAngle] = useState(0)

  const steer = (e: PointerEvent<HTMLDivElement>, api: GameApi) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const nx = (x - 50) / 50
    const nextAngle = Math.max(-45, Math.min(45, nx * 45))
    setAngle(nextAngle)
    if (Math.abs(nextAngle) < 15) {
      api.add(0.5, 'wind')
    }
  }

  return (
    <div className="game-wrap" style={{ background: 'linear-gradient(185deg, #cbeafe, #a5d8fb 40%, #84c5f4)' }}>
      <GameShell gameId={gameId} onScoreUpdate={onScoreUpdate}>
        {(api) => (
          <>
            <div className="game-hint" style={{ color: '#155e75' }}>Держи парус по центру 🪁</div>
            <div
              className="game-stage"
              onPointerMove={(e) => e.buttons === 1 && steer(e, api)}
              onPointerDown={(e) => steer(e, api)}
              style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, touchAction: 'none', cursor: 'grab', overflow: 'hidden' }}
            >
              {/* sky highlight */}
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 12%, rgba(255,255,255,0.5), transparent 40%)', pointerEvents: 'none' }} />
              {/* wind streaks */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                <g stroke="rgba(255,255,255,0.45)" strokeWidth="2" fill="none" strokeLinecap="round">
                  <path d="M -10 20 Q 40 14 90 20">
                    <animate attributeName="d" dur="3s" repeatCount="indefinite" values="M -10 20 Q 40 14 90 20;M -10 22 Q 40 16 90 22;M -10 20 Q 40 14 90 20" />
                  </path>
                  <path d="M 220 44 Q 170 38 120 44" opacity="0.7" />
                  <path d="M -6 70 Q 20 64 46 70" opacity="0.5" />
                </g>
              </svg>
              <div style={{ position: 'relative' }}>
                <div style={{ filter: 'drop-shadow(0 24px 24px rgba(20,90,140,0.35))' }}>
                  <Yacht angle={angle} />
                </div>
              </div>
              <div className="sail-status" style={{ fontSize: 13, fontWeight: 700, color: Math.abs(angle) < 15 ? '#0f7a4d' : '#b91c1c', background: 'rgba(255,255,255,0.6)', padding: '6px 16px', borderRadius: 999 }}>
                {Math.abs(angle) < 15 ? 'Ветер попутный ✅' : 'Настрой угол 🌬️'}
              </div>
              <div style={{ width: 'min(80%, 300px)', height: 10, borderRadius: 999, background: 'rgba(255,255,255,0.6)', position: 'relative', boxShadow: 'inset 0 1px 3px rgba(0,80,120,0.15)' }}>
                <div style={{ position: 'absolute', left: '50%', top: -4, width: 2, height: 18, background: '#1e6f8f' }} />
                <div className="angle-marker" style={{ position: 'absolute', left: '50%', top: -5, width: 18, height: 18, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #ffffff, #0e7490 70%)', boxShadow: '0 2px 6px rgba(0,80,120,0.4)', transform: `translateX(calc(-50% + ${angle * 3}px))`, transition: 'transform 0.12s ease' }} />
              </div>
            </div>
          </>
        )}
      </GameShell>
    </div>
  )
}