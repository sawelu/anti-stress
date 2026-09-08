import { useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { GameShell } from './GameShell'
import type { GameApi } from './GameShell'

type Grain = { id: number; x: number; y: number }

export default function FlickSandGame({ gameId, onScoreUpdate }: { gameId: string; onScoreUpdate: (best: number) => void }) {
  const [grains, setGrains] = useState<Grain[]>([])
  const idRef = useRef(0)

  const flick = (e: PointerEvent<HTMLDivElement>, api: GameApi) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setGrains((g) => {
      const batch = Array.from({ length: 3 }, () => ({ id: ++idRef.current, x: x + (Math.random() - 0.5) * 6, y: y + (Math.random() - 0.5) * 6 }))
      const next = [...g, ...batch].slice(-120)
      if (next.length % 12 === 0) api.add(1, 'sand')
      return next
    })
  }

  return (
    <div className="game-wrap" style={{ background: 'linear-gradient(160deg, #fef3c7, #fde68a 50%, #f8c471)' }}>
      <GameShell gameId={gameId} onScoreUpdate={onScoreUpdate}>
        {(api) => (
          <>
            <div className="game-hint" style={{ color: '#92400e' }}>Сыпь песок пальцем 🏖️</div>
            <div
              className="game-stage"
              onPointerDown={(e) => flick(e, api)}
              onPointerMove={(e) => e.buttons === 1 && flick(e, api)}
              style={{ position: 'relative', touchAction: 'none', cursor: 'grab' }}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 40% 30%, rgba(255,255,255,0.5), transparent 50%)', pointerEvents: 'none' }} />
              {grains.map((gr) => (
                <div
                  key={gr.id}
                  className="sand-grain"
                  style={{
                    position: 'absolute',
                    left: `${gr.x}%`,
                    top: `${gr.y}%`,
                    width: 9,
                    height: 9,
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: `radial-gradient(circle, rgba(217,166,86,0.95), rgba(144,102,47,0.75))`,
                    boxShadow: '0 2px 6px rgba(120,80,30,0.25)',
                    pointerEvents: 'none',
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