import { Link } from 'react-router-dom'
import { useScore } from '../../core/state/ScoreContext'
import { GAMES } from '../../games/registry'
import { SoftBg } from '../../ui/SoftBg'
import { ThemeToggle } from '../../ui/ThemeToggle'
import styles from './HomePage.module.css'

export default function HomePage() {
  const { globalScore, getBest } = useScore()

  return (
    <div className={styles.root}>
      <SoftBg />
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Антистресс</h1>
          <p className={styles.subtitle}>15 нежных игр, чтобы расслабиться</p>
        </div>
        <div className={styles.controls}>
          <div className={styles.global}>🌿 {globalScore}</div>
          <ThemeToggle />
        </div>
      </header>

      <main className={styles.grid}>
        {GAMES.map((g) => {
          const best = getBest(g.id)
          return (
            <Link key={g.id} to={`/game/${g.id}`} className={styles.card}>
              <div className={styles.cardEmoji}>{g.emoji}</div>
              <div className={styles.cardTitle}>{g.title}</div>
              <div className={styles.cardBest}>{best > 0 ? `Рекорд: ${best}` : 'Играть'}</div>
            </Link>
          )
        })}
      </main>
    </div>
  )
}