import { useScore } from '../core/state/ScoreContext'
import styles from './CenterToast.module.css'

export function CenterToast() {
  const { toast } = useScore()
  if (!toast.show) return null
  return (
    <div key={toast.key} className={styles.toast}>
      {toast.text}
    </div>
  )
}