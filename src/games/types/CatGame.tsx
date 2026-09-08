import { useEffect, useState } from 'react'
import { GameShell } from './GameShell'

type Mood = 'happy' | 'neutral' | 'sleepy' | 'love'

function EyeOpen({ cx }: { cx: number }) {
  return (
    <g>
      <ellipse cx={cx} cy={118} rx={21} ry={19} fill="#fffdf6" />
      <circle cx={cx} cy={119} r={13.5} fill="url(#catIris)" />
      <circle cx={cx} cy={119} r={13.5} fill="none" stroke="rgba(120,60,10,0.35)" strokeWidth="1" />
      <ellipse cx={cx} cy={119} rx={5.6} ry={15} fill="#26242b" />
      <circle cx={cx + 5} cy={112} r={3.4} fill="#fff" opacity="0.95" />
      <circle cx={cx - 3} cy={126} r={1.7} fill="#fff" opacity="0.7" />
      <path d={`M ${cx - 21} 111 Q ${cx} 96 ${cx + 21} 111`} stroke="#7a4a12" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d={`M ${cx - 20} 124 Q ${cx} 137 ${cx + 20} 124`} stroke="#c07a24" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </g>
  )
}

function EyeHalf({ cx }: { cx: number }) {
  return (
    <g>
      <ellipse cx={cx} cy={120} rx={21} ry={19} fill="#fffdf6" />
      <circle cx={cx} cy={124} r={13} fill="url(#catIris)" />
      <ellipse cx={cx} cy={124} rx={5.4} ry={14} fill="#26242b" />
      <circle cx={cx + 5} cy={117} r={3.2} fill="#fff" opacity="0.9" />
      <path d={`M ${cx - 22} 106 Q ${cx} 88 ${cx + 22} 106 Z`} fill="#f0a83c" stroke="#d98a26" strokeWidth="1.5" />
      <path d={`M ${cx - 19} 122 Q ${cx} 134 ${cx + 19} 122`} stroke="#c07a24" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  )
}

function EyeClosedSmile({ cx }: { cx: number }) {
  return (
    <g>
      <path d={`M ${cx - 19} 114 Q ${cx} 130 ${cx + 19} 114`} stroke="#7a4a12" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d={`M ${cx - 17} 110 Q ${cx - 6} 104 ${cx - 2} 110`} stroke="#7a4a12" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  )
}

function CatHead({ mood }: { mood: Mood }) {
  return (
    <svg width="240" height="240" viewBox="0 0 260 270" style={{ display: 'block' }}>
      <defs>
        <radialGradient id="catFur" cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#ffd37a" />
          <stop offset="55%" stopColor="#f6ab3e" />
          <stop offset="100%" stopColor="#dc8420" />
        </radialGradient>
        <radialGradient id="catFurDark" cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#f2a137" />
          <stop offset="100%" stopColor="#c06e16" />
        </radialGradient>
        <radialGradient id="catEarIn" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffb2c0" />
          <stop offset="100%" stopColor="#f2749a" />
        </radialGradient>
        <radialGradient id="catIris" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffe27a" />
          <stop offset="60%" stopColor="#f5a623" />
          <stop offset="100%" stopColor="#c06e16" />
        </radialGradient>
        <clipPath id="catHeadClip">
          <ellipse cx="130" cy="142" rx="104" ry="96" />
        </clipPath>
      </defs>

      {/* back ears */}
      <path d="M 40 60 L 82 116 Q 84 124 78 127 L 30 122 Z" fill="url(#catFurDark)" />
      <path d="M 220 60 L 178 116 Q 176 124 182 127 L 230 122 Z" fill="url(#catFurDark)" />
      <path d="M 56 74 L 74 114 Q 72 118 64 118 L 48 106 Z" fill="url(#catEarIn)" />
      <path d="M 204 74 L 186 114 Q 188 118 196 118 L 212 106 Z" fill="url(#catEarIn)" />

      {/* head */}
      <ellipse cx="130" cy="142" rx="104" ry="96" fill="url(#catFur)" />
      {/* cheek fluff */}
      <ellipse cx="62" cy="150" rx="30" ry="26" fill="url(#catFur)" />
      <ellipse cx="198" cy="150" rx="30" ry="26" fill="url(#catFur)" />

      {/* tabby stripes */}
      <g stroke="#d97a1f" strokeWidth="6" strokeLinecap="round" fill="none">
        <path d="M 96 56 Q 108 82 128 62" />
        <path d="M 164 56 Q 152 82 132 62" />
        <path d="M 108 50 Q 116 72 124 60" />
        <path d="M 152 50 Q 144 72 136 60" />
        <path d="M 66 132 Q 84 138 92 126" />
        <path d="M 74 146 Q 88 150 96 140" />
        <path d="M 194 132 Q 176 138 168 126" />
        <path d="M 186 146 Q 172 150 164 140" />
      </g>

      <g clipPath="url(#catHeadClip)">
        <ellipse cx="130" cy="232" rx="150" ry="70" fill="rgba(120,50,0,0.10)" />
      </g>

      {/* eyes by mood */}
      {mood === 'happy' && <EyeOpen cx={96} />}
      {mood === 'happy' && <EyeOpen cx={164} />}
      {mood === 'neutral' && <EyeHalf cx={96} />}
      {mood === 'neutral' && <EyeHalf cx={164} />}
      {mood === 'sleepy' && <EyeClosedSmile cx={96} />}
      {mood === 'sleepy' && <EyeClosedSmile cx={164} />}
      {mood === 'love' && <EyeClosedSmile cx={96} />}
      {mood === 'love' && <EyeClosedSmile cx={164} />}

      {/* nose */}
      <path d="M 130 158 Q 138 168 130 180 Q 122 168 130 158 Z" fill="#f07a88" />
      <ellipse cx="127" cy="165" rx="3.4" ry="2.2" fill="#ffb9c2" opacity="0.8" />

      {/* mouth */}
      {mood === 'love' ? (
        <path d="M 106 180 Q 130 214 154 180 Q 130 194 106 180 Z" fill="#7a2438" stroke="#5d1a2a" strokeWidth="2" strokeLinejoin="round" />
      ) : (
        <g stroke="#8a5a22" strokeWidth="2.6" fill="none" strokeLinecap="round">
          <path d="M 118 186 q 12 12 24 0" />
          <path d="M 142 186 q 12 12 24 0" />
        </g>
      )}
      {mood === 'love' && <ellipse cx="130" cy="190" rx="9" ry="5" fill="#f0788f" opacity="0.85" />}

      {/* blush */}
      {mood === 'love' && (
        <>
          <ellipse cx="76" cy="166" rx="13" ry="8" fill="#f7818f" opacity="0.4" />
          <ellipse cx="184" cy="166" rx="13" ry="8" fill="#f7818f" opacity="0.4" />
        </>
      )}

      {/* whiskers */}
      <g stroke="#e8c9a0" strokeWidth="2" strokeLinecap="round" opacity="0.85">
        <path d="M 66 152 L 10 142" />
        <path d="M 62 160 L 8 156" />
        <path d="M 68 168 L 14 170" />
        <path d="M 194 152 L 250 142" />
        <path d="M 198 160 L 252 156" />
        <path d="M 192 168 L 246 170" />
      </g>
    </svg>
  )
}

export default function CatGame({ gameId, onScoreUpdate }: { gameId: string; onScoreUpdate: (best: number) => void }) {
  const [mood, setMood] = useState(55)
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([])

  useEffect(() => {
    const t = window.setInterval(() => setMood((m) => Math.max(0, m - 2)), 500)
    return () => window.clearInterval(t)
  }, [])

  const level: Mood = mood > 72 ? 'love' : mood > 45 ? 'happy' : mood > 20 ? 'neutral' : 'sleepy'

  const pet = () => {
    setMood((m) => Math.min(100, m + 6))
    setHearts((h) => [...h.slice(-4), { id: Date.now(), x: Math.random() * 70 + 15, y: Math.random() * 30 + 10 }])
  }

  const barColor = mood > 60 ? 'linear-gradient(90deg,#34d399,#10b981)' : mood > 30 ? 'linear-gradient(90deg,#fbbf24,#f59e0b)' : 'linear-gradient(90deg,#f87171,#ef4444)'

  return (
    <div
      className="game-wrap"
      style={{
        background: 'linear-gradient(160deg, #fef3c7, #fde68a 45%, #fcd34d)',
      }}
    >
      <GameShell gameId={gameId} onScoreUpdate={onScoreUpdate}>
        {(api) => (
          <>
            <div className="game-hint" style={{ color: '#92400e' }}>Гладь котика 🐱</div>
            <div className="game-stage" style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
              <div className="cat-halo" style={{ position: 'relative' }}>
                {hearts.map((h) => (
                  <span
                    key={h.id}
                    className="cat-heart"
                    style={{
                      position: 'absolute',
                      left: `${h.x}%`,
                      top: `${h.y}%`,
                      fontSize: 26,
                      color: '#ec4899',
                      textShadow: '0 0 12px rgba(236,72,153,0.6)',
                    }}
                  >
                    ♥
                  </span>
                ))}
                <div
                  onClick={() => {
                    pet()
                    api.add(2, 'purr')
                  }}
                  className="cat-face"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    animation: 'catBreathe 2.6s ease-in-out infinite',
                    filter: 'drop-shadow(0 22px 30px rgba(200,120,40,0.4))',
                  }}
                >
                  <div style={{ animation: level === 'love' ? 'catSway 1.6s ease-in-out infinite' : level === 'sleepy' ? 'catSway 3.4s ease-in-out infinite' : 'none' }}>
                    <CatHead mood={level} />
                  </div>
                </div>
              </div>
              <div className="cat-bar" style={{ width: 'min(70%, 280px)', textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#92400e', marginBottom: 8 }}>Счастье</div>
                <div className="mood-track" style={{ height: 16, borderRadius: 999, overflow: 'hidden', background: 'rgba(255,255,255,0.6)', border: '2px solid rgba(255,255,255,0.8)', boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.1)' }}>
                  <div className="mood-fill" style={{ height: '100%', width: `${mood}%`, background: barColor, transition: 'width 0.3s ease' }} />
                </div>
              </div>
            </div>
          </>
        )}
      </GameShell>
    </div>
  )
}