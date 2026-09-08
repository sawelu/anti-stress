import { useState } from 'react'
import { GameShell } from './GameShell'
import type { GameApi } from './GameShell'

type Tile = { id: number; color: string; matched: boolean }

function makeTiles(): Tile[] {
  const colors = ['#f472b6', '#a78bfa', '#60a5fa', '#34d399', '#fbbf24', '#f87171', '#2dd4bf', '#fb923c']
  const pairs = [...colors, ...colors]
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = pairs[i]!
    pairs[i] = pairs[j]!
    pairs[j] = tmp
  }
  return pairs.map((color, id) => ({ id, color, matched: false }))
}

function flip(tiles: Tile[], setTiles: React.Dispatch<React.SetStateAction<Tile[]>>, open: number[], setOpen: React.Dispatch<React.SetStateAction<number[]>>, id: number, api: GameApi) {
  const tile = tiles.find((t) => t.id === id)
  if (!tile || tile.matched) return

  const nextOpen = open.includes(id) ? open.filter((o) => o !== id) : [...open, id]

  if (nextOpen.length === 2) {
    const [a, b] = nextOpen
    const ta = tiles.find((t) => t.id === a)!
    const tb = tiles.find((t) => t.id === b)!
    if (ta.color === tb.color) {
      setTiles((prev) => prev.map((t) => (t.id === a || t.id === b ? { ...t, matched: true } : t)))
      setOpen([])
      api.add(3, 'success')
    } else {
      setOpen(nextOpen)
      window.setTimeout(() => setOpen([]), 500)
    }
  } else {
    setOpen(nextOpen)
    api.add(1, 'tap')
  }
}

export default function MosaicGame({ gameId, onScoreUpdate }: { gameId: string; onScoreUpdate: (best: number) => void }) {
  const [tiles, setTiles] = useState<Tile[]>(makeTiles)
  const [open, setOpen] = useState<number[]>([])

  return (
    <div className="game-wrap" style={{ background: 'linear-gradient(160deg, #fdf4ff, #fae8ff 50%, #ede9fe)' }}>
      <GameShell gameId={gameId} onScoreUpdate={onScoreUpdate}>
        {(api) => (
          <>
            <div className="game-hint">Найди пары 🎨</div>
            <div className="game-stage" style={{ alignItems: 'center', justifyContent: 'center' }}>
              <div
                className="mosaic-board"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 10,
                  width: 'min(92%, 360px)',
                  padding: 14,
                  borderRadius: 24,
                  background: 'rgba(255,255,255,0.55)',
                  boxShadow: '0 16px 50px rgba(168,85,247,0.15)',
                }}
              >
                {tiles.map((t) => {
                  const isOpen = open.includes(t.id)
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => flip(tiles, setTiles, open, setOpen, t.id, api)}
                      style={{
                        aspectRatio: '1',
                        borderRadius: 16,
                        border: 'none',
                        cursor: 'pointer',
                        background: t.matched
                          ? t.color
                          : isOpen
                          ? `radial-gradient(circle at 30% 30%, ${t.color}cc, ${t.color})`
                          : 'linear-gradient(145deg, #f5d0fe, #e9d5ff)',
                        boxShadow: t.matched
                          ? 'inset 0 -4px 0 rgba(0,0,0,0.15)'
                          : isOpen
                          ? '0 6px 20px rgba(168,85,247,0.35)'
                          : 'inset 0 -6px 12px rgba(168,85,247,0.25), 0 6px 16px rgba(168,85,247,0.12)',
                        transform: isOpen ? 'scale(0.94)' : 'scale(1)',
                        transition: 'all 0.2s ease',
                      }}
                    />
                  )
                })}
              </div>
            </div>
          </>
        )}
      </GameShell>
    </div>
  )
}