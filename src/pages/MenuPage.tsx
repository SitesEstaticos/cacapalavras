// Página de Menu

import React, { useState, useEffect } from 'react'
import { Button, Card } from '@components/index'

export const MenuPage: React.FC<{ onStartGame: () => void }> = ({ onStartGame }) => {
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    bestScore: 0,
    bestTime: 0,
  })

  useEffect(() => {
    // Carregar estatísticas do storage
    loadStats()
  }, [])

  const loadStats = async () => {
    // Implementar carregamento de estatísticas
  }

  return (
    <div className="min-h-screen bg-dark p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        {/* Logo / Título */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-secondary mb-2">🔍</h1>
          <h1 className="text-4xl font-bold text-light">Caça Palavras</h1>
          <p className="text-muted mt-2">Jogo Moderno de Palavras</p>
        </div>

        {/* Estatísticas */}
        <Card>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs text-muted uppercase">Jogos</p>
              <p className="text-2xl font-bold text-secondary">{stats.gamesPlayed}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted uppercase">Melhor Score</p>
              <p className="text-2xl font-bold text-secondary">{stats.bestScore}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted uppercase">Melhor Tempo</p>
              <p className="text-2xl font-bold text-secondary">
                {stats.bestTime > 0 ? `${Math.floor(stats.bestTime / 60)}m` : '-'}
              </p>
            </div>
          </div>
        </Card>

        {/* Botões de Ação */}
        <div className="space-y-3">
          <Button variant="primary" className="w-full py-3" onClick={onStartGame}>
            🎮 Novo Jogo
          </Button>
          <Button variant="secondary" className="w-full py-3">
            📊 Estatísticas
          </Button>
          <Button variant="outline" className="w-full py-3">
            ⚙️ Configurações
          </Button>
          <Button variant="ghost" className="w-full py-3">
            🏆 Conquistas
          </Button>
        </div>

        {/* Rodapé */}
        <div className="text-center text-xs text-muted mt-8">
          <p>Versão 1.0.0</p>
          <p className="mt-2">© 2026 M³ Technology - Desenvolvido com carinho</p>
        </div>
      </div>
    </div>
  )
}
