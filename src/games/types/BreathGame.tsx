import { useEffect, useState } from 'react'
import { GameShell } from './GameShell'

export default function BreathGame({ gameId, onScoreUpdate }: { gameId: string; onScoreUpdate: (best: number) => void }) {
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale')
  const [size, setSize] = useState(40)

  useEffect(() => {
    const t = window.setInterval(() => {
      setSize((s) => {
        const next = phase === 'inhale' ? s + 1.5 : s - 1.5
        if (phase === 'inhale' && next >= 100) {
          setPhase('exhale')
          return 100
        }
        if (phase === 'exhale' && next <= 40) {
          setPhase('inhale')
          return 40
        }
        return next
      })
    }, 40)
    return () => window.clearInterval(t)
  }, [phase])

  const inZone = (phase === 'inhale' && size > 80) || (phase === 'exhale' && size < 60)

  return (
    <div className="game-wrap" style={{ background: 'linear-gradient(160deg, #e0f2fe, #bae6fd 50%, #a5f3fc)' }}>
      <GameShell gameId={gameId} onScoreUpdate={onScoreUpdate}>
        {(api) => (
          <>
            <div className="game-hint" style={{ color: '#0e7490' }}>Тапай в ритм дыхания 🫁</div>
            <div
              className="game-stage"
              onClick={() => api.add(inZone ? 2 : 0, inZone ? 'breath' : 'tick')}
              style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, cursor: 'pointer' }}
            >
              <div
                className="breath-circle"
                style={{
                  width: 120 + size * 2,
                  height: 120 + size * 2,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#0e7490',
                  background: phase === 'inhale'
                    ? 'radial-gradient(circle, rgba(14,165,233,0.7), rgba(56,189,248,0.3))'
                    : 'radial-gradient(circle, rgba(125,211,252,0.5), rgba(165,243,252,0.25))',
                  boxShadow: phase === 'inhale'
                    ? `0 0 40px rgba(14,165,233,0.5), inset 0 0 30px rgba(255,255,255,0.4)`
                    : `0 0 30px rgba(56,189,248,0.35), inset 0 0 20px rgba(255,255,255,0.3)`,
                  transition: 'width 0.04s linear, height 0.04s linear, box-shadow 0.2s ease',
                }}
              >
                {phase === 'inhale' ? 'Вдох' : 'Выдох'}
              </div>
              <div className="pill-btn info" style={{ pointerEvents: 'none' }}>
                {phase === 'inhale' ? '🌊 Вдохни глубже' : '💨 Медленно выдохни'}
              </div>
            </div>
          </>
        )}
      </GameShell>
    </div>
  )
}