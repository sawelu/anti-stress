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

function GlassTile({ color, face }: { color: string; face: 'back' | 'face' | 'done' }) {
  const faceColor = color
  let inner: React.ReactNode
  if (face === 'back') {
    inner = (
      <>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            background:
              'linear-gradient(150deg, #ffffff 0%, #e9e4f8 38%, #d9d2ef 62%, #c9bfe6 100%)',
            boxShadow:
              'inset 0 1px 0 #fff, inset 0 -5px 9px rgba(120,100,180,0.3), 0 6px 14px rgba(130,110,190,0.18)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            background: 'repeating-linear-gradient(-45deg, rgba(255,255,255,0.55) 0 10px, rgba(160,140,220,0.12) 10px 22px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '18%',
            top: '14%',
            width: '30%',
            height: '22%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.95), rgba(255,255,255,0))',
          }}
        />
      </>
    )
  } else {
    inner = (
      <>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            background: `radial-gradient(circle at 32% 26%, #ffffff 0%, ${faceColor} 58%, #00000055 100%)`,
            boxShadow:
              'inset 0 2px 2px rgba(255,255,255,0.9), inset 0 -6px 10px rgba(0,0,0,0.28), 0 7px 16px rgba(0,0,0,0.18)',
          }}
        />
        {/* face bevel */}
        <div
          style={{
            position: 'absolute',
            inset: '14%',
            borderRadius: '40%',
            background: `linear-gradient(160deg, ${faceColor}66, transparent 60%)`,
            filter: 'blur(1px)',
          }}
        />
        {/* gloss streak */}
        <div
          style={{
            position: 'absolute',
            left: '6%',
            top: '5%',
            right: '20%',
            bottom: '65%',
            borderRadius: '3px',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0))',
            transform: 'rotate(-18deg)',
            transformOrigin: 'left top',
          }}
        />
      </>
    )
  }
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {inner}
      {face === 'done' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            background: 'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.35), transparent 60%)',
          }}
        />
      )}
    </div>
  )
}

export default function MosaicGame({ gameId, onScoreUpdate }: { gameId: string; onScoreUpdate: (best: number) => void }) {
  const [tiles, setTiles] = useState<Tile[]>(makeTiles)
  const [open, setOpen] = useState<number[]>([])

  return (
    <div className="game-wrap" style={{ background: 'linear-gradient(160deg, #f5f3ff, #ede9fe 50%, #e0e7ff)' }}>
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
                  gap: 12,
                  width: 'min(92%, 360px)',
                  padding: 16,
                  borderRadius: 26,
                  background: 'linear-gradient(160deg, #e0e7ff, #c7d2fe 70%, #a5b4fc)',
                  boxShadow: 'inset 0 2px 2px rgba(255,255,255,0.7), inset 0 -6px 14px rgba(90,80,160,0.3), 0 18px 44px rgba(120,100,220,0.3)',
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
                        borderRadius: 18,
                        border: 'none',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                        transform: isOpen || t.matched ? 'scale(0.96)' : 'scale(1)',
                        filter: t.matched ? 'drop-shadow(0 6px 14px rgba(120,80,220,0.4))' : isOpen ? 'drop-shadow(0 8px 18px rgba(110,90,220,0.4))' : 'none',
                        transition: 'transform 0.2s ease, filter 0.2s ease',
                      }}
                    >
                      {t.matched ? <GlassTile color={t.color} face="face" /> : isOpen ? <GlassTile color={t.color} face="face" /> : <GlassTile color={t.color} face="back" />}
                      {isOpen && (
                        <div
                          style={{
                            position: 'absolute',
                            inset: -2,
                            borderRadius: 20,
                            boxShadow: '0 0 0 2px rgba(255,255,255,0.9) inset',
                            pointerEvents: 'none',
                          }}
                        />
                      )}
                      {t.matched && (
                        <div
                          style={{
                            position: 'absolute',
                            inset: -2,
                            borderRadius: 20,
                            boxShadow: '0 0 0 2px rgba(255,255,255,0.7) inset',
                            pointerEvents: 'none',
                            animation: 'mistPulse 1.6s ease-in-out infinite',
                          }}
                        />
                      )}
                    </button>
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