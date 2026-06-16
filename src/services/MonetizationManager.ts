// Monetization Manager - Gerencia anúncios de forma desacoplada

import {
  IRewardedAdProvider,
  IBannerAdProvider,
  IInterstitialProvider,
  IAnalyticsAdapter,
} from '@adapters/index'
import { RewardedAdConfig, AdReward } from '@types/index'

export class MonetizationManager {
  private rewardedAdProvider: IRewardedAdProvider
  private bannerAdProvider: IBannerAdProvider
  private interstitialProvider: IInterstitialProvider
  private analyticsAdapter: IAnalyticsAdapter

  private readonly config: RewardedAdConfig = {
    rewardAmount: 1,
    cooldownMs: 30000, // 30 segundos entre anúncios
    maxAdsPerDay: 10,
  }

  private lastAdTime = 0
  private adsShownToday = 0
  private rewards: AdReward[] = []

  constructor(
    rewardedAd: IRewardedAdProvider,
    bannerAd: IBannerAdProvider,
    interstitialAd: IInterstitialProvider,
    analytics: IAnalyticsAdapter
  ) {
    this.rewardedAdProvider = rewardedAd
    this.bannerAdProvider = bannerAd
    this.interstitialProvider = interstitialAd
    this.analyticsAdapter = analytics

    this.setupAdCallbacks()
    this.resetDailyCounter()
  }

  private setupAdCallbacks(): void {
    this.rewardedAdProvider.onAdRewarded(() => {
      this.handleReward('hint')
      this.analyticsAdapter.logEvent('ad_reward', { type: 'rewarded_ad' })
    })

    this.rewardedAdProvider.onAdClosed(() => {
      this.analyticsAdapter.logEvent('ad_closed', { type: 'rewarded_ad' })
    })

    this.rewardedAdProvider.onAdFailed(error => {
      this.analyticsAdapter.logError(error, { context: 'rewarded_ad' })
    })
  }

  async showRewardedAd(): Promise<boolean> {
    if (!this.canShowAd()) {
      console.warn('Cannot show ad: cooldown or daily limit reached')
      return false
    }

    try {
      const isReady = await this.rewardedAdProvider.isReady()

      if (!isReady) {
        await this.rewardedAdProvider.load()
      }

      await this.rewardedAdProvider.show()
      this.lastAdTime = Date.now()
      this.adsShownToday++

      return true
    } catch (error) {
      console.error('Error showing rewarded ad:', error)
      this.analyticsAdapter.logError(
        error instanceof Error ? error : new Error(String(error)),
        { context: 'rewarded_ad_error' }
      )
      return false
    }
  }

  async showInterstitialAd(): Promise<boolean> {
    try {
      const isReady = await this.interstitialProvider.isReady()

      if (!isReady) {
        await this.interstitialProvider.load()
      }

      await this.interstitialProvider.show()
      this.analyticsAdapter.logEvent('interstitial_shown')

      return true
    } catch (error) {
      console.error('Error showing interstitial ad:', error)
      return false
    }
  }

  async showBannerAd(): Promise<void> {
    try {
      await this.bannerAdProvider.show()
      this.analyticsAdapter.logEvent('banner_shown')
    } catch (error) {
      console.error('Error showing banner ad:', error)
    }
  }

  private handleReward(rewardType: 'hint' | 'coins' | 'bonus_score'): void {
    const reward: AdReward = {
      type: rewardType,
      amount: this.config.rewardAmount,
      timestamp: Date.now(),
    }

    this.rewards.push(reward)
    this.analyticsAdapter.logEvent('reward_granted', { type: rewardType })
  }

  private canShowAd(): boolean {
    const timeSinceLastAd = Date.now() - this.lastAdTime
    const cooldownExpired = timeSinceLastAd >= this.config.cooldownMs
    const dailyLimitNotReached = this.adsShownToday < this.config.maxAdsPerDay

    return cooldownExpired && dailyLimitNotReached
  }

  private resetDailyCounter(): void {
    // Reset diário (em produção, usar a data do servidor)
    setInterval(() => {
      this.adsShownToday = 0
      this.rewards = []
    }, 24 * 60 * 60 * 1000)
  }

  getAdConfig(): RewardedAdConfig {
    return this.config
  }

  updateAdConfig(config: Partial<RewardedAdConfig>): void {
    Object.assign(this.config, config)
  }

  getRemainingAds(): number {
    return Math.max(0, this.config.maxAdsPerDay - this.adsShownToday)
  }

  getRewards(): AdReward[] {
    return [...this.rewards]
  }

  canShowRewardedAd(): boolean {
    return this.canShowAd()
  }

  getAdAnalytics() {
    return {
      adsShownToday: this.adsShownToday,
      totalRewards: this.rewards.length,
      remainingAds: this.getRemainingAds(),
      lastAdTime: this.lastAdTime,
    }
  }
}
