// Aplicação Principal

import React from 'react'
import { GamePage } from '@/pages/GamePage'
import '@/styles/globals.css'

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark text-light">
      <GamePage />
    </div>
  )
}

export default App
