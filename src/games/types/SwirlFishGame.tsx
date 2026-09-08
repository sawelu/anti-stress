import { useState } from 'react'
import type { PointerEvent } from 'react'
import { GameShell } from './GameShell'
import type { GameApi } from './GameShell'

type Trail = { x: number; y: number }

function Koi() {
  return (
    <svg width="92" height="54" viewBox="0 0 100 58" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="koiBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd08a" />
          <stop offset="45%" stopColor="#ff8f3d" />
          <stop offset="100%" stopColor="#e04f1a" />
        </linearGradient>
        <linearGradient id="koiTail" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffb36b" />
          <stop offset="100%" stopColor="#f26a2e" />
        </linearGradient>
      </defs>
      {/* tail fin */}
      <path d="M 20 29 C 8 6, -2 16, 6 29 C -3 42, 7 52, 20 29 Z" fill="url(#koiTail)" opacity="0.9" />
      <g stroke="rgba(140,40,10,0.35)" strokeWidth="1" fill="none">
        <path d="M 16 18 C 14 26 14 32 16 40" />
        <path d="M 12 20 C 10 26 10 32 12 40" />
      </g>
      {/* body */}
      <path d="M 26 28 C 24 12, 56 5, 78 15 C 96 22, 96 42, 80 47 C 58 56, 28 44, 26 28 Z" fill="url(#koiBody)" stroke="rgba(160,60,20,0.5)" strokeWidth="1" />
      {/* dorsal fin */}
      <path d="M 50 12 C 60 0, 74 4, 80 14 C 70 17, 58 16, 50 12 Z" fill="url(#koiTail)" opacity="0.85" />
      {/* pectoral fin */}
      <path d="M 74 44 C 82 54, 68 55, 60 46 Z" fill="url(#koiTail)" opacity="0.8" />
      {/* scales */}
      <g stroke="rgba(255,225,180,0.3)" strokeWidth="1" fill="none">
        <path d="M 44 22 q 6 6 0 10" />
        <path d="M 56 18 q 6 6 0 11" />
        <path d="M 66 24 q 5 5 0 9" />
      </g>
      {/* head shading */}
      <ellipse cx="82" cy="44" rx="13" ry="5" fill="rgba(180,50,10,0.25)" />
      {/* eye */}
      <circle cx="82" cy="24" r="4.6" fill="#1c1c22" />
      <circle cx="79.5" cy="22.4" r="1.7" fill="#fff" />
      {/* mouth */}
      <path d="M 91 34 q 3.5 -3 0 -4.5" stroke="rgba(140,40,10,0.8)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {/* highlight along back */}
      <path d="M 40 16 C 58 10 72 16 80 22" stroke="rgba(255,255,255,0.4)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

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
    <div className="game-wrap" style={{ background: 'linear-gradient(180deg, #0369a1, #0ea5e9 45%, #38bdf8)' }}>
      <GameShell gameId={gameId} onScoreUpdate={onScoreUpdate}>
        {(api) => (
          <>
            <div className="game-hint" style={{ color: '#f0f9ff' }}>Веди рыбку 🐠</div>
            <div
              className="game-stage"
              onPointerDown={(e) => move(e, api)}
              onPointerMove={(e) => e.buttons === 1 && move(e, api)}
              style={{ position: 'relative', touchAction: 'none', cursor: 'grab', overflow: 'hidden' }}
            >
              {/* water light rays */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                <defs>
                  <linearGradient id="rayy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </linearGradient>
                  <linearGradient id="wat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
                    <stop offset="100%" stopColor="rgba(3,105,161,0)" />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="100%" height="24%" fill="url(#wat)" />
                <polygon points="18%,0 26%,100% 34%,100% 24%,0" fill="url(#rayy)" />
                <polygon points="46%,0 54%,100% 62%,100% 52%,0" fill="url(#rayy)" />
                <polygon points="72%,0 80%,100% 90%,100% 78%,0" fill="url(#rayy)" />
              </svg>
              {/* trail wake */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                {trail.slice(1).map((t, i) => {
                  const prev = trail[i]
                  return (
                    <line
                      key={i}
                      x1={`${prev.x}%`}
                      y1={`${prev.y}%`}
                      x2={`${t.x}%`}
                      y2={`${t.y}%`}
                      stroke="rgba(224,242,254,0.9)"
                      strokeWidth="5"
                      strokeLinecap="round"
                      opacity={0.12 + ((i + 1) / trail.length) * 0.5}
                    />
                  )
                })}
              </svg>
              {/* ambient bubbles */}
              <div style={{ position: 'absolute', left: '20%', top: '70%', width: 8, height: 8, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #fff, rgba(255,255,255,0.2))', opacity: 0.5, animation: 'grainFall 4.5s linear infinite' }} />
              <div style={{ position: 'absolute', left: '75%', top: '55%', width: 5, height: 5, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #fff, rgba(255,255,255,0.2))', opacity: 0.4, animation: 'grainFall 6s linear infinite' }} />
              <div
                className="fish"
                style={{
                  position: 'absolute',
                  left: `${fish.x}%`,
                  top: `${fish.y}%`,
                  transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                  transition: 'left 0.06s linear, top 0.06s linear',
                  filter: 'drop-shadow(0 10px 14px rgba(2,60,110,0.45))',
                }}
              >
                <Koi />
              </div>
            </div>
          </>
        )}
      </GameShell>
    </div>
  )
}