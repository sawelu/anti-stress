import { Navigate, Route, Routes } from 'react-router-dom'
import { AppProviders } from './app/providers'
import HomePage from './pages/HomePage/HomePage'
import GamePage from './pages/GamePage/GamePage'
import './App.css'
import './games/games.css'

export default function App() {
  return (
    <AppProviders>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game/:gameId" element={<GamePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProviders>
  )
}