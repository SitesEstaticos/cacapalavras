// Hooks Customizados

import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { GameEngine } from '@services/GameEngine'
import { HintService } from '@services/HintService'
import { GameEventBus } from '@services/EventBus'
import { RewardService, GoogleAdManagerProvider } from '@services/RewardService'
import { StorageService } from '@services/StorageService'
import { WebStorageAdapter } from '@adapters/index'
import { GameDifficulty, HintState, Position, Word, WordSegment } from '@/types'

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
  remainingHints: number
  usedHints: number
  rewardedHints: number
  rewardedAdsWatched: number
  gameStart: number
  gameFinish: number | null
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
    remainingHints: 0,
    usedHints: 0,
    rewardedHints: 0,
    rewardedAdsWatched: 0,
    gameStart: Date.now(),
    gameFinish: null,
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
      remainingHints: 0,
      usedHints: 0,
      rewardedHints: 0,
      rewardedAdsWatched: 0,
      gameStart: Date.now(),
      gameFinish: null,
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
      remainingHints: 0,
      usedHints: 0,
      rewardedHints: 0,
      rewardedAdsWatched: 0,
      gameStart: Date.now(),
      gameFinish: null,
    })
  }, [difficulty, segment])

  const cancelSelection = useCallback(() => {
    selectionDirectionRef.current = null
    selectedCellsRef.current = []
    setGameState(prev => ({
      ...prev,
      selectedCells: [],
    }))
  }, [])

  const togglePause = useCallback(() => {
    selectionDirectionRef.current = null
    selectedCellsRef.current = []

    setGameState(prev => ({
      ...prev,
      selectedCells: [],
      isRunning: prev.isGameComplete ? false : !prev.isRunning,
    }))
  }, [])

  const pause = useCallback(() => {
    selectionDirectionRef.current = null
    selectedCellsRef.current = []

    setGameState(prev => ({
      ...prev,
      selectedCells: [],
      isRunning: false,
    }))
  }, [])

  const resume = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isRunning: !prev.isGameComplete,
    }))
  }, [])

  return {
    ...gameState,
    startSelection,
    updateSelection,
    selectCell,
    validateSelection,
    cancelSelection,
    reset,
    togglePause,
    pause,
    resume,
  }
}

export const useHints = (storageService: StorageService) => {
  const hintServiceRef = useRef<HintService | null>(null)
  const rewardServiceRef = useRef<RewardService | null>(null)
  const [hintState, setHintState] = useState<HintState>({
    remainingHints: 0,
    usedHints: 0,
    rewardedHints: 0,
    rewardedAdsWatched: 0,
    gameStart: Date.now(),
    gameFinish: null,
  })
  const [isRewardProcessing, setIsRewardProcessing] = useState(false)
  const [cooldownRemaining, setCooldownRemaining] = useState(0)
  const [rewardMessage, setRewardMessage] = useState('')

  const eventBus = useMemo(() => new GameEventBus(), [])

  useEffect(() => {
    let isMounted = true

    const initHints = async () => {
      try {
        const adapter = new WebStorageAdapter()
        hintServiceRef.current = new HintService(adapter, eventBus)
        rewardServiceRef.current = new RewardService(
          new GoogleAdManagerProvider(),
          eventBus,
          30000
        )
        const state = await hintServiceRef.current.getHintState()

        if (isMounted) {
          setHintState(state)
          setRewardMessage('')
        }
      } catch {
        if (isMounted) {
          setHintState(prev => ({ ...prev, remainingHints: 0 }))
        }
      }
    }

    initHints()

    return () => {
      isMounted = false
    }
  }, [eventBus, storageService])

  useEffect(() => {
    if (!rewardServiceRef.current || !rewardServiceRef.current.isCooldownActive()) {
      if (cooldownRemaining > 0) {
        setCooldownRemaining(0)
      }
      return
    }

    const interval = window.setInterval(() => {
      const remainingMs = rewardServiceRef.current?.getCooldownRemainingMs() ?? 0
      const seconds = Math.max(0, Math.ceil(remainingMs / 1000))
      setCooldownRemaining(seconds)

      if (seconds === 0) {
        rewardServiceRef.current?.completeCooldown()
      }
    }, 1000)

    return () => window.clearInterval(interval)
  }, [cooldownRemaining, hintState.rewardedAdsWatched])

  const useHint = useCallback(async () => {
    if (!hintServiceRef.current) return false

    const result = await hintServiceRef.current.useHint()

    if (result.ok) {
      setHintState(prev => ({ ...prev, remainingHints: result.remainingHints ?? prev.remainingHints }))
      setRewardMessage('')
      return true
    }

    setRewardMessage('Não há mais dicas disponíveis para esta partida.')
    return false
  }, [])

  const addHintFromAd = useCallback(async () => {
    if (!hintServiceRef.current || !rewardServiceRef.current) {
      setRewardMessage('Serviço de recompensa indisponível.')
      return false
    }

    if ((hintState.remainingHints ?? 0) > 0) {
      setRewardMessage('Você ainda possui dicas disponíveis para esta partida.')
      return false
    }

    if (rewardServiceRef.current.isCooldownActive()) {
      const remaining = rewardServiceRef.current.getCooldownRemainingMs()
      setRewardMessage(`Disponível em ${Math.ceil(remaining / 1000)} segundos.`)
      return false
    }

    setIsRewardProcessing(true)
    setRewardMessage('Carregando anúncio para a recompensa da dica...')

    const request = await rewardServiceRef.current.requestReward()

    if (!request.ok) {
      setIsRewardProcessing(false)
      if (request.reason === 'cooldown') {
        const remaining = request.remainingMs ?? 0
        setRewardMessage(`Disponível em ${Math.ceil(remaining / 1000)} segundos.`)
      } else {
        setRewardMessage('Não foi possível iniciar o anúncio neste momento.')
      }
      return false
    }

    const claimed = await rewardServiceRef.current.claimReward()
    setIsRewardProcessing(false)

    if (!claimed.ok) {
      setRewardMessage('A recompensa não pôde ser entregue.')
      return false
    }

    const nextState = await hintServiceRef.current.addHints(claimed.reward?.amount ?? 1)
    setHintState(nextState)
    setRewardMessage('Você ganhou mais uma dica!')
    return true
  }, [])

  const resetHints = useCallback(async () => {
    if (!hintServiceRef.current) return

    const nextState = await hintServiceRef.current.resetHints()
    setHintState(nextState)
    setRewardMessage('')
  }, [])

  return {
    hintsAvailable: hintState.remainingHints,
    canWatchAd:
      hintState.remainingHints === 0 &&
      !rewardServiceRef.current?.isCooldownActive() &&
      !isRewardProcessing,
    useHint,
    addHintFromAd,
    resetHints,
    isRewardProcessing,
    isCooldownActive: rewardServiceRef.current?.isCooldownActive() ?? false,
    cooldownSeconds: cooldownRemaining,
    rewardMessage,
    hintState,
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
