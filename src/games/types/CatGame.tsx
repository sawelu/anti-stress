import { useEffect, useState } from 'react'
import { GameShell } from './GameShell'

const FACES = {
  happy: '😸',
  neutral: '😺',
  sleepy: '😴',
  love: '😻',
} as const

type Mood = 'happy' | 'neutral' | 'sleepy' | 'love'

export default function CatGame({ gameId, onScoreUpdate }: { gameId: string; onScoreUpdate: (best: number) => void }) {
  const [mood, setMood] = useState(55)
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([])

  useEffect(() => {
    const t = window.setInterval(() => setMood((m) => Math.max(0, m - 2)), 500)
    return () => window.clearInterval(t)
  }, [])

  const level: Mood = mood > 72 ? 'happy' : mood > 45 ? 'neutral' : mood > 20 ? 'sleepy' : 'love'

  const pet = () => {
    setMood((m) => Math.min(100, m + 6))
    setHearts((h) => [...h.slice(-4), { id: Date.now(), x: Math.random() * 70 + 15, y: Math.random() * 30 + 10 }])
  }

  const barColor = mood > 60 ? 'linear-gradient(90deg,#34d399,#10b981)' : mood > 30 ? 'linear-gradient(90deg,#fbbf24,#f59e0b)' : 'linear-gradient(90deg,#f87171,#ef4444)'

  return (
    <div
      className="game-wrap"
      style={{
        background: 'linear-gradient(160deg, #fce7f3, #fbcfe8 45%, #f9a8d4)',
      }}
    >
      <GameShell gameId={gameId} onScoreUpdate={onScoreUpdate}>
        {(api) => (
          <>
            <div className="game-hint" style={{ color: '#9d174d' }}>Гладь котика 🐱</div>
            <div className="game-stage" style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
              <div className="cat-halo" style={{ position: 'relative' }}>
                {hearts.map((h) => (
                  <span
                    key={h.id}
                    className="cat-heart"
                    style={{
                      position: 'absolute',
                      left: `${h.x}%`,
                      top: `${h.y}%`,
                      fontSize: 26,
                      color: '#ec4899',
                    }}
                  >
                    ♥
                  </span>
                ))}
                <div
                  onClick={() => {
                    pet()
                    api.add(2, 'meow')
                  }}
                  className="cat-face"
                  style={{
                    width: 190,
                    height: 190,
                    borderRadius: 44,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 92,
                    background: level === 'sleepy' ? 'linear-gradient(145deg,#e0e7ff,#c7d2fe)' : 'linear-gradient(145deg,#fef3c7,#fde68a)',
                    boxShadow: '0 18px 50px rgba(217,119,6,0.3), inset 0 6px 24px rgba(255,255,255,0.8), inset 0 -6px 14px rgba(180,120,60,0.2)',
                    transform: level === 'happy' ? 'scale(1.03)' : 'scale(1)',
                    cursor: 'pointer',
                  }}
                >
                  {FACES[level]}
                </div>
              </div>
              <div className="cat-bar" style={{ width: 'min(70%, 280px)', textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#9d174d', marginBottom: 8 }}>Счастье</div>
                <div className="mood-track" style={{ height: 16, borderRadius: 999, overflow: 'hidden', background: 'rgba(255,255,255,0.6)', border: '2px solid rgba(255,255,255,0.8)', boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.1)' }}>
                  <div className="mood-fill" style={{ height: '100%', width: `${mood}%`, background: barColor, transition: 'width 0.3s ease' }} />
                </div>
              </div>
            </div>
          </>
        )}
      </GameShell>
    </div>
  )
}