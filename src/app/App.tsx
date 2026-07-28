import React, { useState } from 'react'
import { GamePage } from '@/pages/GamePage'
import { MenuPage } from '@/pages/MenuPage'
import { AboutPage } from '@/pages/AboutPage'
import { StatsScreen } from '@/components/StatsScreen'
import { CookieBanner } from '@/components/CookieBanner'
import { PrivacyPolicy } from '@/components/PrivacyPolicy'
import { GameMode } from '@/types'
import '@/styles/globals.css'

export const App: React.FC = () => {
  // Estado para controlar a navegação das telas (incluindo 'about')
  const [currentPage, setCurrentPage] = useState<'menu' | 'game' | 'stats' | 'privacy' | 'about'>('menu')

  // Estado para guardar o modo de jogo selecionado
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode>(GameMode.CLASSIC)

  const handleStartGame = (mode: GameMode) => {
    setSelectedGameMode(mode)
    setCurrentPage('game')
  }

  return (
    <div className="min-h-screen bg-dark text-light relative">
      {currentPage === 'menu' && (
        <MenuPage 
          onStartGame={handleStartGame} 
          onOpenStats={() => setCurrentPage('stats')}
          onOpenPrivacy={() => setCurrentPage('privacy')}
          onOpenAbout={() => setCurrentPage('about')}
        />
      )}

      {currentPage === 'game' && (
        <GamePage 
          gameMode={selectedGameMode} 
          onBackToMenu={() => setCurrentPage('menu')} 
        />
      )}

      {currentPage === 'stats' && (
        <StatsScreen onBack={() => setCurrentPage('menu')} />
      )}

      {currentPage === 'privacy' && (
        <div className="p-4 md:p-8">
          <PrivacyPolicy onClose={() => setCurrentPage('menu')} />
        </div>
      )}

      {currentPage === 'about' && (
        <AboutPage onBack={() => setCurrentPage('menu')} />
      )}

      {/* Banner de Cookies fixo que aparece sobre qualquer tela */}
      <CookieBanner onOpenPrivacy={() => setCurrentPage('privacy')} />
    </div>
  )
}

export default App