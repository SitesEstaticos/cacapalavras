// Types para o jogo de caça-palavras

export * from './Category'

export enum GameDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum WordSegment {
  AGROPECUARIA = 'agropecuaria',
  CIENCIAS = 'ciencias',
  TECNOLOGIA = 'tecnologia',
  BIBLICA = 'biblica',
}

export enum GameMode {
  CLASSIC = 'classic',     // Modo Tradicional: exibe a palavra na lista e 1ª letra + direção na dica
  CHALLENGE = 'challenge', // Modo Significados: oculta a palavra na lista; exibe 1ª letra + direção + conceito/significado na dica
}

export enum WordDirection {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
  DIAGONAL_DOWN = 'diagonal_down',
  DIAGONAL_UP = 'diagonal_up',
  REVERSE_HORIZONTAL = 'reverse_horizontal',
  REVERSE_VERTICAL = 'reverse_vertical',
  REVERSE_DIAGONAL_DOWN = 'reverse_diagonal_down',
  REVERSE_DIAGONAL_UP = 'reverse_diagonal_up',
}

export interface Position {
  row: number
  col: number
}

export interface Word {
  id: string
  text: string
  startPos: Position
  endPos: Position
  direction: WordDirection
  hint: string
  found: boolean
}

export interface BoardCell {
  letter: string
  wordIds: string[]
  isSelected: boolean
  isHinted?: boolean
}

export interface GameBoard {
  grid: BoardCell[][]
  width: number
  height: number
  words: Word[]
}

export interface GameState {
  board: GameBoard
  selectedCells: Position[]
  currentWord: string
  score: number
  time: number
  isRunning: boolean
  difficulty: GameDifficulty
  gameMode: GameMode
  foundWords: string[]
  totalWords: number
  remainingHints: number
  usedHints: number
  rewardedHints: number
  rewardedAdsWatched: number
  gameStart: number
  gameFinish: number | null
}

export interface SelectionPath {
  startPos: Position
  endPos: Position
  cells: Position[]
}

export interface HintData {
  dailyHints: number
  totalHintsUsed: number
  lastResetDate: string
  adsWatched: number
}

export type HintStrategy = 'first_letter' | 'direction' | 'partial_word' | 'highlight_area'
export type HintType = 'free' | 'rewarded'

export interface HintState {
  remainingHints: number
  usedHints: number
  rewardedHints: number
  rewardedAdsWatched: number
  gameStart: number
  gameFinish: number | null
}

export interface HintUsageResult {
  ok: boolean
  reason?: 'none_remaining' | 'not_started' | 'unknown'
  remainingHints?: number
}

export interface RewardRequestState {
  ok: boolean
  reason: 'in_flight' | 'cooldown' | 'provider' | 'error' | 'started' | 'not_requested' | 'unknown'
  remainingMs?: number
  error?: unknown
}

export interface RewardDelivery {
  type: 'hint'
  amount: number
  grantedAt: number
}

export interface RewardDeliveryResult {
  ok: boolean
  reason?: string
  reward?: RewardDelivery
}

export interface UserProgress {
  totalGamesPlayed: number
  totalWordsFound: number
  totalScore: number
  bestTime: number
  currentStreak: number
  lastPlayedDate: string
  achievements: Achievement[]
  statistics: GameStatistics
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: string | null
}

export interface GameStatistics {
  gamesPlayed: number
  gamesWon: number
  totalPlayTime: number
  averageTime: number
  averageScore: number
  totalWordsFound: number
  preferredDifficulty: GameDifficulty
  preferredMode?: GameMode
  classicGamesPlayed?: number
  challengeGamesPlayed?: number
}

export interface GameSession {
  id: string
  difficulty: GameDifficulty
  gameMode: GameMode
  startTime: number
  endTime: number | null
  board: GameBoard
  foundWords: string[]
  score: number
  completed: boolean
}

export interface RewardedAdConfig {
  rewardAmount: number
  cooldownMs: number
  maxAdsPerDay: number
}

export interface AdReward {
  type: 'hint' | 'coins' | 'bonus_score'
  amount: number
  timestamp: number
}

export interface ThemeConfig {
  isDark: boolean
  colors: {
    primary: string
    secondary: string
    background: string
    surface: string
  }
}

export interface AnimationConfig {
  duration: number
  delay: number
  easing: string
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  soundEnabled: boolean
  hapticFeedbackEnabled: boolean
  animationsEnabled: boolean
  language: string
}