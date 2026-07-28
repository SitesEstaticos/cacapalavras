// Página Principal do Jogo

import React, { useState, useEffect, useMemo, useRef } from 'react'
import {
  Board,
  HUD,
  WordList,
  Button,
  DifficultyModal,
  SegmentModal,
  HintModal,
  GameOverModal,
} from '@components/index'
import { useGameLogic, useHints, useStats } from '@hooks/index'
import { StorageService } from '@services/StorageService'
import { GameDifficulty, WordSegment, GameMode } from '@/types'
import { WebStorageAdapter } from '@adapters/index'
import AdContainer from '@/components/ads/AdContainer'

interface GamePageProps {
  gameMode?: GameMode
  onBackToMenu?: () => void
}

const getDirectionLabel = (direction?: string): string => {
  switch (direction) {
    case 'horizontal':
      return 'Horizontal ➔'
    case 'reverse_horizontal':
      return 'Horizontal (Invertida) ⬅'
    case 'vertical':
      return 'Vertical ⬇'
    case 'reverse_vertical':
      return 'Vertical (Invertida) ⬆'
    case 'diagonal_down':
      return 'Diagonal Para Baixo ↘'
    case 'reverse_diagonal_down':
      return 'Diagonal Para Cima ↖'
    case 'diagonal_up':
      return 'Diagonal Para Cima ↗'
    case 'reverse_diagonal_up':
      return 'Diagonal Para Baixo ↙'
    default:
      return ''
  }
}

export const GamePage: React.FC<GamePageProps> = ({
  gameMode = GameMode.CLASSIC,
  onBackToMenu,
}) => {
  const storageService = useMemo(() => new StorageService(new WebStorageAdapter()), [])

  const [difficulty, setDifficulty] = useState<GameDifficulty>(GameDifficulty.MEDIUM)
  const [segment, setSegment] = useState<WordSegment>(WordSegment.AGROPECUARIA)

  const [showDifficultyModal, setShowDifficultyModal] = useState(true)
  const [showSegmentModal, setShowSegmentModal] = useState(false)
  const [showHintModal, setShowHintModal] = useState(false)
  const [showGameOverModal, setShowGameOverModal] = useState(false)
  const [currentHint, setCurrentHint] = useState('')

  const gameLogic = useGameLogic(difficulty, segment)
  const { saveGameStats } = useStats()

  const {
    hintsAvailable,
    canWatchAd,
    useHint,
    addHintFromAd,
    resetHints,
    isRewardProcessing,
    isCooldownActive,
    cooldownSeconds,
    rewardMessage,
  } = useHints(storageService)

  const hasSavedGame = useRef(false)

  useEffect(() => {
    if (!gameLogic.isGameComplete) {
      hasSavedGame.current = false
    }
  }, [gameLogic.isGameComplete])

  // Salva o resultado ao concluir
  useEffect(() => {
    if (gameLogic.isGameComplete && !hasSavedGame.current) {
      hasSavedGame.current = true
      setShowGameOverModal(true)

      void saveGameStats(
        gameLogic.score,
        gameLogic.time,
        String(difficulty),
        String(segment),
        gameMode
      )
    }
  }, [
    gameLogic.isGameComplete,
    gameLogic.score,
    gameLogic.time,
    difficulty,
    segment,
    gameMode,
    saveGameStats,
  ])

  const handleDifficultySelect = (selectedDifficulty: 'easy' | 'medium' | 'hard' | GameDifficulty) => {
    setDifficulty(selectedDifficulty as GameDifficulty)
    setShowDifficultyModal(false)
    setShowSegmentModal(true)
  }

  const handleSegmentSelect = (selectedSegment: WordSegment) => {
    setSegment(selectedSegment)
    setShowSegmentModal(false)
    void resetHints()
  }

  // 💡 AJUSTE TOUCH/MOBILE: Limpa o estado da dica quando o toque inicia
  const handleSelectionStart = (row: number, col: number) => {
    if (currentHint) {
      setCurrentHint('')
    }
    gameLogic.startSelection(row, col)
  }

  const handleSelectionMove = (row: number, col: number) => {
    gameLogic.updateSelection(row, col)
  }

  // 💡 AJUSTE TOUCH/MOBILE: Proteção ao finalizar a seleção para evitar travamentos
  const handleSelectionEnd = () => {
    try {
      gameLogic.validateSelection()
    } catch (error) {
      console.error('Erro ao validar seleção:', error)
    } finally {
      // Garante que o estado local da dica fique limpo ao tentar acertar a palavra
      setCurrentHint('')
    }
  }

  const handleSelectionCancel = () => {
    gameLogic.cancelSelection()
    setCurrentHint('')
  }

  const handleUseHint = async () => {
    const used = await useHint()

    if (used) {
      const hintResult = gameLogic.applyHint()

      if (hintResult) {
        const firstLetter = hintResult.wordText.charAt(0).toUpperCase()
        const directionLabel = getDirectionLabel(hintResult.direction)

        if (gameMode === GameMode.CLASSIC) {
          setCurrentHint(
            `💡 1ª Letra: "${firstLetter}" | Direção: ${directionLabel}`
          )
        } else {
          setCurrentHint(
            `💡 1ª Letra: "${firstLetter}" | Direção: ${directionLabel}\n\n📖 Conceito: ${hintResult.hint}`
          )
        }
      }

      setShowHintModal(true)
    }
  }

  const handleWatchAd = async () => {
    if (isRewardProcessing || isCooldownActive) {
      return
    }

    gameLogic.pause()
    const added = await addHintFromAd()

    if (added) {
      setShowHintModal(false)
    }

    if (!gameLogic.isGameComplete) {
      gameLogic.resume()
    }
  }

  const difficultyLabel =
    {
      [GameDifficulty.EASY]: 'Fácil',
      [GameDifficulty.MEDIUM]: 'Médio',
      [GameDifficulty.HARD]: 'Difícil',
    }[difficulty] || 'Médio'

  return (
    <div className="min-h-screen bg-dark p-4 md:p-8 select-none">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-secondary flex items-center gap-2">
              Caça Palavras 🔍
            </h1>
            {gameMode === GameMode.CHALLENGE && (
              <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
                Modo Significados
              </span>
            )}
          </div>
          <Button variant="ghost" onClick={() => gameLogic.togglePause()}>
            {gameLogic.isRunning ? '⏸️ Pausar' : '▶️ Retomar'}
          </Button>
        </div>

        {/* Banner Superior */}
        <AdContainer slot="7716746018" />

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
          {/* Board - Left */}
          <div className="lg:col-span-2">
            <Board
              grid={gameLogic.board}
              selectedCells={gameLogic.selectedCells}
              foundWords={gameLogic.foundWords}
              foundWordColors={gameLogic.foundWordColors}
              words={gameLogic.words}
              disabled={
                !gameLogic.isRunning ||
                gameLogic.isGameComplete ||
                isRewardProcessing ||
                showDifficultyModal ||
                showSegmentModal
              }
              onSelectionStart={handleSelectionStart}
              onSelectionMove={handleSelectionMove}
              onSelectionEnd={handleSelectionEnd}
              onSelectionCancel={handleSelectionCancel}
            />

            {/* Game Status */}
            <div className="mt-6 p-4 card text-center">
              {gameLogic.isGameComplete ? (
                <p className="text-lg font-bold text-success">✅ Jogo Concluído!</p>
              ) : (
                <p className="text-lg font-bold text-secondary">
                  Encontre {gameLogic.words.length - gameLogic.foundWords.length} palavra
                  {gameLogic.words.length - gameLogic.foundWords.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>

          {/* Sidebar - Right */}
          <div className="space-y-6">
            {/* HUD */}
            <HUD
              score={gameLogic.score}
              time={gameLogic.time}
              wordsFound={gameLogic.foundWords.length}
              totalWords={gameLogic.words.length}
              hintsAvailable={hintsAvailable}
              difficulty={difficultyLabel}
              onHintClick={() => setShowHintModal(true)}
              hintButtonLabel={
                isRewardProcessing
                  ? 'Carregando anúncio...'
                  : isCooldownActive
                  ? `Disponível em ${cooldownSeconds}s`
                  : hintsAvailable > 0
                  ? `💡 Dica (${hintsAvailable})`
                  : '🎁 Ganhar mais uma dica'
              }
              hintButtonDisabled={isRewardProcessing || (!canWatchAd && hintsAvailable === 0)}
              hintStatusText={
                rewardMessage ||
                (hintsAvailable > 0
                  ? gameMode === GameMode.CLASSIC
                    ? 'Revela a 1ª letra e a direção da palavra.'
                    : 'Revela a 1ª letra, direção e o significado.'
                  : 'Assistir um anúncio para ganhar +1 dica')
              }
            />

            {/* Word List */}
            <WordList
              words={gameLogic.words}
              foundWords={gameLogic.foundWords}
              hintedDirections={gameLogic.hintedDirections}
              gameMode={gameMode}
              onWordClick={word => console.log('Palavra clicada:', word)}
            />

            {/* Banner Inferior */}
            <AdContainer slot="7716746018" />

            {/* Buttons */}
            <div className="space-y-2">
              <Button
                variant="primary"
                className="w-full cursor-pointer"
                onClick={() => {
                  setCurrentHint('')
                  gameLogic.reset()
                  void resetHints()
                }}
              >
                🔄 Novo Jogo
              </Button>
              <Button variant="outline" className="w-full cursor-pointer" onClick={onBackToMenu}>
                🏠 Voltar ao Menu
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-secondary">
          <p>&copy; 2026 M³ Technology. Todos os direitos reservados.</p>
        </div>
      </div>

      {/* Modals */}
      <DifficultyModal isOpen={showDifficultyModal} onSelect={handleDifficultySelect} />
      <SegmentModal isOpen={showSegmentModal} onSelect={handleSegmentSelect} />

      <HintModal
        isOpen={showHintModal}
        onClose={() => setShowHintModal(false)}
        onUseHint={handleUseHint}
        onWatchAd={handleWatchAd}
        hintsRemaining={hintsAvailable}
        hint={currentHint || 'Procure uma palavra que faz sentido...'}
        isLoading={isRewardProcessing}
        isCooldownActive={isCooldownActive}
        cooldownSeconds={cooldownSeconds}
        statusMessage={rewardMessage}
        canUseHint={hintsAvailable > 0}
        showAdSlot={hintsAvailable === 0}
      />

      <GameOverModal
        isOpen={showGameOverModal}
        onClose={() => {
          setShowGameOverModal(false)
          setCurrentHint('')
          gameLogic.reset()
          void resetHints()
        }}
        onRestart={() => {
          setShowGameOverModal(false)
          setCurrentHint('')
          gameLogic.reset()
          void resetHints()
        }}
        onBackToMenu={onBackToMenu}
        score={gameLogic.score}
        time={gameLogic.time}
        wordsFound={gameLogic.foundWords.length}
        totalWords={gameLogic.words.length}
        isVictory={gameLogic.isGameComplete}
      />
    </div>
  )
}