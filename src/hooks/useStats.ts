import { useState, useEffect, useCallback, useMemo } from 'react'
import { StorageService } from '@services/StorageService'
import { WebStorageAdapter } from '@adapters/index'
import { GameSession, GameDifficulty, WordSegment, GameMode } from '@/types'

export interface GameHistoryItem {
  id: string
  date: string
  timeInSeconds: number
  score: number
  difficulty: string
  segment: string
  mode: GameMode | string
  gameMode?: GameMode | string
}

export interface GameStats {
  gamesPlayed: number
  bestScore: number
  bestTime: number
  averageTime: number
  totalScore: number
  history: GameHistoryItem[]
}

const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  bestScore: 0,
  bestTime: 0,
  averageTime: 0,
  totalScore: 0,
  history: [],
}

export function useStats() {
  const [stats, setStats] = useState<GameStats>(DEFAULT_STATS)
  const [isLoading, setIsLoading] = useState(true)

  const storageService = useMemo(() => new StorageService(new WebStorageAdapter()), [])

  const loadStats = useCallback(async () => {
    try {
      setIsLoading(true)
      const sessions: GameSession[] = await storageService.getAllGameSessions()

      if (!sessions || sessions.length === 0) {
        setStats(DEFAULT_STATS)
        return
      }

      const gamesPlayed = sessions.length

      const totalTime = sessions.reduce((acc, s: any) => {
        const time = s.duration ?? s.time ?? 0
        return acc + Number(time)
      }, 0)

      const totalScore = sessions.reduce((acc, s: any) => {
        const score = s.score ?? 0
        return acc + Number(score)
      }, 0)

      const scores = sessions.map((s: any) => Number(s.score ?? 0))
      const bestScore = scores.length > 0 ? Math.max(...scores) : 0

      const validTimes = sessions
        .map((s: any) => Number(s.duration ?? s.time ?? 0))
        .filter(t => t > 0)

      const bestTime = validTimes.length > 0 ? Math.min(...validTimes) : 0
      const averageTime = gamesPlayed > 0 ? Math.round(totalTime / gamesPlayed) : 0

      const history: GameHistoryItem[] = sessions
        .map((s: any, index: number) => ({
          id: String(s.id || `session_${index}`),
          date: String(s.completedAt || s.gameFinish || new Date().toISOString()),
          timeInSeconds: Number(s.duration ?? s.time ?? 0),
          score: Number(s.score ?? 0),
          difficulty: String(s.difficulty ?? 'Médio'),
          segment: String(s.segment ?? 'Geral'),
          mode: (s.gameMode || s.mode || GameMode.CLASSIC) as GameMode,
          gameMode: (s.gameMode || s.mode || GameMode.CLASSIC) as GameMode,
        }))
        .reverse()

      setStats({
        gamesPlayed,
        bestScore,
        bestTime,
        averageTime,
        totalScore,
        history,
      })
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setIsLoading(false)
    }
  }, [storageService])

  const saveGameStats = useCallback(
    async (
      newScore: number,
      newTime: number,
      difficulty?: GameDifficulty | string,
      segment?: WordSegment | string,
      mode?: GameMode | string
    ) => {
      try {
        const now = new Date()
        const startTime = new Date(now.getTime() - newTime * 1000)

        const finalDifficulty = difficulty ? String(difficulty) : 'Médio'
        const finalSegment = segment ? String(segment) : 'Geral'
        const finalMode = mode ? String(mode) : GameMode.CLASSIC

        const newSession = {
          id: `game_${Date.now()}`,
          startedAt: startTime.toISOString(),
          completedAt: now.toISOString(),
          duration: newTime,
          score: newScore,
          difficulty: finalDifficulty as any,
          segment: finalSegment as any,
          gameMode: finalMode as any,
          mode: finalMode as any,
          foundWords: [],
          totalWords: 0,
          isCompleted: true,
        } as unknown as GameSession

        await storageService.saveGameSession(newSession)
        await loadStats()
      } catch (error) {
        console.error('Erro ao salvar estatísticas:', error)
      }
    },
    [storageService, loadStats]
  )

  const clearStats = useCallback(async () => {
    try {
      await storageService.removeItem('game_sessions')
      await loadStats()
    } catch (error) {
      console.error('Erro ao limpar estatísticas:', error)
    }
  }, [storageService, loadStats])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  return {
    stats,
    isLoading,
    saveGameStats,
    loadStats,
    clearStats,
  }
}