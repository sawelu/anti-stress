import { useSound } from '../core/sound/SoundContext'
import styles from './SoundToggle.module.css'

export function SoundToggle() {
  const { enabled, toggle } = useSound()
  return (
    <button type="button" className={styles.btn} aria-pressed={enabled} onClick={toggle}>
      {enabled ? '🔊 Звук вкл' : '🔇 Звук выкл'}
    </button>
  )
}