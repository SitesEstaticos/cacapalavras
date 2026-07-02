// Configuração da Aplicação

import { GameEngine } from '@services/GameEngine'
import { HintService } from '@services/HintService'
import { StorageService } from '@services/StorageService'
import { ScoreService, RewardService, AnalyticsService } from '@services/index'
import { MonetizationManager } from '@services/MonetizationManager'
import {
  WebStorageAdapter,
  MockRewardedAdProvider,
  MockBannerAdProvider,
  MockInterstitialProvider,
  MockAnalyticsAdapter,
  IStorageAdapter,
} from '@adapters/index'

export class AppConfig {
  private static instance: AppConfig
  private storageAdapter: IStorageAdapter
  private storageService: StorageService
  private hintService: HintService
  private scoreService: ScoreService
  private rewardService: RewardService
  private analyticsService: AnalyticsService
  private monetizationManager: MonetizationManager

  private constructor() {
    // Inicializar adaptadores
    this.storageAdapter = new WebStorageAdapter()

    // Inicializar serviços
    this.storageService = new StorageService(this.storageAdapter)
    this.hintService = new HintService(this.storageAdapter)
    this.scoreService = new ScoreService()
    this.rewardService = new RewardService()
    this.analyticsService = new AnalyticsService()

    // Inicializar gerenciador de monetização
    this.monetizationManager = new MonetizationManager(
      new MockRewardedAdProvider(),
      new MockBannerAdProvider(),
      new MockInterstitialProvider(),
      new MockAnalyticsAdapter()
    )
  }

  static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig()
    }
    return AppConfig.instance
  }

  getStorageService(): StorageService {
    return this.storageService
  }

  getHintService(): HintService {
    return this.hintService
  }

  getScoreService(): ScoreService {
    return this.scoreService
  }

  getRewardService(): RewardService {
    return this.rewardService
  }

  getAnalyticsService(): AnalyticsService {
    return this.analyticsService
  }

  getMonetizationManager(): MonetizationManager {
    return this.monetizationManager
  }

  getStorageAdapter(): IStorageAdapter {
    return this.storageAdapter
  }
}

export const getAppConfig = () => AppConfig.getInstance()
