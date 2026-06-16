// Página Principal do Jogo

import React, { useState, useEffect } from 'react'
import {
  Board,
  HUD,
  WordList,
  Button,
  DifficultyModal,
  HintModal,
  GameOverModal,
} from '@components/index'
import { useGameLogic, useHints } from '@hooks/index'
import { StorageService } from '@services/StorageService'
import { HintService } from '@services/HintService'
import { GameDifficulty } from '@types/index'
import { WebStorageAdapter } from '@adapters/index'

export const GamePage: React.FC = () => {
  const storageService = new StorageService(new WebStorageAdapter())
  const [difficulty, setDifficulty] = useState<GameDifficulty | null>(null)
  const [showDifficultyModal, setShowDifficultyModal] = useState(true)
  const [showHintModal, setShowHintModal] = useState(false)
  const [showGameOverModal, setShowGameOverModal] = useState(false)
  const [currentHint, setCurrentHint] = useState('')

  const gameLogic = useGameLogic(difficulty || GameDifficulty.MEDIUM)
  const { hintsAvailable, canWatchAd, useHint, addHintFromAd } = useHints(storageService)

  // Controlar quando mostrar game over
  useEffect(() => {
    if (gameLogic.isGameComplete && gameLogic.isRunning) {
      setShowGameOverModal(true)
    }
  }, [gameLogic.isGameComplete, gameLogic.isRunning])

  const handleDifficultySelect = (selectedDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(selectedDifficulty)
    setShowDifficultyModal(false)
  }

  const handleCellClick = (row: number, col: number) => {
    gameLogic.selectCell(row, col)
  }

  const handleCellMouseEnter = (row: number, col: number) => {
    // Implementar drag para web
    if (gameLogic.selectedCells.length > 0) {
      gameLogic.selectCell(row, col)
    }
  }

  const handleSelectionEnd = () => {
    gameLogic.validateSelection()
  }

  const handleUseHint = async () => {
    const used = await useHint()

    if (used) {
      // Gerar dica aleatória
      const strategies = ['first_letter', 'direction', 'partial_word']
      const strategy = strategies[Math.floor(Math.random() * strategies.length)]

      const remainingWords = gameLogic.words.filter(
        w => !gameLogic.foundWords.includes(w.id)
      )

      if (remainingWords.length > 0) {
        const randomWord = remainingWords[Math.floor(Math.random() * remainingWords.length)]
        const hintService = new HintService(new WebStorageAdapter())
        const hint = hintService.generateHintText(strategy, randomWord.text)
        setCurrentHint(hint)
      }

      setShowHintModal(false)
    }
  }

  const handleWatchAd = async () => {
    // Simular anúncio
    const added = await addHintFromAd()

    if (added) {
      alert('Dica adicionada! 🎉')
      setShowHintModal(false)
    }
  }

  if (!difficulty) {
    return <DifficultyModal isOpen={showDifficultyModal} onSelect={handleDifficultySelect} />
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
          <h1 className="text-4xl font-bold text-secondary">Caça Palavras</h1>
          <Button variant="ghost" onClick={() => gameLogic.togglePause()}>
            {gameLogic.isRunning ? '⏸️ Pausar' : '▶️ Retomar'}
          </Button>
        </div>

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Board - Left */}
          <div className="lg:col-span-2">
            <Board
              grid={gameLogic.board}
              selectedCells={gameLogic.selectedCells}
              foundWords={gameLogic.foundWords}
              words={gameLogic.words}
              onCellClick={handleCellClick}
              onCellMouseEnter={handleCellMouseEnter}
              onSelectionEnd={handleSelectionEnd}
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
            />

            {/* Word List */}
            <WordList
              words={gameLogic.words}
              foundWords={gameLogic.foundWords}
              onWordClick={word => console.log('Palavra clicada:', word)}
            />

            {/* Buttons */}
            <div className="space-y-2">
              <Button variant="primary" className="w-full" onClick={() => gameLogic.reset()}>
                🔄 Novo Jogo
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setShowDifficultyModal(true)}>
                🎮 Mudar Dificuldade
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DifficultyModal isOpen={showDifficultyModal} onSelect={handleDifficultySelect} />

      <HintModal
        isOpen={showHintModal}
        onClose={() => setShowHintModal(false)}
        onUseHint={handleUseHint}
        onWatchAd={handleWatchAd}
        hintsRemaining={hintsAvailable}
        hint={currentHint || 'Procure uma palavra que faz sentido...'}
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
