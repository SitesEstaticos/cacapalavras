// Types para o jogo de caça-palavras

export enum GameDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum WordSegment {
  AGROPECUARIA = 'agropecuaria',
  INFORMATICA = 'informatica',
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
  foundWords: string[]
  totalWords: number
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
}

export interface GameSession {
  id: string
  difficulty: GameDifficulty
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
