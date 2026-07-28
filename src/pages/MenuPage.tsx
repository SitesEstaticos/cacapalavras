// Página de Menu

import React from 'react'
import { Button, Card } from '@components/index'
import { useStats } from '@hooks/index'
import { GameMode } from '@/types'

interface MenuPageProps {
  onStartGame: (mode: GameMode) => void
  onOpenStats?: () => void
  onOpenPrivacy?: () => void
  onOpenAbout?: () => void
}
const formatTime = (seconds: number | undefined): string => {
  if (!seconds || seconds <= 0) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
export const MenuPage: React.FC<MenuPageProps> = ({
  onStartGame,
  onOpenStats,
  onOpenPrivacy,
  onOpenAbout
}) => {
  const { stats } = useStats()

  // URL para abrir a composição de e-mail no Gmail em uma nova aba
  const gmailUrl =
    'https://mail.google.com/mail/?view=cm&fs=1&to=m3technology.br@gmail.com&su=Contato%20-%20Ca%C3%A7a%20Palavras'

  return (
    <div className="min-h-screen bg-dark p-4 md:p-8 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full space-y-8">

        {/* Logo / Título */}
        <div className="text-center my-6 space-y-3">
          <h1 className="text-5xl md:text-6xl font-extrabold text-secondary tracking-tight">
            Caça Palavras 🔍
          </h1>
          <p className="text-lg text-muted max-w-lg mx-auto">
            Exercite sua mente, encontre palavras e amplie seu vocabulário em um
            desafio divertido e educativo!
          </p>
        </div>

        {/* Estatísticas Resumidas */}
        <Card className="max-w-md mx-auto p-4 border border-gray-800 bg-dark-lighter/50 shadow-md">
          <div className="grid grid-cols-3 divide-x divide-gray-800">

            {/* Jogos Jogados */}
            <div className="text-center px-2 flex flex-col justify-center items-center space-y-1">
              <span className="text-xs text-muted font-semibold tracking-wider uppercase flex items-center gap-1">
                🎮 Jogos
              </span>
              <p className="text-2xl font-extrabold text-secondary tracking-tight">
                {stats.gamesPlayed ?? 0}
              </p>
            </div>

            {/* Melhor Score */}
            <div className="text-center px-2 flex flex-col justify-center items-center space-y-1">
              <span className="text-xs text-muted font-semibold tracking-wider uppercase flex items-center gap-1">
                🏆 Recorde
              </span>
              <p className="text-2xl font-extrabold text-amber-400 tracking-tight">
                {stats.bestScore ?? 0}
              </p>
            </div>

            {/* Melhor Tempo (Formato 00:00) */}
            <div className="text-center px-2 flex flex-col justify-center items-center space-y-1">
              <span className="text-xs text-muted font-semibold tracking-wider uppercase flex items-center gap-1">
                ⏱️ Tempo
              </span>
              <p className="text-2xl font-extrabold text-emerald-400 tracking-tight font-mono">
                {formatTime(stats.bestTime)}
              </p>
            </div>

          </div>
        </Card>

        {/* Seleção de Modos de Jogo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 text-center space-y-4 hover:border-secondary transition-all flex flex-col justify-between">
            <div>
              <div className="text-4xl mb-2">🔤</div>
              <h2 className="text-2xl font-bold text-light">Modo Clássico</h2>
              <p className="text-sm text-muted mt-2">
                O caça-palavras tradicional. Encontre todas as palavras listadas na grade no menor tempo possível.
              </p>
            </div>
            <Button
              variant="primary"
              className="w-full mt-4 py-3 cursor-pointer"
              onClick={() => onStartGame(GameMode.CLASSIC)}
            >
              🎮 Jogar Modo Clássico
            </Button>
          </Card>

          <Card className="p-6 text-center space-y-4 hover:border-amber-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="text-4xl mb-2">📖</div>
              <h2 className="text-2xl font-bold text-amber-400">Modo Significados</h2>
              <p className="text-sm text-muted mt-2">
                Um desafio educativo! Em vez da palavra direta, use os conceitos e dicas para descobrir o que procurar.
              </p>
            </div>
            <Button
              variant="secondary"
              className="w-full mt-4 py-3 cursor-pointer"
              onClick={() => onStartGame(GameMode.CHALLENGE)}
            >
              🧠 Jogar Modo Significados
            </Button>
          </Card>
        </div>

        {/* Botões para Outras Páginas (Estatísticas e Sobre) */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          {onOpenStats && (
            <Button
              variant="outline"
              className="w-full py-3 cursor-pointer"
              onClick={onOpenStats}
            >
              📊 Estatísticas
            </Button>
          )}

          {onOpenAbout && (
            <Button
              variant="outline"
              className="w-full py-3 cursor-pointer"
              onClick={onOpenAbout}
            >
              ℹ️ Sobre o Jogo
            </Button>
          )}
        </div>

        {/* Rodapé com Política de Privacidade e Gmail */}
        <div className="text-center text-xs text-muted border-t border-gray-800 pt-6 pb-8 space-y-3">
          <div className="flex justify-center items-center gap-3">
            <button
              onClick={onOpenPrivacy}
              className="text-secondary hover:underline transition-colors font-medium cursor-pointer"
            >
              Política de Privacidade
            </button>

            <span>•</span>

            <a
              href={gmailUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:underline transition-colors font-medium flex items-center gap-1"
            >
              Entrar em Contato
            </a>
          </div>

          <p>&copy; 2026 M³ Technology. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  )
}