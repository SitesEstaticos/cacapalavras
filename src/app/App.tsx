// App.tsx
import React, { useState } from 'react'
import { GamePage } from '@/pages/GamePage'
import { MenuPage } from '@/pages/MenuPage'
import '@/styles/globals.css'

export const App: React.FC = () => {
  // Estado para alternar entre 'menu' e 'game'
  const [currentPage, setCurrentPage] = useState<'menu' | 'game'>('menu')

  return (
    <div className="min-h-screen bg-dark text-light">
      {currentPage === 'menu' ? (
        <MenuPage onStartGame={() => setCurrentPage('game')} />
      ) : (
        <GamePage />
      )}
    </div>
  )
}

export default App