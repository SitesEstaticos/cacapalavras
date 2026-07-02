// Página Principal do Jogo

import React, { useState, useEffect, useMemo } from 'react'
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
import { useGameLogic, useHints } from '@hooks/index'
import { StorageService } from '@services/StorageService'
import { GameDifficulty, WordSegment } from '@/types'
import { WebStorageAdapter } from '@adapters/index'
import AdContainer from '@/components/ads/AdContainer'

export const GamePage: React.FC = () => {
  const storageService = useMemo(() => new StorageService(new WebStorageAdapter()), [])
  const [difficulty, setDifficulty] = useState<GameDifficulty | null>(null)
  const [segment, setSegment] = useState<WordSegment | null>(null)
  const [showDifficultyModal, setShowDifficultyModal] = useState(true)
  const [showSegmentModal, setShowSegmentModal] = useState(false)
  const [showHintModal, setShowHintModal] = useState(false)
  const [showGameOverModal, setShowGameOverModal] = useState(false)
  const [currentHint, setCurrentHint] = useState('')

  const gameLogic = useGameLogic(
    difficulty || GameDifficulty.MEDIUM,
    segment || WordSegment.AGROPECUARIA
  )
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

  // Controlar quando mostrar game over
  useEffect(() => {
    if (gameLogic.isGameComplete && gameLogic.isRunning) {
      setShowGameOverModal(true)
    }
  }, [gameLogic.isGameComplete, gameLogic.isRunning])

  const handleDifficultySelect = (selectedDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(selectedDifficulty as GameDifficulty)
    setShowDifficultyModal(false)
    setShowSegmentModal(true)
    void resetHints()
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
      const remainingWords = gameLogic.words.filter(
        w => !gameLogic.foundWords.includes(w.id)
      )

      if (remainingWords.length > 0) {
        const randomWord = remainingWords[Math.floor(Math.random() * remainingWords.length)]
        const hintService = new WebStorageAdapter()
        const stored = await hintService.getItem('game_hints_state')
        const hintText = stored
          ? 'Uma dica foi revelada para a palavra selecionada.'
          : 'Uma dica foi revelada para a palavra selecionada.'
        setCurrentHint(`${hintText} Procure a palavra: ${randomWord.text}`)
      }

      setShowHintModal(false)
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

  if (!difficulty || !segment) {
    return (
      <>
        <DifficultyModal isOpen={showDifficultyModal} onSelect={handleDifficultySelect} />
        <SegmentModal isOpen={showSegmentModal} onSelect={handleSegmentSelect} />
      </>
    )
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
          <h1 className="text-4xl font-bold text-secondary">Caça Palavras🔍</h1>
          <Button variant="ghost" onClick={() => gameLogic.togglePause()}>
            {gameLogic.isRunning ? '⏸️ Pausar' : '▶️ Retomar'}
          </Button>

        </div>
        {/* Banner Superior */}
        <AdContainer slot="7716746018" />
        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Board - Left */}
          <div className="lg:col-span-2">
            <Board
              grid={gameLogic.board}
              selectedCells={gameLogic.selectedCells}
              foundWords={gameLogic.foundWords}
              foundWordColors={gameLogic.foundWordColors}
              words={gameLogic.words}
              disabled={!gameLogic.isRunning || gameLogic.isGameComplete || isRewardProcessing}
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
              hintStatusText={rewardMessage || (hintsAvailable > 0 ? 'Use uma dica para revelar uma palavra' : 'Assistir um anúncio para ganhar +1 dica')}
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
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setDifficulty(null)
                  setSegment(null)
                  setShowDifficultyModal(true)
                  setShowSegmentModal(false)
                }}
              >
                🎮 Mudar Dificuldade
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
        }}
        onRestart={() => {
          setShowGameOverModal(false)
          gameLogic.reset()
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
