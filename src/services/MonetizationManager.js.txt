// Monetization Manager - Gerencia anúncios de forma desacoplada
export class MonetizationManager {
    constructor(rewardedAd, bannerAd, interstitialAd, analytics) {
        Object.defineProperty(this, "rewardedAdProvider", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "bannerAdProvider", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "interstitialProvider", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "analyticsAdapter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                rewardAmount: 1,
                cooldownMs: 30000, // 30 segundos entre anúncios
                maxAdsPerDay: 10,
            }
        });
        Object.defineProperty(this, "lastAdTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "adsShownToday", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "rewards", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        this.rewardedAdProvider = rewardedAd;
        this.bannerAdProvider = bannerAd;
        this.interstitialProvider = interstitialAd;
        this.analyticsAdapter = analytics;
        this.setupAdCallbacks();
        this.resetDailyCounter();
    }
    setupAdCallbacks() {
        this.rewardedAdProvider.onAdRewarded(() => {
            this.handleReward('hint');
            this.analyticsAdapter.logEvent('ad_reward', { type: 'rewarded_ad' });
        });
        this.rewardedAdProvider.onAdClosed(() => {
            this.analyticsAdapter.logEvent('ad_closed', { type: 'rewarded_ad' });
        });
        this.rewardedAdProvider.onAdFailed(error => {
            this.analyticsAdapter.logError(error, { context: 'rewarded_ad' });
        });
    }
    async showRewardedAd() {
        if (!this.canShowAd()) {
            console.warn('Cannot show ad: cooldown or daily limit reached');
            return false;
        }
        try {
            const isReady = await this.rewardedAdProvider.isReady();
            if (!isReady) {
                await this.rewardedAdProvider.load();
            }
            await this.rewardedAdProvider.show();
            this.lastAdTime = Date.now();
            this.adsShownToday++;
            return true;
        }
        catch (error) {
            console.error('Error showing rewarded ad:', error);
            this.analyticsAdapter.logError(error instanceof Error ? error : new Error(String(error)), { context: 'rewarded_ad_error' });
            return false;
        }
    }
    async showInterstitialAd() {
        try {
            const isReady = await this.interstitialProvider.isReady();
            if (!isReady) {
                await this.interstitialProvider.load();
            }
            await this.interstitialProvider.show();
            this.analyticsAdapter.logEvent('interstitial_shown');
            return true;
        }
        catch (error) {
            console.error('Error showing interstitial ad:', error);
            return false;
        }
    }
    async showBannerAd() {
        try {
            await this.bannerAdProvider.show();
            this.analyticsAdapter.logEvent('banner_shown');
        }
        catch (error) {
            console.error('Error showing banner ad:', error);
        }
    }
    handleReward(rewardType) {
        const reward = {
            type: rewardType,
            amount: this.config.rewardAmount,
            timestamp: Date.now(),
        };
        this.rewards.push(reward);
        this.analyticsAdapter.logEvent('reward_granted', { type: rewardType });
    }
    canShowAd() {
        const timeSinceLastAd = Date.now() - this.lastAdTime;
        const cooldownExpired = timeSinceLastAd >= this.config.cooldownMs;
        const dailyLimitNotReached = this.adsShownToday < this.config.maxAdsPerDay;
        return cooldownExpired && dailyLimitNotReached;
    }
    resetDailyCounter() {
        // Reset diário (em produção, usar a data do servidor)
        setInterval(() => {
            this.adsShownToday = 0;
            this.rewards = [];
        }, 24 * 60 * 60 * 1000);
    }
    getAdConfig() {
        return this.config;
    }
    updateAdConfig(config) {
        Object.assign(this.config, config);
    }
    getRemainingAds() {
        return Math.max(0, this.config.maxAdsPerDay - this.adsShownToday);
    }
    getRewards() {
        return [...this.rewards];
    }
    canShowRewardedAd() {
        return this.canShowAd();
    }
    getAdAnalytics() {
        return {
            adsShownToday: this.adsShownToday,
            totalRewards: this.rewards.length,
            remainingAds: this.getRemainingAds(),
            lastAdTime: this.lastAdTime,
        };
    }
}
