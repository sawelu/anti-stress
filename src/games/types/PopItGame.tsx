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
    <div className="game-wrap" style={{ background: 'linear-gradient(160deg, #fef9c3, #fde68a 50%, #fbbf24)' }}>
      <GameShell gameId={gameId} onScoreUpdate={onScoreUpdate}>
        {(api) => (
          <>
            <div className="game-hint" style={{ color: '#92400e' }}>Жми пупырки 👆</div>
            <div className="game-stage" style={{ alignItems: 'center', justifyContent: 'center' }}>
              <div className="popit-board" style={{ position: 'relative' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                    gap: 13,
                    padding: 20,
                    borderRadius: 30,
                    background: 'linear-gradient(165deg, #fde68a 0%, #f6b53f 55%, #e0901e 100%)',
                    boxShadow:
                      'inset 0 3px 2px rgba(255,255,255,0.8), inset 0 -10px 18px rgba(160,110,30,0.55), inset 12px 14px 30px rgba(255,255,255,0.35), 0 22px 50px rgba(190,120,40,0.4)',
                    borderTop: '1px solid rgba(255,255,255,0.9)',
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
                        border: 'none',
                        transition: 'transform 0.12s ease',
                        transform: cell.popped ? 'translateY(5px) scale(0.93)' : 'translateY(0) scale(1)',
                        background: cell.popped
                          ? `radial-gradient(circle at 38% 32%, rgba(255,255,255,0.35), ${COLORS[idx % COLORS.length]} 62%, #c97fc0 100%)`
                          : `radial-gradient(circle at 32% 26%, #ffffff 0%, ${COLORS[idx % COLORS.length]} 62%, #c4a0d0 100%)`,
                        boxShadow: cell.popped
                          ? 'inset 0 6px 12px rgba(0,0,0,0.3), inset 0 -2px 4px rgba(255,255,255,0.25)'
                          : 'inset 0 -7px 10px rgba(0,0,0,0.28), inset 0 3px 3px rgba(255,255,255,0.95), 0 8px 16px rgba(120,70,20,0.4)',
                      }}
                    />
                  ))}
                </div>
                <div
                  className="popit-sheen"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 30,
                    background: 'linear-gradient(115deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0) 55%, rgba(255,255,255,0.25) 100%)',
                    pointerEvents: 'none',
                  }}
                />
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