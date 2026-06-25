// Score Service - Gerencia pontuação do jogador

import { GameDifficulty } from '@/types'

export class ScoreService {
  private readonly baseScores = {
    [GameDifficulty.EASY]: 100,
    [GameDifficulty.MEDIUM]: 250,
    [GameDifficulty.HARD]: 500,
  }

  private readonly timeBonus = {
    [GameDifficulty.EASY]: 1,
    [GameDifficulty.MEDIUM]: 2,
    [GameDifficulty.HARD]: 3,
  }

  calculateScore(
    difficulty: GameDifficulty,
    timeSeconds: number,
    wordLength: number,
    perfectTime: number
  ): number {
    const baseScore = this.baseScores[difficulty]
    const multiplier = this.calculateWordMultiplier(wordLength)

    // Bônus por tempo (até 50% do score)
    const timeBonus = Math.max(
      0,
      Math.floor(((perfectTime - timeSeconds) / perfectTime) * baseScore * 0.5)
    )

    return Math.floor(baseScore * multiplier + timeBonus)
  }

  private calculateWordMultiplier(wordLength: number): number {
    // Palavras mais longas valem mais
    return Math.min(1 + wordLength * 0.1, 2)
  }

  calculateTotalScore(
    scores: number[],
    perfectTime: number,
    actualTime: number,
    difficulty: GameDifficulty
  ): number {
    const subtotal = scores.reduce((a, b) => a + b, 0)

    // Bônus por completar antes do tempo perfeito
    const timeBonus =
      actualTime < perfectTime ? Math.floor((perfectTime - actualTime) * this.timeBonus[difficulty]) : 0

    // Bônus de dificuldade
    const difficultyBonus = difficulty === GameDifficulty.HARD ? subtotal * 0.2 : 0

    return Math.floor(subtotal + timeBonus + difficultyBonus)
  }

  getMaxScore(difficulty: GameDifficulty, wordCount: number): number {
    const basePerWord = this.baseScores[difficulty]
    return basePerWord * wordCount * 2
  }

  calculateStreakBonus(streak: number): number {
    // Bônus progressivo por sequência diária
    if (streak < 3) return 1
    if (streak < 7) return 1.15
    if (streak < 14) return 1.25
    return 1.5
  }
}

export class RewardService {
  private readonly coinsPerWord: Record<GameDifficulty, number> = {
    [GameDifficulty.EASY]: 5,
    [GameDifficulty.MEDIUM]: 15,
    [GameDifficulty.HARD]: 30,
  }

  calculateCoinsForWord(wordLength: number, difficulty: GameDifficulty): number {
    const base = this.coinsPerWord[difficulty] || 10
    const lengthBonus = Math.floor(wordLength / 3)
    return base + lengthBonus
  }

  calculateCoinsForGameCompletion(
    difficulty: GameDifficulty,
    timeSeconds: number,
    wordCount: number
  ): number {
    const baseCoins = this.coinsPerWord[difficulty] || 10
    const totalCoins = baseCoins * wordCount

    // Bônus por tempo rápido
    const timeBonus = timeSeconds < 60 ? Math.floor(totalCoins * 0.2) : 0

    return totalCoins + timeBonus
  }

  getRewardTiers() {
    return {
      bronze: { threshold: 100, multiplier: 1 },
      silver: { threshold: 500, multiplier: 1.2 },
      gold: { threshold: 1000, multiplier: 1.5 },
      platinum: { threshold: 5000, multiplier: 2 },
    }
  }

  calculateRewardMultiplier(totalEarned: number): number {
    const tiers = this.getRewardTiers()

    if (totalEarned >= tiers.platinum.threshold) return tiers.platinum.multiplier
    if (totalEarned >= tiers.gold.threshold) return tiers.gold.multiplier
    if (totalEarned >= tiers.silver.threshold) return tiers.silver.multiplier
    return tiers.bronze.multiplier
  }
}

export class AnalyticsService {
  async logGameStart(difficulty: string): Promise<void> {
    console.log(`[Analytics] Game started - Difficulty: ${difficulty}`)
  }

  async logGameComplete(
    difficulty: string,
    timeSeconds: number,
    score: number,
    wordsFound: number
  ): Promise<void> {
    console.log('[Analytics] Game completed', {
      difficulty,
      timeSeconds,
      score,
      wordsFound,
    })
  }

  async logWordFound(word: string, timeSeconds: number): Promise<void> {
    console.log(`[Analytics] Word found: ${word} in ${timeSeconds}s`)
  }

  async logHintUsed(strategy: string): Promise<void> {
    console.log(`[Analytics] Hint used: ${strategy}`)
  }

  async logAdShown(adType: string): Promise<void> {
    console.log(`[Analytics] Ad shown: ${adType}`)
  }

  async logAdRewarded(adType: string): Promise<void> {
    console.log(`[Analytics] Ad rewarded: ${adType}`)
  }

  async trackUserSession(sessionData: Record<string, unknown>): Promise<void> {
    console.log('[Analytics] Session tracked:', sessionData)
  }
}
