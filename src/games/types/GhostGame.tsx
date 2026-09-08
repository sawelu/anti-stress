import { useState } from 'react'
import { GameShell } from './GameShell'

type Orb = { id: number; x: number; y: number; r: number }

export default function GhostGame({ gameId, onScoreUpdate }: { gameId: string; onScoreUpdate: (best: number) => void }) {
  const [orbs, setOrbs] = useState<Orb[]>(() =>
    Array.from({ length: 7 }, (_, i) => ({
      id: i,
      x: Math.random() * 70 + 15,
      y: Math.random() * 60 + 20,
      r: 30 + Math.random() * 26,
    })),
  )

  return (
    <div className="game-wrap" style={{ background: 'linear-gradient(160deg, #1e1b4b, #0f172a 60%, #111827)' }}>
      <GameShell gameId={gameId} onScoreUpdate={onScoreUpdate}>
        {(api) => (
          <>
            <div className="game-hint" style={{ color: '#c4b5fd' }}>Собирай мягкое эхо 👻</div>
            <div className="game-stage" style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 70%, rgba(99,102,241,0.15), transparent 50%)', pointerEvents: 'none' }} />
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
                    width: o.r * 2,
                    height: o.r * 2,
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    border: '2px solid rgba(196,181,253,0.5)',
                    background: 'radial-gradient(circle, rgba(167,139,250,0.5), rgba(99,102,241,0.15) 70%, transparent)',
                    boxShadow: '0 0 34px rgba(167,139,250,0.4), inset 0 0 24px rgba(196,181,253,0.3)',
                    animation: 'orbFloat 3.2s ease-in-out infinite',
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