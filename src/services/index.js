// Score Service - Gerencia pontuação do jogador
import { GameDifficulty } from '@types/index';
export class ScoreService {
    constructor() {
        Object.defineProperty(this, "baseScores", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                [GameDifficulty.EASY]: 100,
                [GameDifficulty.MEDIUM]: 250,
                [GameDifficulty.HARD]: 500,
            }
        });
        Object.defineProperty(this, "timeBonus", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                [GameDifficulty.EASY]: 1,
                [GameDifficulty.MEDIUM]: 2,
                [GameDifficulty.HARD]: 3,
            }
        });
    }
    calculateScore(difficulty, timeSeconds, wordLength, perfectTime) {
        const baseScore = this.baseScores[difficulty];
        const multiplier = this.calculateWordMultiplier(wordLength);
        // Bônus por tempo (até 50% do score)
        const timeBonus = Math.max(0, Math.floor(((perfectTime - timeSeconds) / perfectTime) * baseScore * 0.5));
        return Math.floor(baseScore * multiplier + timeBonus);
    }
    calculateWordMultiplier(wordLength) {
        // Palavras mais longas valem mais
        return Math.min(1 + wordLength * 0.1, 2);
    }
    calculateTotalScore(scores, perfectTime, actualTime, difficulty) {
        const subtotal = scores.reduce((a, b) => a + b, 0);
        // Bônus por completar antes do tempo perfeito
        const timeBonus = actualTime < perfectTime ? Math.floor((perfectTime - actualTime) * this.timeBonus[difficulty]) : 0;
        // Bônus de dificuldade
        const difficultyBonus = difficulty === GameDifficulty.HARD ? subtotal * 0.2 : 0;
        return Math.floor(subtotal + timeBonus + difficultyBonus);
    }
    getMaxScore(difficulty, wordCount) {
        const basePerWord = this.baseScores[difficulty];
        return basePerWord * wordCount * 2;
    }
    calculateStreakBonus(streak) {
        // Bônus progressivo por sequência diária
        if (streak < 3)
            return 1;
        if (streak < 7)
            return 1.15;
        if (streak < 14)
            return 1.25;
        return 1.5;
    }
}
export class RewardService {
    constructor() {
        Object.defineProperty(this, "coinsPerWord", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                easy: 5,
                medium: 15,
                hard: 30,
            }
        });
    }
    calculateCoinsForWord(wordLength, difficulty) {
        const base = this.coinsPerWord[difficulty] || 10;
        const lengthBonus = Math.floor(wordLength / 3);
        return base + lengthBonus;
    }
    calculateCoinsForGameCompletion(difficulty, timeSeconds, wordCount) {
        const baseCoins = this.coinsPerWord[difficulty] || 10;
        const totalCoins = baseCoins * wordCount;
        // Bônus por tempo rápido
        const timeBonus = timeSeconds < 60 ? Math.floor(totalCoins * 0.2) : 0;
        return totalCoins + timeBonus;
    }
    getRewardTiers() {
        return {
            bronze: { threshold: 100, multiplier: 1 },
            silver: { threshold: 500, multiplier: 1.2 },
            gold: { threshold: 1000, multiplier: 1.5 },
            platinum: { threshold: 5000, multiplier: 2 },
        };
    }
    calculateRewardMultiplier(totalEarned) {
        const tiers = this.getRewardTiers();
        if (totalEarned >= tiers.platinum.threshold)
            return tiers.platinum.multiplier;
        if (totalEarned >= tiers.gold.threshold)
            return tiers.gold.multiplier;
        if (totalEarned >= tiers.silver.threshold)
            return tiers.silver.multiplier;
        return tiers.bronze.multiplier;
    }
}
export class AnalyticsService {
    async logGameStart(difficulty) {
        console.log(`[Analytics] Game started - Difficulty: ${difficulty}`);
    }
    async logGameComplete(difficulty, timeSeconds, score, wordsFound) {
        console.log('[Analytics] Game completed', {
            difficulty,
            timeSeconds,
            score,
            wordsFound,
        });
    }
    async logWordFound(word, timeSeconds) {
        console.log(`[Analytics] Word found: ${word} in ${timeSeconds}s`);
    }
    async logHintUsed(strategy) {
        console.log(`[Analytics] Hint used: ${strategy}`);
    }
    async logAdShown(adType) {
        console.log(`[Analytics] Ad shown: ${adType}`);
    }
    async logAdRewarded(adType) {
        console.log(`[Analytics] Ad rewarded: ${adType}`);
    }
    async trackUserSession(sessionData) {
        console.log('[Analytics] Session tracked:', sessionData);
    }
}
