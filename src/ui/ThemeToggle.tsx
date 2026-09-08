import { useTheme } from '../core/theme/ThemeContext'
import styles from './ThemeToggle.module.css'

export function ThemeToggle({ compact }: { compact?: boolean }) {
  const { isDark, toggle } = useTheme()
  return (
    <button
      type="button"
      className={`${styles.btn} ${compact ? styles.compact : ''}`}
      aria-pressed={isDark}
      onClick={toggle}
      title={isDark ? 'Светлая тема' : 'Тёмная тема'}
    >
      {isDark ? '☀️' : '🌙'}
      {compact ? null : <span className={styles.label}>{isDark ? 'Светлая' : 'Тёмная'}</span>}
    </button>
  )
}