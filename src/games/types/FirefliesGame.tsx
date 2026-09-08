import { useEffect, useState } from 'react'
import type { PointerEvent } from 'react'
import { GameShell } from './GameShell'
import type { GameApi } from './GameShell'

type Firefly = { id: number; x: number; y: number; vx: number; vy: number; lit: boolean }

function FireflyBug({ lit }: { lit: boolean }) {
  return (
    <svg width="38" height="26" viewBox="0 0 40 26" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id="ffGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fffde6" />
          <stop offset="40%" stopColor={`rgba(255,${lit ? 224 : 180},120,${lit ? 0.85 : 0.35})`} />
          <stop offset="100%" stopColor="rgba(255,220,120,0)" />
        </radialGradient>
      </defs>
      {/* traveling glow */}
      <circle cx="28" cy="13" r="13" fill="url(#ffGlow)" />
      {/* abdomen light */}
      <ellipse cx="28" cy="13" rx="8" ry="5.5" fill={lit ? '#fff9c4' : '#b9c08a'} />
      <ellipse cx="26" cy="11" rx="3" ry="2" fill="#ffffff" opacity="0.9" />
      {/* wings */}
      <path d="M13 6 C 20 1, 28 2, 25 8 C 20 9, 15 9, 13 6 Z" fill="rgba(220,225,255,0.5)" />
      <path d="M13 10 C 20 6, 28 7, 26 12 C 21 12, 16 12, 13 10 Z" fill="rgba(200,210,255,0.35)" />
      {/* body */}
      <ellipse cx="17" cy="11" rx="11.5" ry="5" fill="#26262e" />
      <ellipse cx="17" cy="9.5" rx="8" ry="2.6" fill="#3a3a45" />
      {/* head */}
      <circle cx="5.5" cy="10.5" r="3.4" fill="#3a3a45" />
      {/* antennae */}
      <path d="M4 8 C 2 5, 3 3, 5 2.5" stroke="#8a8a99" strokeWidth="1" fill="none" />
      <path d="M7 7.5 C 8 4.5, 9.5 3, 11 2.8" stroke="#8a8a99" strokeWidth="1" fill="none" />
      {/* legs */}
      <path d="M11 15 L 8 18 M16 15.5 L 14 19 M21 15 L 20 18.5" stroke="#26262e" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export default function FirefliesGame({ gameId, onScoreUpdate }: { gameId: string; onScoreUpdate: (best: number) => void }) {
  const [flies, setFlies] = useState<Firefly[]>(() =>
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * 70 + 10,
      y: Math.random() * 55 + 12,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      lit: Math.random() > 0.5,
    })),
  )

  useEffect(() => {
    const t = window.setInterval(() => {
      setFlies((prev) =>
        prev.map((f) => {
          let nx = f.x + f.vx
          let ny = f.y + f.vy
          if (nx < 5 || nx > 95) {
            nx = nx < 5 ? 5 : 95
            f.vx = -f.vx
          }
          if (ny < 4 || ny > 82) {
            ny = ny < 4 ? 4 : 82
            f.vy = -f.vy
          }
          return { ...f, x: nx, y: ny }
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
    <div className="game-wrap" style={{ background: 'radial-gradient(circle at 65% 18%, rgba(60,50,120,0.8), transparent 45%), linear-gradient(180deg, #0b1026, #141238 55%, #1d1840)' }}>
      <GameShell gameId={gameId} onScoreUpdate={onScoreUpdate}>
        {(api) => (
          <>
            <div className="game-hint" style={{ color: '#fde68a', borderColor: 'rgba(253,230,138,0.35)', background: 'rgba(30,27,75,0.6)' }}>Лови светлячков ✨ (води пальцем)</div>
            <div
              className="game-stage"
              onPointerMove={(e: PointerEvent<HTMLDivElement>) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = ((e.clientX - rect.left) / rect.width) * 100
                const y = ((e.clientY - rect.top) / rect.height) * 100
                setFlies((prev) => {
                  let caught = false
                  const next = prev.map((f) => {
                    if (!f.lit && Math.hypot(f.x - x, f.y - y) < 9) {
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
              {/* stars */}
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'transparent' }}>
                {[
                  { x: 12, y: 10, s: 2 },
                  { x: 30, y: 22, s: 1.6 },
                  { x: 55, y: 8, s: 2.2 },
                  { x: 74, y: 18, s: 1.5 },
                  { x: 88, y: 30, s: 2 },
                  { x: 20, y: 38, s: 1.4 },
                  { x: 94, y: 12, s: 1.7 },
                ].map((st, i) => (
                  <span key={i} style={{ position: 'absolute', left: `${st.x}%`, top: `${st.y}%`, width: st.s, height: st.s, borderRadius: '50%', background: '#cdbff5', boxShadow: '0 0 6px 1px rgba(205,191,245,0.7)', animation: `twinkle ${2.2 + i * 0.4}s ease-in-out infinite` }} />
                ))}
              </div>
              {/* moon */}
              <div style={{ position: 'absolute', right: '6%', top: '6%', width: 34, height: 34, borderRadius: '50%', background: 'radial-gradient(circle at 40% 40%, #fefcea, #e8d9f0)', boxShadow: '0 0 40px rgba(240,220,250,0.5)', pointerEvents: 'none', opacity: 0.8 }} />
              {/* fireflies */}
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
                    width: 40,
                    height: 28,
                    transform: 'translate(-50%, -50%)',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    filter: f.lit ? 'drop-shadow(0 0 6px rgba(255,230,150,0.9))' : 'none',
                    animation: `orbFloat ${2.4 + (f.id % 5) * 0.45}s ease-in-out infinite`,
                  }}
                >
                  <div style={{ animation: f.lit ? 'twinkle 1.5s ease-in-out infinite' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FireflyBug lit={f.lit} />
                  </div>
                </button>
              ))}
              {/* meadow grass far */}
              <svg style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', height: '30%', pointerEvents: 'none' }} viewBox="0 0 400 120" preserveAspectRatio="none">
                <path d="M0 120 L0 96 Q 14 84 26 98 Q 38 110 52 90 Q 66 78 80 94 Q 94 106 108 86 Q 122 70 138 88 Q 152 100 166 82 Q 180 64 194 84 Q 208 100 222 80 Q 236 62 252 82 Q 266 96 280 76 Q 294 58 310 78 Q 324 94 338 74 Q 352 60 366 82 Q 380 96 396 78 Q 404 72 404 120 Z" fill="#111a33" />
              </svg>
              {/* meadow grass near */}
              <svg style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', height: '22%', pointerEvents: 'none' }} viewBox="0 0 400 110" preserveAspectRatio="none">
                <path d="M0 110 L0 92 Q 12 78 24 94 Q 36 104 50 86 Q 62 70 76 88 Q 88 104 102 84 Q 116 66 132 86 Q 146 102 160 82 Q 174 62 190 84 Q 204 100 218 78 Q 232 58 248 80 Q 262 96 276 74 Q 290 56 306 76 Q 320 96 334 72 Q 350 56 366 78 Q 380 98 398 76 Q 404 70 404 110 Z" fill="#0b1122" />
              </svg>
            </div>
          </>
        )}
      </GameShell>
    </div>
  )
}