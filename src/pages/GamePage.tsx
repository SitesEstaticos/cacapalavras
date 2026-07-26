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
import { GameDifficulty, WordSegment } from '@/types'
import { WebStorageAdapter } from '@adapters/index'
import AdContainer from '@/components/ads/AdContainer'

interface GamePageProps {
  onBackToMenu?: () => void
}

export const GamePage: React.FC<GamePageProps> = ({ onBackToMenu }) => {
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

  // Controle para evitar salvar a mesma vitória mais de uma vez
  const hasSavedGame = useRef(false)

  // Reseta a trava quando inicia um novo jogo
  useEffect(() => {
    if (!gameLogic.isGameComplete) {
      hasSavedGame.current = false
    }
  }, [gameLogic.isGameComplete])

  // Dispara o salvamento e exibe o modal assim que o jogo é concluído
  useEffect(() => {
    if (gameLogic.isGameComplete && !hasSavedGame.current) {
      hasSavedGame.current = true
      setShowGameOverModal(true)

      void saveGameStats(
        gameLogic.score,
        gameLogic.time,
        String(difficulty),
        String(segment)
      )
    }
  }, [
    gameLogic.isGameComplete,
    gameLogic.score,
    gameLogic.time,
    difficulty,
    segment,
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

  const handleSelectionStart = (row: number, col: number) => {
    gameLogic.startSelection(row, col)
  }

  const handleSelectionMove = (row: number, col: number) => {
    gameLogic.updateSelection(row, col)
  }

  const handleSelectionEnd = () => {
    gameLogic.validateSelection()
  }

  const handleSelectionCancel = () => {
    gameLogic.cancelSelection()
  }

  const handleUseHint = async () => {
    const used = await useHint()

    if (used) {
      const hintResult = gameLogic.applyHint()

      if (hintResult) {
        const firstLetter = hintResult.wordText.charAt(0).toUpperCase()
        setCurrentHint(`💡 Primeira letra: "${firstLetter}" — Significado: ${hintResult.hint}`)
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
    <div className="min-h-screen bg-dark p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-secondary">Caça Palavras 🔍</h1>
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
                  ? 'Use uma dica para revelar uma palavra'
                  : 'Assistir um anúncio para ganhar +1 dica')
              }
            />

            {/* Word List */}
            <WordList
              words={gameLogic.words}
              foundWords={gameLogic.foundWords}
              onWordClick={word => console.log('Palavra clicada:', word)}
            />

            {/* Banner Inferior */}
            <AdContainer slot="7716746018" />

            {/* Buttons */}
            <div className="space-y-2">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => {
                  gameLogic.reset()
                  void resetHints()
                }}
              >
                🔄 Novo Jogo
              </Button>
              <Button variant="outline" className="w-full" onClick={onBackToMenu}>
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
          gameLogic.reset()
          void resetHints()
        }}
        onRestart={() => {
          setShowGameOverModal(false)
          gameLogic.reset()
          void resetHints()
        }}
        score={gameLogic.score}
        time={gameLogic.time}
        wordsFound={gameLogic.foundWords.length}
        totalWords={gameLogic.words.length}
        isVictory={gameLogic.isGameComplete}
      />
    </div>
  )
}