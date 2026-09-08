import { useState } from 'react'
import { GameShell } from './GameShell'

const NOTES = ['До', 'Ре', 'Ми', 'Фа', 'Соль']
const BLACKS: { label: string; x: number }[] = [
  { label: 'До♯', x: 1 },
  { label: 'Ре♯', x: 2 },
  { label: 'Фа♯', x: 4 },
  { label: 'Соль♯', x: 5 },
]

export default function KeysGame({ gameId, onScoreUpdate }: { gameId: string; onScoreUpdate: (best: number) => void }) {
  const [active, setActive] = useState(0)

  return (
    <div className="game-wrap" style={{ background: 'linear-gradient(165deg, #0f0e14, #1c1a22 50%, #2a2530)' }}>
      <GameShell gameId={gameId} onScoreUpdate={onScoreUpdate}>
        {(api) => (
          <>
            <div className="game-hint" style={{ color: '#fbbf24', borderColor: 'rgba(251,191,36,0.35)', background: 'rgba(30,27,45,0.7)' }}>Нажимай клавиши по порядку 🎹</div>
            <div className="game-stage" style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26, background: 'radial-gradient(circle at 50% 30%, rgba(80,60,120,0.35), transparent 60%)' }}>
              <div className="keyboard" style={{ position: 'relative', display: 'flex', gap: 6, padding: 14, borderRadius: 18, background: 'linear-gradient(180deg, #2e2a36, #16121c)', boxShadow: '0 24px 60px rgba(0,0,0,0.6), inset 0 2px 2px rgba(255,255,255,0.12), inset 0 -8px 16px rgba(0,0,0,0.5)' }}>
                {NOTES.map((_note, i) => {
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
                        width: 58,
                        height: 100,
                        borderRadius: 8,
                        border: 'none',
                        position: 'relative',
                        background: isActive
                          ? 'linear-gradient(180deg, #fffbe8 0%, #fde68a 55%, #fbbf24 100%)'
                          : 'linear-gradient(180deg, #ffffff 0%, #f4f1ea 70%, #dcd8ce 100%)',
                        boxShadow: isActive
                          ? '0 0 26px rgba(251,191,36,0.55), inset 0 -8px 14px rgba(217,150,20,0.35), inset 0 3px 3px #ffffff'
                          : '0 6px 12px rgba(0,0,0,0.45), inset 0 3px 3px #ffffff, inset 0 -8px 14px rgba(180,175,160,0.5)',
                        transform: isActive ? 'translateY(5px)' : 'translateY(0)',
                        transition: 'transform 0.09s ease, background 0.2s ease, box-shadow 0.2s ease',
                        cursor: 'pointer',
                      }}
                    />
                  )
                })}
                {/* black keys */}
                {BLACKS.map((bk) => (
                  <button
                    key={bk.label}
                    type="button"
                    onClick={() => {
                      api.play('tick')
                      setActive(bk.x >= NOTES.length ? NOTES.length - 1 : bk.x)
                    }}
                    style={{
                      position: 'absolute',
                      zIndex: 3,
                      left: `${bk.x * 64 - 18}px`,
                      top: 14,
                      width: 26,
                      height: 62,
                      borderRadius: '0 0 6px 6px',
                      border: '1px solid #000',
                      background: 'linear-gradient(180deg, #0a0a0e 0%, #23232c 60%, #101016 100%)',
                      boxShadow: '0 5px 8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -6px 8px rgba(0,0,0,0.6)',
                      cursor: 'pointer',
                    }}
                  />
                ))}
                {/* gloss bar */}
                <div style={{ position: 'absolute', left: 14, right: 14, top: 16, height: 10, borderRadius: 999, background: 'linear-gradient(180deg, rgba(255,255,255,0.25), rgba(255,255,255,0))', pointerEvents: 'none' }} />
              </div>
              <div className="next-key" style={{ fontSize: 14, fontWeight: 700, color: '#fbbf24', background: 'rgba(251,191,36,0.12)', padding: '10px 22px', borderRadius: 999, border: '1px solid rgba(251,191,36,0.35)' }}>
                Следующая: {NOTES[active]}
              </div>
            </div>
          </>
        )}
      </GameShell>
    </div>
  )
}