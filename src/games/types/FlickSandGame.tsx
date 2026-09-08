import { useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { GameShell } from './GameShell'
import type { GameApi } from './GameShell'

type Grain = { id: number; x: number; y: number; tone: number; rot: number }

const SAND_TONES = ['#f2d08a', '#e4b76a', '#d8a657', '#c9944a', '#b8823f', '#e9c67f']

export default function FlickSandGame({ gameId, onScoreUpdate }: { gameId: string; onScoreUpdate: (best: number) => void }) {
  const [grains, setGrains] = useState<Grain[]>([])
  const idRef = useRef(0)

  const flick = (e: PointerEvent<HTMLDivElement>, api: GameApi) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setGrains((g) => {
      const batch = Array.from({ length: 3 }, () => ({
        id: ++idRef.current,
        x: x + (Math.random() - 0.5) * 6,
        y: y + (Math.random() - 0.5) * 6,
        tone: Math.floor(Math.random() * SAND_TONES.length),
        rot: Math.random() * 360,
      }))
      const next = [...g, ...batch].slice(-110)
      if (next.length % 12 === 0) api.add(1, 'sand')
      return next
    })
  }

  return (
    <div className="game-wrap" style={{ background: 'linear-gradient(175deg, #fde9c2 0%, #f6d698 55%, #efc274 100%)' }}>
      <GameShell gameId={gameId} onScoreUpdate={onScoreUpdate}>
        {(api) => (
          <>
            <div className="game-hint" style={{ color: '#92541c' }}>Сыпь песок пальцем 🏖️</div>
            <div
              className="game-stage"
              onPointerDown={(e) => flick(e, api)}
              onPointerMove={(e) => e.buttons === 1 && flick(e, api)}
              style={{ position: 'relative', touchAction: 'none', cursor: 'grab', overflow: 'hidden' }}
            >
              {/* sunlight */}
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 42% 22%, rgba(255,255,255,0.7), transparent 48%)', pointerEvents: 'none' }} />
              {/* dunes */}
              <svg style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', height: '58%', pointerEvents: 'none' }} viewBox="0 0 400 140" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="duneA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f6dfa4" />
                    <stop offset="60%" stopColor="#efcd84" />
                    <stop offset="100%" stopColor="#e2b367" />
                  </linearGradient>
                </defs>
                {/* far ridge */}
                <path d="M0 80 Q 60 52 120 66 T 260 60 Q 340 52 400 64 L 400 140 L 0 140 Z" fill="#efcf8f" />
                {/* near dune */}
                <path d="M0 108 Q 70 78 150 92 T 330 88 Q 380 86 400 92 L 400 140 L 0 140 Z" fill="url(#duneA)" />
                {/* dune shadow edge */}
                <path d="M0 108 Q 70 78 150 92 T 330 88 Q 380 86 400 92" fill="none" stroke="rgba(160,110,50,0.35)" strokeWidth="3" />
                {/* ripple lines */}
                <g stroke="rgba(160,110,50,0.25)" fill="none" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M0 122 Q 60 114 120 120 T 240 118 T 400 120" />
                  <path d="M0 132 Q 80 124 160 130 T 400 128" />
                </g>
              </svg>
              {/* grains */}
              {grains.map((gr) => (
                <div
                  key={gr.id}
                  className="sand-grain"
                  style={{
                    position: 'absolute',
                    left: `${gr.x}%`,
                    top: `${gr.y}%`,
                    width: 10,
                    height: 8,
                    transform: `translate(-50%, -50%) rotate(${gr.rot}deg)`,
                    borderRadius: '58% 42% 55% 45% / 48% 55% 45% 52%',
                    background: `radial-gradient(circle at 32% 26%, rgba(255,255,255,0.9), ${SAND_TONES[gr.tone]} 55%, rgba(120,80,35,0.85))`,
                    boxShadow: '0 2px 3px rgba(90,60,20,0.35)',
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