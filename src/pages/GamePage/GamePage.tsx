import { useNavigate, useParams } from 'react-router-dom'
import { useScore } from '../../core/state/ScoreContext'
import { getGame } from '../../games/registry'
import { SoundToggle } from '../../ui/SoundToggle'
import { SoftBg } from '../../ui/SoftBg'
import { CenterToast } from '../../ui/CenterToast'
import { ThemeToggle } from '../../ui/ThemeToggle'
import styles from './GamePage.module.css'

export default function GamePage() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const { getBest } = useScore()

  const game = getGame(gameId)

  if (!game) {
    return (
      <div className={styles.root}>
        <SoftBg />
        <div className={styles.notFound}>
          <div>Игра не найдена</div>
          <button className={styles.back} onClick={() => navigate('/')}>← На главную</button>
        </div>
      </div>
    )
  }

  const best = getBest(game.id)

  return (
    <div className={styles.root}>
      <SoftBg />
      <header className={styles.topbar}>
        <button className={styles.back} onClick={() => navigate('/')}>←</button>
        <div className={styles.topTitle}>
          <span className={styles.topEmoji}>{game.emoji}</span>
          {game.title}
        </div>
        <div className={styles.topRight}>
          <span className={styles.best}>💫 {best}</span>
          <ThemeToggle compact />
          <SoundToggle />
        </div>
      </header>

      <main className={styles.stage}>
        <game.component gameId={game.id} onScoreUpdate={() => {}} />
      </main>

      <footer className={styles.footer}>
        <span>Просто играй и расслабляйся 🌿</span>
      </footer>

      <CenterToast />
    </div>
  )
}