import React, { useState } from 'react'
import { GamePage } from '@/pages/GamePage'
import { MenuPage } from '@/pages/MenuPage'
import { StatsScreen } from '@/components/StatsScreen' // 👈 Import do componente de estatísticas
import '@/styles/globals.css'

export const App: React.FC = () => {
  // Adicionada a opção 'stats' ao estado
  const [currentPage, setCurrentPage] = useState<'menu' | 'game' | 'stats'>('menu')

  return (
    <div className="min-h-screen bg-dark text-light">
      {currentPage === 'menu' && (
        <MenuPage 
          onStartGame={() => setCurrentPage('game')} 
          onOpenStats={() => setCurrentPage('stats')} // 👈 Passa a ação para abrir a tela
        />
      )}

      {currentPage === 'game' && (
        <GamePage onBackToMenu={() => setCurrentPage('menu')} />
      )}

      {currentPage === 'stats' && (
        <StatsScreen onBack={() => setCurrentPage('menu')} /> // 👈 Renderiza a tela de estatísticas
      )}
    </div>
  )
}

export default App