// Constantes da Aplicação

export const APP_NAME = 'Caça Palavras'
export const APP_VERSION = '1.0.0'

export const GAME_CONFIG = {
  BOARD_SIZES: {
    EASY: { width: 10, height: 10 },
    MEDIUM: { width: 12, height: 12 },
    HARD: { width: 14, height: 14 },
  },
  WORD_COUNTS: {
    EASY: 5,
    MEDIUM: 8,
    HARD: 12,
  },
  PERFECT_TIMES: {
    EASY: 180, // 3 minutos
    MEDIUM: 300, // 5 minutos
    HARD: 600, // 10 minutos
  },
}

export const HINTS_CONFIG = {
  DAILY_FREE_HINTS: 3,
  MAX_ADS_PER_DAY: 10,
  AD_COOLDOWN_MS: 30000,
}

export const SCORE_CONFIG = {
  BASE_SCORES: {
    EASY: 100,
    MEDIUM: 250,
    HARD: 500,
  },
  TIME_BONUS_MULTIPLIER: {
    EASY: 1,
    MEDIUM: 2,
    HARD: 3,
  },
}

export const COLORS = {
  PRIMARY: '#1A535C',
  SECONDARY: '#4ECDC4',
  BACKGROUND: '#0B1220',
  SURFACE: '#0B1220',
  LIGHT: '#FFFFFF',
  MUTED: '#CBD5E1',
  SUCCESS: '#10B981',
  ERROR: '#EF4444',
  WARNING: '#F59E0B',
}

export const STORAGE_KEYS = {
  USER_PROGRESS: 'user_progress',
  GAME_HINTS: 'game_hints_data',
  GAME_SESSIONS: 'game_sessions',
  USER_PREFERENCES: 'user_preferences',
  ACHIEVEMENTS: 'achievements',
  THEME: 'theme',
}

export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
}

export const ROUTES = {
  HOME: '/',
  GAME: '/game',
  MENU: '/menu',
  SETTINGS: '/settings',
  ACHIEVEMENTS: '/achievements',
  STATISTICS: '/statistics',
}
