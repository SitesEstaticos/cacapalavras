// Storage Service - Gerencia persistência de dados

import { IStorageAdapter } from '@adapters/index'
import { UserProgress, GameSession, GameStatistics, UserPreferences } from '@types/index'

export class StorageService {
  private storage: IStorageAdapter

  constructor(storage: IStorageAdapter) {
    this.storage = storage
  }

  // Game Progress
  async saveGameSession(session: GameSession): Promise<void> {
    const sessions = await this.getAllGameSessions()
    sessions.push(session)
    await this.storage.setItem('game_sessions', JSON.stringify(sessions))
  }

  async getAllGameSessions(): Promise<GameSession[]> {
    const data = await this.storage.getItem('game_sessions')
    return data ? JSON.parse(data) : []
  }

  async getLastGameSession(): Promise<GameSession | null> {
    const sessions = await this.getAllGameSessions()
    return sessions.length > 0 ? sessions[sessions.length - 1] : null
  }

  // User Progress
  async saveUserProgress(progress: UserProgress): Promise<void> {
    await this.storage.setItem('user_progress', JSON.stringify(progress))
  }

  async getUserProgress(): Promise<UserProgress | null> {
    const data = await this.storage.getItem('user_progress')
    return data ? JSON.parse(data) : null
  }

  // Preferences
  async saveUserPreferences(preferences: UserPreferences): Promise<void> {
    await this.storage.setItem('user_preferences', JSON.stringify(preferences))
  }

  async getUserPreferences(): Promise<UserPreferences> {
    const data = await this.storage.getItem('user_preferences')
    return data
      ? JSON.parse(data)
      : {
          theme: 'dark',
          soundEnabled: true,
          hapticFeedbackEnabled: true,
          animationsEnabled: true,
          language: 'pt-BR',
        }
  }

  // Statistics
  async updateStatistics(stats: Partial<GameStatistics>): Promise<void> {
    const progress = await this.getUserProgress()

    if (progress) {
      progress.statistics = { ...progress.statistics, ...stats }
      await this.saveUserProgress(progress)
    }
  }

  // Achievements
  async unlockAchievement(achievementId: string): Promise<void> {
    const progress = await this.getUserProgress()

    if (progress) {
      const achievement = progress.achievements.find(a => a.id === achievementId)
      if (achievement && !achievement.unlockedAt) {
        achievement.unlockedAt = new Date().toISOString()
        await this.saveUserProgress(progress)
      }
    }
  }

  // Generic methods
  async setItem(key: string, value: unknown): Promise<void> {
    await this.storage.setItem(key, JSON.stringify(value))
  }

  async getItem<T>(key: string): Promise<T | null> {
    const data = await this.storage.getItem(key)
    return data ? JSON.parse(data) : null
  }

  async removeItem(key: string): Promise<void> {
    await this.storage.removeItem(key)
  }

  async clear(): Promise<void> {
    await this.storage.clear()
  }
}
