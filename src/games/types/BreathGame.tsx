import { useEffect, useState } from 'react'
import { GameShell } from './GameShell'

function GlassOrb({ size, phase }: { size: number; phase: 'inhale' | 'exhale' }) {
  const cool = phase === 'inhale'
  const main = cool ? '#7dd3fc' : '#c084fc'
  const deep = cool ? '#2563eb' : '#9333ea'
  return (
    <div style={{ position: 'relative', width: size, height: size, pointerEvents: 'none' }}>
      {/* expanding rings */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: `3px solid ${hex(main, 0.5)}`,
          animation: 'ringExpand 1.6s ease-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: `2px solid ${hex(main, 0.35)}`,
          animation: 'ringExpand 1.6s ease-out 0.5s infinite',
        }}
      />
      {/* vapor on exhale */}
      {!cool && (
        <>
          <span style={{ position: 'absolute', left: '30%', top: '8%', width: 16, height: 16, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.8), rgba(255,255,255,0))', animation: 'vaporUp 1.8s ease-out infinite' }} />
          <span style={{ position: 'absolute', left: '58%', top: '14%', width: 13, height: 13, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.7), rgba(255,255,255,0))', animation: 'vaporUp 2.1s ease-out 0.4s infinite' }} />
          <span style={{ position: 'absolute', left: '44%', top: '4%', width: 11, height: 11, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.75), rgba(255,255,255,0))', animation: 'vaporUp 1.5s ease-out 0.2s infinite' }} />
        </>
      )}
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <radialGradient id="orbGlass" cx="35%" cy="28%" r="80%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
            <stop offset="30%" stopColor={`rgba(255,255,255,0.35)`} />
            <stop offset="70%" stopColor={`${hex(main, 0.35)}`} />
            <stop offset="100%" stopColor={`${hex(deep, 0.55)}`} />
          </radialGradient>
          <radialGradient id="orbMist" cx="50%" cy="60%" r="60%">
            <stop offset="0%" stopColor={`rgba(255,255,255,0.65)`} />
            <stop offset="60%" stopColor={`${hex(main, 0.5)}`} />
            <stop offset="100%" stopColor={`${hex(main, 0)}`} />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#orbGlass)" />
        <circle cx="50" cy="56" r="34" fill="url(#orbMist)" />
        <ellipse cx="34" cy="28" rx="14" ry="9" fill="rgba(255,255,255,0.95)" transform="rotate(-26 34 28)" />
        <ellipse cx="63" cy="72" rx="6" ry="4" fill="rgba(255,255,255,0.45)" transform="rotate(18 63 72)" />
        <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
      </svg>
    </div>
  )
}

function hex(color: string, alpha: number) {
  const num = parseInt(color.slice(1), 16)
  const r = (num >> 16) & 255
  const g = (num >> 8) & 255
  const b = num & 255
  return `rgba(${r},${g},${b},${alpha})`
}

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
    <div className="game-wrap" style={{ background: 'linear-gradient(160deg, #e0f2fe, #cffafe 45%, #e9d5ff)' }}>
      <GameShell gameId={gameId} onScoreUpdate={onScoreUpdate}>
        {(api) => (
          <>
            <div className="game-hint" style={{ color: '#4c1d95' }}>Тапай в ритм дыхания 🌬️</div>
            <div
              className="game-stage"
              onClick={() => api.add(inZone ? 2 : 0, inZone ? 'breath' : 'tick')}
              style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, cursor: 'pointer', background: 'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.6), rgba(186,230,253,0.25) 60%, transparent 75%)' }}
            >
              <div
                style={{
                  width: 110 + size * 1.6,
                  height: 110 + size * 1.6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'width 0.04s linear, height 0.04s linear, filter 0.3s ease',
                  filter: `drop-shadow(0 18px 34px ${hex(phase === 'inhale' ? '#0ea5e9' : '#a855f7', 0.45)})`,
                }}
              >
                <GlassOrb size={Math.min(100 + size * 1.4, 240)} phase={phase} />
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