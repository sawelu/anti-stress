import { useState } from 'react'
import { GameShell } from './GameShell'

type Star = { id: number; x: number; y: number; size: number; phase: number; burst: number }

function Moon() {
  return (
    <svg width="92" height="92" viewBox="0 0 100 100" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id="moSurface" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#fffef0" />
          <stop offset="55%" stopColor="#fdeeb0" />
          <stop offset="100%" stopColor="#e8cf7e" />
        </radialGradient>
        <radialGradient id="moCrater" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="rgba(200,170,90,0.55)" />
          <stop offset="60%" stopColor="rgba(180,150,75,0.35)" />
          <stop offset="100%" stopColor="rgba(220,195,130,0)" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="49" fill="url(#moSurface)" />
      <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(180,150,70,0.4)" strokeWidth="1.5" />
      {/* craters */}
      <circle cx="36" cy="34" r="11" fill="url(#moCrater)" />
      <circle cx="38" cy="33" r="11" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" transform="translate(-4,-3)" opacity="0.6" />
      <circle cx="66" cy="44" r="9" fill="url(#moCrater)" />
      <circle cx="68" cy="43" r="9" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.4" transform="translate(-3,-2.5)" opacity="0.5" />
      <circle cx="52" cy="70" r="7" fill="url(#moCrater)" />
      <circle cx="53" cy="69" r="7" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.3" transform="translate(-2.5,-2)" opacity="0.5" />
      <circle cx="28" cy="60" r="4.5" fill="url(#moCrater)" />
      <circle cx="72" cy="66" r="4" fill="url(#moCrater)" />
      <circle cx="60" cy="26" r="4" fill="url(#moCrater)" />
      {/* mare shading */}
      <ellipse cx="50" cy="54" rx="40" ry="36" fill="url(#moCrater)" opacity="0.5" />
    </svg>
  )
}

export default function LullabyGame({ gameId, onScoreUpdate }: { gameId: string; onScoreUpdate: (best: number) => void }) {
  const [stars, setStars] = useState<Star[]>(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 82 + 9,
      y: Math.random() * 52 + 10,
      size: 12 + Math.random() * 14,
      phase: Math.random() * 100,
      burst: 0,
    })),
  )

  return (
    <div className="game-wrap" style={{ background: 'radial-gradient(circle at 75% 22%, rgba(120,80,220,0.35), transparent 50%), linear-gradient(180deg, #0a0d22, #1b1740 55%, #2e1d55)' }}>
      <GameShell gameId={gameId} onScoreUpdate={onScoreUpdate}>
        {(api) => (
          <>
            <div className="game-hint" style={{ color: '#e9d5ff', borderColor: 'rgba(217,213,255,0.3)', background: 'rgba(30,27,70,0.6)' }}>Коснись звёздочек 🌙</div>
            <div className="game-stage" style={{ position: 'relative', background: 'transparent' }}>
              {/* aurora hint */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(80,120,255,0.12), transparent 40%, rgba(160,60,220,0.12))', pointerEvents: 'none' }} />
              {/* moon + glow */}
              <div style={{ position: 'absolute', right: '7%', top: '6%', pointerEvents: 'none', filter: 'drop-shadow(0 0 34px rgba(255,230,150,0.55)) drop-shadow(0 0 70px rgba(255,220,130,0.25))' }}>
                <Moon />
              </div>
              {/* thin night clouds */}
              <div style={{ position: 'absolute', right: '4%', top: '16%', width: '34%', height: 14, borderRadius: 999, background: 'linear-gradient(90deg, rgba(160,140,220,0.4), rgba(160,140,220,0))', filter: 'blur(3px)', pointerEvents: 'none', animation: 'cloudDrift 9s ease-in-out infinite' }} />
              <div style={{ position: 'absolute', left: '6%', top: '34%', width: '26%', height: 12, borderRadius: 999, background: 'linear-gradient(90deg, rgba(160,140,220,0.35), rgba(160,140,220,0))', filter: 'blur(3px)', pointerEvents: 'none', animation: 'cloudDrift 12s ease-in-out infinite reverse' }} />

              {stars.map((s) => {
                const starKey = s.burst
                const size = s.size
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setStars((prev) => prev.map((x) => (x.id === s.id ? { ...x, burst: x.burst + 1, size: x.size * 1.4 } : x)))
                      api.add(2, 'musicbox')
                      window.setTimeout(() => setStars((prev) => prev.map((x) => (x.id === s.id ? { ...x, size: x.size / 1.4 } : x))), 700)
                    }}
                    className="lullaby-star"
                    style={{
                      position: 'absolute',
                      left: `${s.x}%`,
                      top: `${s.y}%`,
                      width: size * 2,
                      height: size * 2,
                      transform: 'translate(-50%, -50%)',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <svg width={size * 2} height={size * 2} viewBox="0 0 40 40" style={{ display: 'block', overflow: 'visible' }}>
                      <defs>
                        <radialGradient id="starFill" cx="40%" cy="35%" r="65%">
                          <stop offset="0%" stopColor="#ffffff" />
                          <stop offset="55%" stopColor="#fff3c4" />
                          <stop offset="100%" stopColor="#fbd37e" />
                        </radialGradient>
                      </defs>
                      {starKey > 0 && (
                        <g key={starKey}>
                          <circle cx="20" cy="20" r="7" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2">
                            <animate attributeName="r" dur="0.8s" values="7;26" />
                            <animate attributeName="opacity" dur="0.8s" values="1;0" />
                          </circle>
                          <circle cx="20" cy="20" r="5" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5">
                            <animate attributeName="r" dur="0.8s" values="5;18" begin="0.12s" />
                            <animate attributeName="opacity" dur="0.8s" values="1;0" begin="0.12s" />
                          </circle>
                        </g>
                      )}
                      {/* sparkle glow */}
                      <circle cx="20" cy="20" r="11" fill="none" stroke={`rgba(255,244,200,${0.4 + s.phase / 160})`} strokeWidth="1.4">
                        <animate attributeName="r" dur="1.8s" values="9;13;9" repeatCount="indefinite" />
                      </circle>
                      {/* 4-point star */}
                      <path
                        d="M20 6 C21 14 26 19 34 20 C26 21 21 26 20 34 C19 26 14 21 6 20 C14 19 19 14 20 6 Z"
                        fill="url(#starFill)"
                      />
                      <circle cx="16" cy="14" r="1.8" fill="#fff" opacity="0.7" />
                    </svg>
                  </button>
                )
              })}
            </div>
          </>
        )}
      </GameShell>
    </div>
  )
}