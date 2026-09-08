import type { ReactNode } from 'react'
import BubblesGame from './types/BubblesGame'
import PopItGame from './types/PopItGame'
import CatGame from './types/CatGame'
import CloudGame from './types/CloudGame'
import WarmColdGame from './types/WarmColdGame'
import SwirlFishGame from './types/SwirlFishGame'
import RibbonGame from './types/RibbonGame'
import MosaicGame from './types/MosaicGame'
import FirefliesGame from './types/FirefliesGame'
import BreathGame from './types/BreathGame'
import FlickSandGame from './types/FlickSandGame'
import WindSailsGame from './types/WindSailsGame'
import KeysGame from './types/KeysGame'
import GhostGame from './types/GhostGame'
import LullabyGame from './types/LullabyGame'

export type GameComponentProps = {
  gameId: string
  onScoreUpdate: (best: number) => void
}

export type GameDef = {
  id: string
  title: string
  emoji: string
  component: (props: GameComponentProps) => ReactNode
}

export const GAMES: GameDef[] = [
  { id: 'bubbles', title: 'Пузырьки', emoji: '🫧', component: BubblesGame },
  { id: 'popit', title: 'Pop-it', emoji: '🔘', component: PopItGame },
  { id: 'cat', title: 'Котик', emoji: '🐱', component: CatGame },
  { id: 'cloud', title: 'Облака', emoji: '☁️', component: CloudGame },
  { id: 'warmcold', title: 'Баланс температуры', emoji: '🌡️', component: WarmColdGame },
  { id: 'swirlfish', title: 'Водоворот', emoji: '🐠', component: SwirlFishGame },
  { id: 'ribbon', title: 'Разноцветная лента', emoji: '🎀', component: RibbonGame },
  { id: 'mosaic', title: 'Мозаика пар', emoji: '🎨', component: MosaicGame },
  { id: 'fireflies', title: 'Светлячки', emoji: '✨', component: FirefliesGame },
  { id: 'breath', title: 'Дыхание', emoji: '🫁', component: BreathGame },
  { id: 'flicksand', title: 'Песок', emoji: '🏖️', component: FlickSandGame },
  { id: 'windsails', title: 'Парус', emoji: '🪁', component: WindSailsGame },
  { id: 'keys', title: 'Клавиши', emoji: '🎹', component: KeysGame },
  { id: 'ghost', title: 'Мягкое эхо', emoji: '👻', component: GhostGame },
  { id: 'lullaby', title: 'Колыбельная', emoji: '🌙', component: LullabyGame },
]

export function getGame(id: string | undefined): GameDef | undefined {
  return GAMES.find((g) => g.id === id)
}