// Componente MenuPage (Tela Inicial / Menu do Jogo)

import React from 'react'
import { Button } from '@components/index'
import { GameMode, GameDifficulty, WordSegment } from '@/types'

interface MenuPageProps {
  onStartGame: (mode: GameMode, difficulty?: GameDifficulty, segment?: WordSegment) => void
  onOpenStats?: () => void
  onOpenSettings?: () => void
}

export const MenuPage: React.FC<MenuPageProps> = ({
  onStartGame,
  onOpenStats,
  onOpenSettings,
}) => {
  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-4 md:p-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Logótipo / Título */}
        <div className="space-y-2">
          <div className="inline-block p-4 bg-secondary/10 rounded-full mb-2">
            <span className="text-6xl">🔍</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-secondary tracking-tight">
            Caça Palavras
          </h1>
          <p className="text-sm text-muted">
            Desafie a sua mente e encontre as palavras escondidas!
          </p>
        </div>

        {/* Seleção do Modo de Jogo */}
        <div className="card-lg space-y-4">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">
            Escolha o Modo de Jogo
          </h2>

          <div className="grid grid-cols-1 gap-3">
            {/* Modo Tradicional */}
            <button
              onClick={() => onStartGame(GameMode.CLASSIC)}
              className="p-4 rounded-xl border border-gray-700 bg-dark-card hover:border-secondary hover:bg-secondary/10 transition-all text-left group flex items-start gap-4"
            >
              <span className="text-3xl p-2 bg-gray-800 rounded-lg group-hover:bg-secondary/20 transition-colors">
                🔤
              </span>
              <div>
                <h3 className="font-bold text-light text-base group-hover:text-secondary">
                  Modo Tradicional
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Lista de palavras visível. Encontre-as no painel.
                </p>
              </div>
            </button>

            {/* Modo Significados (Desafio) */}
            <button
              onClick={() => onStartGame(GameMode.CHALLENGE)}
              className="p-4 rounded-xl border border-amber-500/40 bg-dark-card hover:border-amber-400 hover:bg-amber-500/10 transition-all text-left group flex items-start gap-4"
            >
              <span className="text-3xl p-2 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
                🧠
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-amber-400 text-base">
                    Modo Significados
                  </h3>
                  <span className="text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">
                    Desafio
                  </span>
                </div>
                <p className="text-xs text-muted mt-0.5">
                  Palavras misteriosas. Use as dicas para revelar seus significados!
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Botões Auxiliares */}
        <div className="flex gap-3 justify-center">
          {onOpenStats && (
            <Button variant="outline" className="flex-1" onClick={onOpenStats}>
              📊 Estatísticas
            </Button>
          )}
          {/* {onOpenSettings && (
            <Button variant="outline" className="flex-1" onClick={onOpenSettings}>
              ⚙️ Definições
            </Button>
          )} */}
        </div>

        {/* Footer */}
        <p className="text-xs text-muted">
          &copy; 2026 M³ Technology. Todos os direitos reservados.
        </p>
      </div>
    </div>
  )
}