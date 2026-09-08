import { useState } from 'react'
import { GameShell } from './GameShell'

const NOTES = ['🎵', '🎶', '🎼', '🎹', '🎻']

export default function KeysGame({ gameId, onScoreUpdate }: { gameId: string; onScoreUpdate: (best: number) => void }) {
  const [active, setActive] = useState(0)

  return (
    <div className="game-wrap" style={{ background: 'linear-gradient(160deg, #1c1917, #292524 50%, #3f3f46)' }}>
      <GameShell gameId={gameId} onScoreUpdate={onScoreUpdate}>
        {(api) => (
          <>
            <div className="game-hint" style={{ color: '#fbbf24' }}>Нажимай клавиши по порядку 🎹</div>
            <div className="game-stage" style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26 }}>
              <div className="keyboard" style={{ display: 'flex', gap: 14 }}>
                {NOTES.map((note, i) => {
                  const isActive = i === active
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        if (isActive) {
                          api.add(5, 'piano')
                          setActive((active + 1) % NOTES.length)
                        } else {
                          api.play('tick')
                          setActive(i)
                        }
                      }}
                      className="piano-key"
                      style={{
                        width: 62,
                        height: 96,
                        borderRadius: 14,
                        border: isActive ? '3px solid #fbbf24' : '2px solid rgba(255,255,255,0.15)',
                        fontSize: 28,
                        background: isActive
                          ? 'linear-gradient(180deg, #fde68a, #f59e0b)'
                          : 'linear-gradient(180deg, #52525b, #3f3f46)',
                        boxShadow: isActive
                          ? '0 6px 24px rgba(251,191,36,0.5), inset 0 2px 8px rgba(255,255,255,0.4)'
                          : '0 4px 14px rgba(0,0,0,0.4)',
                        transform: isActive ? 'translateY(-6px)' : 'translateY(0)',
                        transition: 'all 0.18s ease',
                        cursor: 'pointer',
                      }}
                    >
                      {note}
                    </button>
                  )
                })}
              </div>
              <div className="next-key" style={{ fontSize: 14, fontWeight: 600, color: '#fbbf24', background: 'rgba(251,191,36,0.12)', padding: '10px 22px', borderRadius: 999, border: '1px solid rgba(251,191,36,0.35)' }}>
                Следующая: {NOTES[active]}
              </div>
            </div>
          </>
        )}
      </GameShell>
    </div>
  )
}