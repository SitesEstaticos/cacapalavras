// Hooks Customizados

import { useEffect, useState, useCallback, useRef } from 'react'
import { GameEngine } from '@services/GameEngine'
import { HintService } from '@services/HintService'
import { StorageService } from '@services/StorageService'
import { GameDifficulty, Position, Word, WordSegment } from '@/types'

interface UseGameState {
  board: any[][]
  selectedCells: Position[]
  foundWords: string[]
  foundWordColors: Record<string, string>
  score: number
  time: number
  isRunning: boolean
  words: Word[]
  isGameComplete: boolean
}

interface SelectionDirection {
  rowStep: number
  colStep: number
}

const FOUND_WORD_COLOR = '#047857'

const getStraightPath = (start: Position, end: Position): Position[] => {
  const rowDiff = end.row - start.row
  const colDiff = end.col - start.col

  if (rowDiff === 0 && colDiff === 0) return [start]

  const isHorizontal = rowDiff === 0
  const isVertical = colDiff === 0
  const isDiagonal = Math.abs(rowDiff) === Math.abs(colDiff)

  if (!isHorizontal && !isVertical && !isDiagonal) return [start]

  const rowStep = Math.sign(rowDiff)
  const colStep = Math.sign(colDiff)
  const length = Math.max(Math.abs(rowDiff), Math.abs(colDiff))

  return Array.from({ length: length + 1 }, (_, index) => ({
    row: start.row + rowStep * index,
    col: start.col + colStep * index,
  }))
}

const getSelectionDirection = (start: Position, end: Position): SelectionDirection | null => {
  const rowDiff = end.row - start.row
  const colDiff = end.col - start.col

  if (rowDiff === 0 && colDiff === 0) return null

  const isHorizontal = rowDiff === 0
  const isVertical = colDiff === 0
  const isDiagonal = Math.abs(rowDiff) === Math.abs(colDiff)

  if (!isHorizontal && !isVertical && !isDiagonal) return null

  return {
    rowStep: Math.sign(rowDiff),
    colStep: Math.sign(colDiff),
  }
}

const isCellOnDirection = (
  start: Position,
  cell: Position,
  direction: SelectionDirection
): boolean => {
  const rowDiff = cell.row - start.row
  const colDiff = cell.col - start.col

  if (rowDiff === 0 && colDiff === 0) return true

  if (direction.rowStep === 0) {
    return rowDiff === 0 && Math.sign(colDiff) === direction.colStep
  }

  if (direction.colStep === 0) {
    return colDiff === 0 && Math.sign(rowDiff) === direction.rowStep
  }

  return (
    Math.abs(rowDiff) === Math.abs(colDiff) &&
    Math.sign(rowDiff) === direction.rowStep &&
    Math.sign(colDiff) === direction.colStep
  )
}

export const useGameLogic = (
  difficulty: GameDifficulty,
  segment: WordSegment = WordSegment.AGROPECUARIA
) => {
  const gameEngineRef = useRef<GameEngine | null>(null)
  const selectionDirectionRef = useRef<SelectionDirection | null>(null)
  const selectedCellsRef = useRef<Position[]>([])
  const [gameState, setGameState] = useState<UseGameState>({
    board: [],
    selectedCells: [],
    foundWords: [],
    foundWordColors: {},
    score: 0,
    time: 0,
    isRunning: false,
    words: [],
    isGameComplete: false,
  })

  // Inicializar jogo
  useEffect(() => {
    gameEngineRef.current = new GameEngine()
    selectionDirectionRef.current = null
    selectedCellsRef.current = []
    const board = gameEngineRef.current.generateBoard(difficulty, segment)

    setGameState({
      board: board.grid,
      selectedCells: [],
      foundWords: [],
      foundWordColors: {},
      score: 0,
      time: 0,
      isRunning: true,
      words: board.words,
      isGameComplete: false,
    })
  }, [difficulty, segment])

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

  const startSelection = useCallback((row: number, col: number) => {
    if (!gameEngineRef.current) return

    selectionDirectionRef.current = null
    selectedCellsRef.current = [{ row, col }]
    setGameState(prev => ({
      ...prev,
      selectedCells: [{ row, col }],
    }))
  }, [])

  const updateSelection = useCallback((row: number, col: number) => {
    if (!gameEngineRef.current) return

    setGameState(prev => {
      const nextCell = { row, col }
      const startCell = prev.selectedCells[0]

      if (!startCell) {
        selectionDirectionRef.current = null
        selectedCellsRef.current = [nextCell]
        return {
          ...prev,
          selectedCells: [nextCell],
        }
      }

      if (startCell.row === nextCell.row && startCell.col === nextCell.col) {
        selectionDirectionRef.current = null
        selectedCellsRef.current = [startCell]
        return {
          ...prev,
          selectedCells: [startCell],
        }
      }

      if (!selectionDirectionRef.current) {
        const direction = getSelectionDirection(startCell, nextCell)
        if (!direction) return prev

        selectionDirectionRef.current = direction
      }

      if (!isCellOnDirection(startCell, nextCell, selectionDirectionRef.current)) {
        return prev
      }

      const newSelected = getStraightPath(startCell, nextCell)
      selectedCellsRef.current = newSelected

      return {
        ...prev,
        selectedCells: newSelected,
      }
    })
  }, [])

  const selectCell = updateSelection

  const validateSelection = useCallback(() => {
    const selectedCells = selectedCellsRef.current
    if (!gameEngineRef.current || selectedCells.length === 0) return

    const wordId = gameEngineRef.current.validateSelection(selectedCells)

    if (wordId) {
      gameEngineRef.current.markWordAsFound(wordId)
      const isComplete = gameEngineRef.current.isGameComplete()

      // Calcular pontos (exemplo simples)
      const word = gameState.words.find(w => w.id === wordId)
      const points = word ? (word.text.length * 10) : 0

      setGameState(prev => ({
        ...prev,
        foundWords: [...prev.foundWords, wordId],
        foundWordColors: {
          ...prev.foundWordColors,
          [wordId]: FOUND_WORD_COLOR,
        },
        score: prev.score + points,
        selectedCells: [],
        isRunning: !isComplete,
        isGameComplete: isComplete,
      }))
      selectionDirectionRef.current = null
      selectedCellsRef.current = []
    } else {
      // Seleção inválida - limpar
      setGameState(prev => ({
        ...prev,
        selectedCells: [],
      }))
      selectionDirectionRef.current = null
      selectedCellsRef.current = []
    }
  }, [gameState.selectedCells, gameState.words])

  const reset = useCallback(() => {
    gameEngineRef.current = new GameEngine()
    selectionDirectionRef.current = null
    selectedCellsRef.current = []
    const board = gameEngineRef.current.generateBoard(difficulty, segment)

    setGameState({
      board: board.grid,
      selectedCells: [],
      foundWords: [],
      foundWordColors: {},
      score: 0,
      time: 0,
      isRunning: true,
      words: board.words,
      isGameComplete: false,
    })
  }, [difficulty, segment])

  const togglePause = useCallback(() => {
    selectionDirectionRef.current = null
    selectedCellsRef.current = []

    setGameState(prev => ({
      ...prev,
      selectedCells: [],
      isRunning: prev.isGameComplete ? false : !prev.isRunning,
    }))
  }, [])

  return {
    ...gameState,
    startSelection,
    updateSelection,
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
