import { useState } from 'react'
import { GameShell } from './GameShell'

type Star = { id: number; x: number; y: number; size: number; phase: number }

export default function LullabyGame({ gameId, onScoreUpdate }: { gameId: string; onScoreUpdate: (best: number) => void }) {
  const [stars, setStars] = useState<Star[]>(() =>
    Array.from({ length: 16 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 10,
      size: 6 + Math.random() * 8,
      phase: Math.random() * 100,
    })),
  )

  return (
    <div className="game-wrap" style={{ background: 'linear-gradient(180deg, #0b1026, #1e1b4b 55%, #2e1065)' }}>
      <GameShell gameId={gameId} onScoreUpdate={onScoreUpdate}>
        {(api) => (
          <>
            <div className="game-hint" style={{ color: '#e9d5ff' }}>Коснись звёздочек 🌙</div>
            <div className="game-stage" style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 75% 20%, rgba(168,85,247,0.18), transparent 45%)', pointerEvents: 'none' }} />
              <div className="lullaby-moon" style={{ position: 'absolute', right: '8%', top: '8%', width: 54, height: 54, borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, #fef9c3, #fde68a)', boxShadow: '0 0 50px rgba(253,230,138,0.7), 0 0 90px rgba(253,230,138,0.3)', pointerEvents: 'none' }} />
              {stars.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setStars((prev) => prev.map((x) => (x.id === s.id ? { ...x, phase: x.phase + 60 } : x)))
                    api.add(2, 'musicbox')
                  }}
                  className="lullaby-star"
                  style={{
                    position: 'absolute',
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                    width: s.size,
                    height: s.size,
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    border: 'none',
                    background: 'radial-gradient(circle, #fffbe6, #fde68a)',
                    boxShadow: `0 0 ${s.size * 2.5}px ${s.size * 0.6}px rgba(255,240,180,${0.4 + s.phase / 200})`,
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>
          </>
        )}
      </GameShell>
    </div>
  )
}