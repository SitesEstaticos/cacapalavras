// Storage Service - Gerencia persistência de dados
export class StorageService {
    constructor(storage) {
        Object.defineProperty(this, "storage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.storage = storage;
    }
    // Game Progress
    async saveGameSession(session) {
        const sessions = await this.getAllGameSessions();
        sessions.push(session);
        await this.storage.setItem('game_sessions', JSON.stringify(sessions));
    }
    async getAllGameSessions() {
        const data = await this.storage.getItem('game_sessions');
        return data ? JSON.parse(data) : [];
    }
    async getLastGameSession() {
        const sessions = await this.getAllGameSessions();
        return sessions.length > 0 ? sessions[sessions.length - 1] : null;
    }
    // User Progress
    async saveUserProgress(progress) {
        await this.storage.setItem('user_progress', JSON.stringify(progress));
    }
    async getUserProgress() {
        const data = await this.storage.getItem('user_progress');
        return data ? JSON.parse(data) : null;
    }
    // Preferences
    async saveUserPreferences(preferences) {
        await this.storage.setItem('user_preferences', JSON.stringify(preferences));
    }
    async getUserPreferences() {
        const data = await this.storage.getItem('user_preferences');
        return data
            ? JSON.parse(data)
            : {
                theme: 'dark',
                soundEnabled: true,
                hapticFeedbackEnabled: true,
                animationsEnabled: true,
                language: 'pt-BR',
            };
    }
    // Statistics
    async updateStatistics(stats) {
        const progress = await this.getUserProgress();
        if (progress) {
            progress.statistics = { ...progress.statistics, ...stats };
            await this.saveUserProgress(progress);
        }
    }
    // Achievements
    async unlockAchievement(achievementId) {
        const progress = await this.getUserProgress();
        if (progress) {
            const achievement = progress.achievements.find(a => a.id === achievementId);
            if (achievement && !achievement.unlockedAt) {
                achievement.unlockedAt = new Date().toISOString();
                await this.saveUserProgress(progress);
            }
        }
    }
    // Generic methods
    async setItem(key, value) {
        await this.storage.setItem(key, JSON.stringify(value));
    }
    async getItem(key) {
        const data = await this.storage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
    async removeItem(key) {
        await this.storage.removeItem(key);
    }
    async clear() {
        await this.storage.clear();
    }
}
