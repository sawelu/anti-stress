import { useEffect, useState } from 'react'
import { GameShell } from './GameShell'

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

  const right = (temp >= 40 && temp <= 60)

  return (
    <div className="game-wrap" style={{ background: 'linear-gradient(160deg, #fee2e2, #fecaca 50%, #bfdbfe)' }}>
      <GameShell gameId={gameId} onScoreUpdate={onScoreUpdate}>
        {(api) => (
          <>
            <div className="game-hint">Держи баланс 🌡️</div>
            <div className="game-stage" style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
              <div
                className="temp-circle"
                style={{
                  width: 170,
                  height: 170,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 30,
                  fontWeight: 700,
                  color: temp > 60 ? '#dc2626' : temp < 40 ? '#2563eb' : '#16a34a',
                  background: `radial-gradient(circle, ${temp > 60 ? 'rgba(248,113,113,0.4)' : temp < 40 ? 'rgba(147,197,253,0.4)' : 'rgba(134,239,172,0.4)'}, rgba(255,255,255,0.5))`,
                  border: `4px solid ${temp > 60 ? '#f87171' : temp < 40 ? '#93c5fd' : '#86efac'}`,
                  boxShadow: `0 0 60px ${temp > 60 ? 'rgba(248,113,113,0.4)' : temp < 40 ? 'rgba(147,197,253,0.5)' : 'rgba(134,239,172,0.4)'}`,
                  transition: 'all 0.2s ease',
                }}
              >
                {Math.round(temp)}°
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  type="button"
                  className="pill-btn warm"
                  onClick={() => {
                    setDrift('up')
                    api.add(right ? 2 : 0, 'tap')
                  }}
                >
                  🔥 Тепло
                </button>
                <button
                  type="button"
                  className="pill-btn cold"
                  onClick={() => {
                    setDrift('down')
                    api.add(right ? 2 : 0, 'tap')
                  }}
                >
                  ❄️ Холод
                </button>
              </div>

              <div style={{ width: 'min(75%, 300px)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 6 }}>
                  <span>Холодно</span>
                  <span>Идеально</span>
                  <span>Горячо</span>
                </div>
                <div style={{ height: 12, borderRadius: 999, background: 'linear-gradient(90deg,#93c5fd,#86efac,#f87171)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' }}>
                  <div className="temp-indicator" style={{ position: 'relative', left: `${temp}%`, transform: 'translateX(-50%)', top: -3, width: 18, height: 18, borderRadius: '50%', background: '#fff', border: '3px solid #64748b' }} />
                </div>
              </div>
            </div>
          </>
        )}
      </GameShell>
    </div>
  )
}