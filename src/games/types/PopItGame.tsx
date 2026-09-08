import { useMemo, useState } from 'react'
import { GameShell } from './GameShell'

const ROWS = 4
const COLS = 5
const COLORS = ['#f472b6', '#a78bfa', '#60a5fa', '#34d399', '#fbbf24']

type Cell = { id: number; popped: boolean }

export default function PopItGame({ gameId, onScoreUpdate }: { gameId: string; onScoreUpdate: (best: number) => void }) {
  const initial = useMemo(() => Array.from({ length: ROWS * COLS }, (_, i) => ({ id: i, popped: false })), [])
  const [cells, setCells] = useState<Cell[]>(() => initial)

  return (
    <div className="game-wrap" style={{ background: 'linear-gradient(160deg, #fef9c3, #fde68a 50%, #fcd34d)' }}>
      <GameShell gameId={gameId} onScoreUpdate={onScoreUpdate}>
        {(api) => (
          <>
            <div className="game-hint" style={{ color: '#92400e' }}>Жми пупырки 👆</div>
            <div className="game-stage" style={{ alignItems: 'center', justifyContent: 'center' }}>
              <div
                className="popit-board"
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                  gap: 12,
                  padding: 18,
                  borderRadius: 28,
                  background: 'linear-gradient(145deg, #fde68a, #f59e0b)',
                  boxShadow: 'inset 0 4px 20px rgba(255,255,255,0.6), inset 0 -4px 12px rgba(180,140,60,0.3), 0 14px 40px rgba(217,119,6,0.35)',
                }}
              >
                {cells.map((cell, idx) => (
                  <button
                    key={cell.id}
                    type="button"
                    onPointerDown={() => {
                      if (cell.popped) {
                        api.play('pop')
                        return
                      }
                      setCells((prev) => prev.map((c) => (c.id === cell.id ? { ...c, popped: true } : c)))
                      api.add(2, 'pop')
                    }}
                    className="popit-cell"
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      transform: cell.popped ? 'translateY(4px) scale(0.94)' : 'translateY(0) scale(1)',
                      background: cell.popped
                        ? `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.85), ${COLORS[idx % COLORS.length]} 70%)`
                        : `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0.45) 55%, rgba(200,160,60,0.2) 85%)`,
                      boxShadow: cell.popped
                        ? `inset 0 5px 10px rgba(0,0,0,0.2)`
                        : `inset 0 -4px 8px rgba(180,140,60,0.25), 0 6px 14px rgba(0,0,0,0.15)`,
                    }}
                  />
                ))}
              </div>
              <button
                type="button"
                className="popit-reset"
                onClick={() => {
                  setCells(initial)
                  api.play('success')
                }}
              >
                Сброс 🔄
              </button>
            </div>
          </>
        )}
      </GameShell>
    </div>
  )
}