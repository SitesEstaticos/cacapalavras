import React, { useState } from 'react'
import { GamePage } from '@/pages/GamePage'
import { MenuPage } from '@/pages/MenuPage'
import { StatsScreen } from '@/components/StatsScreen'
import { CookieBanner } from '@/components/CookieBanner'
import { PrivacyPolicy } from '@/components/PrivacyPolicy'
import '@/styles/globals.css'

export const App: React.FC = () => {
  // Estado para controlar a navegação das telas
  const [currentPage, setCurrentPage] = useState<'menu' | 'game' | 'stats' | 'privacy'>('menu')

  return (
    <div className="min-h-screen bg-dark text-light relative">
      {currentPage === 'menu' && (
        <MenuPage 
          onStartGame={() => setCurrentPage('game')} 
          onOpenStats={() => setCurrentPage('stats')}
          onOpenPrivacy={() => setCurrentPage('privacy')}
        />
      )}

      {currentPage === 'game' && (
        <GamePage onBackToMenu={() => setCurrentPage('menu')} />
      )}

      {currentPage === 'stats' && (
        <StatsScreen onBack={() => setCurrentPage('menu')} />
      )}

      {currentPage === 'privacy' && (
        <div className="p-4 md:p-8">
          {/* O onClose passa a função que zera o estado de volta para 'menu' */}
          <PrivacyPolicy onClose={() => setCurrentPage('menu')} />
        </div>
      )}

      {/* Banner de Cookies fixo que aparece sobre qualquer tela */}
      <CookieBanner onOpenPrivacy={() => setCurrentPage('privacy')} />
    </div>
  )
}

export default App