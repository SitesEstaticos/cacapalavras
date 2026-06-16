// Hooks Customizados

import { useEffect, useState, useCallback, useRef } from 'react'
import { GameEngine } from '@services/GameEngine'
import { HintService } from '@services/HintService'
import { StorageService } from '@services/StorageService'
import { GameDifficulty, Position, Word } from '@types/index'

interface UseGameState {
  board: any[][]
  selectedCells: Position[]
  foundWords: string[]
  score: number
  time: number
  isRunning: boolean
  words: Word[]
  isGameComplete: boolean
}

export const useGameLogic = (difficulty: GameDifficulty) => {
  const gameEngineRef = useRef<GameEngine | null>(null)
  const [gameState, setGameState] = useState<UseGameState>({
    board: [],
    selectedCells: [],
    foundWords: [],
    score: 0,
    time: 0,
    isRunning: false,
    words: [],
    isGameComplete: false,
  })

  // Inicializar jogo
  useEffect(() => {
    gameEngineRef.current = new GameEngine()
    const board = gameEngineRef.current.generateBoard(difficulty)

    setGameState(prev => ({
      ...prev,
      board: board.grid,
      words: board.words,
      isRunning: true,
    }))
  }, [difficulty])

  // Timer
  useEffect(() => {
    if (!gameState.isRunning) return

    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        time: prev.time + 1,
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [gameState.isRunning])

  const selectCell = useCallback((row: number, col: number) => {
    if (!gameEngineRef.current) return

    setGameState(prev => {
      const newSelected = [...prev.selectedCells]
      const existsIndex = newSelected.findIndex(pos => pos.row === row && pos.col === col)

      if (existsIndex >= 0) {
        newSelected.splice(existsIndex, 1)
      } else {
        newSelected.push({ row, col })
      }

      return {
        ...prev,
        selectedCells: newSelected,
      }
    })
  }, [])

  const validateSelection = useCallback(() => {
    if (!gameEngineRef.current || gameState.selectedCells.length === 0) return

    const wordId = gameEngineRef.current.validateSelection(gameState.selectedCells)

    if (wordId) {
      gameEngineRef.current.markWordAsFound(wordId)

      // Calcular pontos (exemplo simples)
      const word = gameState.words.find(w => w.id === wordId)
      const points = word ? (word.text.length * 10) : 0

      setGameState(prev => ({
        ...prev,
        foundWords: [...prev.foundWords, wordId],
        score: prev.score + points,
        selectedCells: [],
        isGameComplete: gameEngineRef.current?.isGameComplete() || false,
      }))
    } else {
      // Seleção inválida - limpar
      setGameState(prev => ({
        ...prev,
        selectedCells: [],
      }))
    }
  }, [gameState.selectedCells, gameState.words])

  const reset = useCallback(() => {
    gameEngineRef.current = new GameEngine()
    const board = gameEngineRef.current.generateBoard(difficulty)

    setGameState({
      board: board.grid,
      selectedCells: [],
      foundWords: [],
      score: 0,
      time: 0,
      isRunning: true,
      words: board.words,
      isGameComplete: false,
    })
  }, [difficulty])

  const togglePause = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isRunning: !prev.isRunning,
    }))
  }, [])

  return {
    ...gameState,
    selectCell,
    validateSelection,
    reset,
    togglePause,
  }
}

export const useHints = (storageService: StorageService) => {
  const hintServiceRef = useRef<HintService | null>(null)
  const [hintsAvailable, setHintsAvailable] = useState(0)
  const [canWatchAd, setCanWatchAd] = useState(true)

  useEffect(() => {
    const initHints = async () => {
      hintServiceRef.current = new HintService(storageService['storage'])
      const hintData = await hintServiceRef.current.getDailyHints()
      setHintsAvailable(hintData.dailyHints)
    }

    initHints()
  }, [storageService])

  const useHint = useCallback(async () => {
    if (!hintServiceRef.current) return false

    const used = await hintServiceRef.current.useHint()

    if (used) {
      setHintsAvailable(prev => Math.max(0, prev - 1))
      return true
    }

    return false
  }, [])

  const addHintFromAd = useCallback(async () => {
    if (!hintServiceRef.current) return false

    const added = await hintServiceRef.current.addHintFromAd()

    if (added) {
      setHintsAvailable(prev => prev + 1)
      const canUse = await hintServiceRef.current.canUseAd()
      setCanWatchAd(canUse)
      return true
    }

    return false
  }, [])

  return {
    hintsAvailable,
    canWatchAd,
    useHint,
    addHintFromAd,
  }
}

export const useTimer = (isRunning: boolean) => {
  const [time, setTime] = useState(0)

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setTime(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning])

  return { time, resetTime: () => setTime(0) }
}

export const useTheme = () => {
  const [isDark, setIsDark] = useState(true)

  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const newValue = !prev
      localStorage.setItem('theme', newValue ? 'dark' : 'light')
      return newValue
    })
  }, [])

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setIsDark(savedTheme === 'dark')
    }
  }, [])

  return { isDark, toggleTheme }
}
