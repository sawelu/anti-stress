import { useEffect, useState } from 'react'
import { GameShell } from './GameShell'

type Cloud = { id: number; x: number; y: number; vx: number; scale: number }

function Cumulus({ w }: { w: number }) {
  const h = w * 0.62
  return (
    <svg width={w} height={h} viewBox="0 0 220 140" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="clPuff" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#f6fbff" />
          <stop offset="88%" stopColor="#dbeaf7" />
          <stop offset="100%" stopColor="#bcd3e8" />
        </linearGradient>
      </defs>
      {/* shadow on ground of cloud */}
      <ellipse cx="110" cy="126" rx="92" ry="9" fill="rgba(56,120,180,0.12)" />
      {/* back puffs */}
      <ellipse cx="78" cy="78" rx="36" ry="34" fill="url(#clPuff)" />
      <ellipse cx="146" cy="84" rx="32" ry="30" fill="url(#clPuff)" />
      <ellipse cx="112" cy="66" rx="42" ry="40" fill="url(#clPuff)" />
      {/* front puffs */}
      <ellipse cx="60" cy="96" rx="38" ry="30" fill="url(#clPuff)" />
      <ellipse cx="118" cy="92" rx="46" ry="34" fill="url(#clPuff)" />
      <ellipse cx="168" cy="100" rx="32" ry="26" fill="url(#clPuff)" />
      {/* flat base */}
      <rect x="34" y="100" width="152" height="30" rx="16" fill="url(#clPuff)" />
      {/* bottom shading */}
      <ellipse cx="110" cy="124" rx="92" ry="16" fill="rgba(160,190,220,0.35)" />
      {/* sun-glow rim top-left */}
      <ellipse cx="88" cy="62" rx="52" ry="30" fill="rgba(255,255,255,0.85)" />
      <ellipse cx="130" cy="58" rx="42" ry="26" fill="rgba(255,255,255,0.55)" />
    </svg>
  )
}

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
    <div className="game-wrap" style={{ background: 'linear-gradient(180deg, #38bdf8, #7dd3fc 45%, #bae6fd)' }}>
      <GameShell gameId={gameId} onScoreUpdate={onScoreUpdate}>
        {(api) => (
          <>
            <div className="game-hint" style={{ color: '#075985' }}>Тапай по облакам ☁️</div>
            <div className="game-stage" style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 20%, rgba(255,255,255,0.85), transparent 50%)', pointerEvents: 'none' }} />
              {clouds.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setClouds((prev) => prev.map((x) => (x.id === c.id ? { ...x, vx: -x.vx, scale: x.scale * 0.9 } : x)))
                    api.add(1, 'cloud')
                    window.setTimeout(() => setClouds((prev) => prev.map((x) => (x.id === c.id ? { ...x, scale: x.scale / 0.9 } : x))), 240)
                  }}
                  className="cloud"
                  style={{
                    position: 'absolute',
                    left: `${c.x}%`,
                    top: `${c.y}%`,
                    transform: 'translate(-50%, -50%)',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    filter: 'drop-shadow(0 18px 20px rgba(2,100,180,0.3))',
                    animation: 'cloudDrift 2.4s ease-in-out infinite',
                  }}
                >
                  <div style={{ transform: `scale(${c.scale})`, transition: 'transform 0.22s ease' }}>
                    <Cumulus w={128} />
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