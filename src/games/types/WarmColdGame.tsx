import { useEffect, useState } from 'react'
import { GameShell } from './GameShell'

function Thermometer({ temp }: { temp: number }) {
  const hot = temp > 60
  const cold = temp < 40
  const ok = !hot && !cold
  const main = hot ? '#ef4444' : cold ? '#60a5fa' : '#22c55e'
  const dark = hot ? '#b91c1c' : cold ? '#1d4ed8' : '#15803d'
  const liqH = temp * 1.66
  const top = 188 - liqH
  return (
    <svg width="86" height="214" viewBox="0 0 86 214" style={{ display: 'block', filter: `drop-shadow(0 0 18px ${main}66) drop-shadow(0 14px 24px rgba(0,0,0,0.18))` }}>
      <defs>
        <linearGradient id="thLiq" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={main} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
      </defs>
      {/* bulb glow */}
      <circle cx="43" cy="194" r="26" fill={main} opacity="0.18" />
      {/* bulb */}
      <circle cx="43" cy="192" r="21" fill={cold ? '#bfdbfe' : hot ? '#fecaca' : '#bbf7d0'} opacity="0.55" />
      <circle cx="43" cy="192" r="21" fill="url(#thLiq)" />
      <ellipse cx="37" cy="186" rx="6" ry="9" fill="rgba(255,255,255,0.7)" />
      {/* glass tube */}
      <rect x="31" y="8" width="24" height="184" rx="12" fill="rgba(255,255,255,0.35)" stroke="rgba(100,116,139,0.5)" strokeWidth="2" />
      {/* liquid column */}
      {liqH > 2 && (
        <>
          <rect x="36" y={top + 6} width="14" height={liqH - 6} rx="7" fill="url(#thLiq)" />
          <circle cx="43" cy={Math.max(top + 6, 14)} r="7" fill="url(#thLiq)" />
        </>
      )}
      {/* glass highlight */}
      <rect x="34" y="16" width="5" height="150" rx="2.5" fill="rgba(255,255,255,0.65)" />
      <rect x="47" y="18" width="2" height="140" rx="1" fill="rgba(255,255,255,0.3)" />
      {/* scale ticks */}
      <g stroke="rgba(100,116,139,0.45)" strokeWidth="1.4">
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1={56 + (i % 2 === 0 ? 5 : 2)} y1={20 + i * 34} x2={60 + (i % 2 === 0 ? 5 : 2)} y2={20 + i * 34} />
        ))}
      </g>
      {/* state pill text is handled outside */}
      {ok && (
        <ellipse cx="43" cy="70" rx="13" ry="7" fill="rgba(255,255,255,0.5)" />
      )}
    </svg>
  )
}

function Flame() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <defs>
        <linearGradient id="flG" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
      <path d="M12 2C8.2 6.3 5 9.7 5 13.4a7 7 0 0 0 14 0C19 9.7 15.8 6.3 12 2z" fill="url(#flG)" />
      <ellipse cx="10.4" cy="7" rx="2" ry="1.4" fill="rgba(255,255,255,0.75)" />
    </svg>
  )
}

function Snow() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <defs>
        <linearGradient id="snG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <g stroke="url(#snG)" strokeWidth="1.8" strokeLinecap="round">
        <path d="M12 2v20" />
        <path d="M12 2l-2.6 2.6M12 2l2.6 2.6" />
        <path d="M12 22l-2.6-2.6M12 22l2.6-2.6" />
        <path d="M3.5 7l3.5 1M3.5 7l1 3.5M3.5 7l-.6 3.6" />
        <path d="M20.5 17l-3.5-1M20.5 17l-1-3.5M20.5 17l.6-3.6" />
      </g>
    </svg>
  )
}

export default function WarmColdGame({ gameId, onScoreUpdate }: { gameId: string; onScoreUpdate: (best: number) => void }) {
  const [temp, setTemp] = useState(50)
  const [drift, setDrift] = useState<'up' | 'down'>('up')

  useEffect(() => {
    const t = window.setInterval(() => {
      setTemp((v) => {
        const next = drift === 'up' ? v + 1.5 : v - 1.5
        if (next >= 100) {
          setDrift('down')
          return 100
        }
        if (next <= 0) {
          setDrift('up')
          return 0
        }
        return next
      })
    }, 200)
    return () => window.clearInterval(t)
  }, [drift])

  const right = temp >= 40 && temp <= 60
  const hot = temp > 60
  const cold = temp < 40

  return (
    <div className="game-wrap" style={{ background: 'linear-gradient(160deg, #fee2e2, #fecaca 40%, #bae6fd)' }}>
      <GameShell gameId={gameId} onScoreUpdate={onScoreUpdate}>
        {(api) => (
          <>
            <div className="game-hint">Держи баланс «идеально»</div>
            <div className="game-stage" style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
              <div style={{ position: 'relative', paddingTop: 8 }}>
                {hot && (
                  <span style={{ position: 'absolute', top: -6, left: '10%', fontSize: 22, animation: 'flameFlicker 0.8s ease-in-out infinite' }}>🔥</span>
                )}
                <Thermometer temp={temp} />
                <div
                  style={{
                    textAlign: 'center',
                    marginTop: 10,
                    fontWeight: 800,
                    fontSize: 17,
                    color: hot ? '#dc2626' : cold ? '#2563eb' : '#16a34a',
                    transition: 'color 0.25s ease',
                  }}
                >
                  {Math.round(temp)}° — {right ? 'Идеально' : hot ? 'Горячо' : 'Холодно'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 14 }}>
                <button
                  type="button"
                  className="pill-btn cold"
                  onClick={() => {
                    setDrift('down')
                    api.add(right ? 2 : 0, 'tap')
                  }}
                >
                  <Snow /> Холод
                </button>
                <button
                  type="button"
                  className="pill-btn warm"
                  onClick={() => {
                    setDrift('up')
                    api.add(right ? 2 : 0, 'tap')
                  }}
                >
                  <Flame /> Тепло
                </button>
              </div>

              <div style={{ width: 'min(80%, 320px)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#475569', marginBottom: 6, fontWeight: 600 }}>
                  <span>Холодно</span>
                  <span>Идеально</span>
                  <span>Горячо</span>
                </div>
                <div style={{ height: 12, borderRadius: 999, background: 'linear-gradient(90deg,#93c5fd,#86efac,#f87171)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.15)' }}>
                  <div className="temp-indicator" style={{ position: 'relative', left: `${temp}%`, transform: 'translateX(-50%)', top: -3, width: 18, height: 18, borderRadius: '50%', background: '#fff', border: `3px solid ${hot ? '#ef4444' : cold ? '#60a5fa' : '#16a34a'}` }} />
                </div>
              </div>
            </div>
          </>
        )}
      </GameShell>
    </div>
  )
}