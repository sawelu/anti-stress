import styles from './SoftBg.module.css'

export function SoftBg() {
  return (
    <div className={styles.bg} aria-hidden="true">
      <div className={styles.blobOne} />
      <div className={styles.blobTwo} />
      <div className={styles.blobThree} />
    </div>
  )
}