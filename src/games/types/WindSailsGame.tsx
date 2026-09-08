import { useState } from 'react'
import type { PointerEvent } from 'react'
import { GameShell } from './GameShell'
import type { GameApi } from './GameShell'

export default function WindSailsGame({ gameId, onScoreUpdate }: { gameId: string; onScoreUpdate: (best: number) => void }) {
  const [angle, setAngle] = useState(0)

  const steer = (e: PointerEvent<HTMLDivElement>, api: GameApi) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const nx = (x - 50) / 50
    const nextAngle = Math.max(-45, Math.min(45, nx * 45))
    setAngle(nextAngle)
    if (Math.abs(nextAngle) < 15) {
      api.add(0.5, 'wind')
    }
  }

  return (
    <div className="game-wrap" style={{ background: 'linear-gradient(160deg, #cffafe, #a5f3fc 50%, #7dd3fc)' }}>
      <GameShell gameId={gameId} onScoreUpdate={onScoreUpdate}>
        {(api) => (
          <>
            <div className="game-hint" style={{ color: '#155e75' }}>Держи парус по центру 🪁</div>
            <div
              className="game-stage"
              onPointerMove={(e) => e.buttons === 1 && steer(e, api)}
              onPointerDown={(e) => steer(e, api)}
              style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, touchAction: 'none', cursor: 'grab' }}
            >
              <div className="sail-boat" style={{ position: 'relative', width: 170, height: 200 }}>
                <div style={{ position: 'absolute', left: 80, top: 30, width: 6, height: 120, borderRadius: 3, background: 'linear-gradient(#b45309,#92400e)' }} />
                <div
                  className="sail"
                  style={{
                    position: 'absolute',
                    left: 88,
                    top: 34,
                    width: 74,
                    height: 92,
                    transformOrigin: 'left top',
                    transform: `rotate(${angle}deg)`,
                    background: 'linear-gradient(135deg, #ffffff, #fde68a)',
                    borderRadius: '4px 24px 16px 4px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                    transition: 'transform 0.15s ease',
                  }}
                />
                <div className="wave" style={{ position: 'absolute', left: 20, bottom: 8, right: 20, height: 26, borderRadius: '50%', background: 'linear-gradient(180deg,#bae6fd,#38bdf8)', boxShadow: 'inset 0 -6px 12px rgba(14,165,233,0.3)' }} />
              </div>
              <div className="sail-status" style={{ fontSize: 13, fontWeight: 600, color: Math.abs(angle) < 15 ? '#15803d' : '#b91c1c' }}>
                {Math.abs(angle) < 15 ? 'Ветер попутный ✅' : 'Настрой угол 🌀'}
              </div>
              <div style={{ width: 'min(75%, 280px)', height: 10, borderRadius: 999, background: 'rgba(255,255,255,0.6)', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '50%', top: -4, width: 2, height: 18, background: '#33415566' }} />
                <div className="angle-marker" style={{ position: 'absolute', left: '50%', top: -4, width: 16, height: 16, borderRadius: '50%', background: '#0e7490', transform: `translateX(calc(-50% + ${angle * 3}px))`, transition: 'transform 0.15s ease' }} />
              </div>
            </div>
          </>
        )}
      </GameShell>
    </div>
  )
}