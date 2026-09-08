import { useState } from 'react'
import { GameShell } from './GameShell'

type Orb = { id: number; x: number; y: number; r: number; hue: number }

function Spirit({ r, hue }: { r: number; hue: number }) {
  return (
    <svg width={r * 2} height={r * 2 + 12} viewBox="0 0 100 118" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id="spCore" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.98)" />
          <stop offset="38%" stopColor={`hsla(${hue}, 90%, 78%, 0.85)`} />
          <stop offset="72%" stopColor={`hsla(${hue}, 85%, 62%, 0.45)`} />
          <stop offset="100%" stopColor="hsla(240, 60%, 50%, 0)" />
        </radialGradient>
        <radialGradient id="spSwirl" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="60%" stopColor={`hsla(${hue}, 80%, 70%, 0.5)`} />
          <stop offset="100%" stopColor="hsla(240, 60%, 55%, 0)" />
        </radialGradient>
      </defs>
      {/* wisp tail */}
      <path
        d="M 50 92 C 42 104 34 108 22 116 M 50 94 C 56 106 62 112 76 118 M 50 96 C 46 108 40 114 30 120"
        stroke={`hsla(${hue}, 85%, 72%, 0.5)`}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* body */}
      <circle cx="50" cy="50" r="46" fill="url(#spCore)" />
      <circle cx="50" cy="50" r="46" fill="url(#spSwirl)" />
      {/* inner swirls */}
      <path d="M 26 52 Q 36 40 50 48 Q 62 56 74 44" stroke="rgba(255,255,255,0.5)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 34 70 Q 44 62 56 68 Q 66 74 72 66" stroke="rgba(255,255,255,0.3)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {/* eyes */}
      <circle cx="40" cy="46" r="4.2" fill="#2b1f3f" opacity="0.85" />
      <circle cx="60" cy="46" r="4.2" fill="#2b1f3f" opacity="0.85" />
      <circle cx="39" cy="45" r="1.2" fill="#fff" />
      <circle cx="59" cy="45" r="1.2" fill="#fff" />
      {/* rim */}
      <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
    </svg>
  )
}

export default function GhostGame({ gameId, onScoreUpdate }: { gameId: string; onScoreUpdate: (best: number) => void }) {
  const [orbs, setOrbs] = useState<Orb[]>(() =>
    Array.from({ length: 7 }, (_, i) => ({
      id: i,
      x: Math.random() * 70 + 15,
      y: Math.random() * 55 + 18,
      r: 30 + Math.random() * 24,
      hue: 210 + (i % 3) * 40 + Math.random() * 20,
    })),
  )

  return (
    <div className="game-wrap" style={{ background: 'radial-gradient(circle at 50% 60%, rgba(80,60,180,0.35), transparent 55%), linear-gradient(168deg, #14122e, #221e44 55%, #2c2360)' }}>
      <GameShell gameId={gameId} onScoreUpdate={onScoreUpdate}>
        {(api) => (
          <>
            <div className="game-hint" style={{ color: '#cdc4f8', borderColor: 'rgba(196,181,253,0.3)', background: 'rgba(30,26,70,0.6)' }}>Собирай мягкое эхо 👻</div>
            <div className="game-stage" style={{ position: 'relative', background: 'transparent' }}>
              {/* drifting fog patches */}
              <div style={{ position: 'absolute', left: '-20%', top: '60%', width: '140%', height: '40%', background: 'radial-gradient(ellipse at 50% 50%, rgba(160,150,230,0.22), transparent 70%)', filter: 'blur(14px)', pointerEvents: 'none', animation: 'cloudDrift 6s ease-in-out infinite' }} />
              <div style={{ position: 'absolute', left: '20%', top: '20%', width: '60%', height: '30%', background: 'radial-gradient(ellipse at 50% 50%, rgba(180,170,250,0.16), transparent 70%)', filter: 'blur(16px)', pointerEvents: 'none', animation: 'cloudDrift 8s ease-in-out infinite reverse' }} />
              {/* bokeh dots */}
              {[[85, 15, 3], [12, 30, 2], [70, 80, 3], [25, 75, 2]].map((d, i) => (
                <span key={i} style={{ position: 'absolute', left: `${d[0]}%`, top: `${d[1]}%`, width: d[2] * 2, height: d[2] * 2, borderRadius: '50%', background: 'rgba(200,190,255,0.25)', filter: 'blur(1px)', pointerEvents: 'none' }} />
              ))}
              {orbs.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => {
                    setOrbs((prev) => prev.filter((x) => x.id !== o.id))
                    api.add(3, 'ghost')
                  }}
                  className="ghost-orb"
                  style={{
                    position: 'absolute',
                    left: `${o.x}%`,
                    top: `${o.y}%`,
                    border: 'none',
                    background: 'transparent',
                    transform: 'translate(-50%, -50%)',
                    cursor: 'pointer',
                    animation: `orbFloat ${3.2 + (o.id % 4) * 0.5}s ease-in-out infinite`,
                    transition: 'filter 0.4s ease, transform 0.4s ease',
                    filter: `drop-shadow(0 0 ${o.r * 0.5}px hsla(${o.hue}, 90%, 72%, 0.55))`,
                  }}
                >
                  <div style={{ animation: 'mistPulse 3.4s ease-in-out infinite' }}>
                    <Spirit r={o.r} hue={o.hue} />
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </GameShell>
    </div>
  )
}