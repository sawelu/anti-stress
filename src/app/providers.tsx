import type { ReactNode } from 'react'
import { ThemeProvider } from '../core/theme/ThemeContext'
import { SoundProvider } from '../core/sound/SoundProvider'
import { ScoreProvider } from '../core/state/ScoreContext'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SoundProvider>
        <ScoreProvider>{children}</ScoreProvider>
      </SoundProvider>
    </ThemeProvider>
  )
}