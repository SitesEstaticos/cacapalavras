// Configuração da Aplicação
import { HintService } from '@services/HintService';
import { StorageService } from '@services/StorageService';
import { ScoreService, RewardService, AnalyticsService } from '@services/index';
import { MonetizationManager } from '@services/MonetizationManager';
import { WebStorageAdapter, MockRewardedAdProvider, MockBannerAdProvider, MockInterstitialProvider, MockAnalyticsAdapter, } from '@adapters/index';
export class AppConfig {
    constructor() {
        Object.defineProperty(this, "storageAdapter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "storageService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "hintService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "scoreService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "rewardService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "analyticsService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "monetizationManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // Inicializar adaptadores
        this.storageAdapter = new WebStorageAdapter();
        // Inicializar serviços
        this.storageService = new StorageService(this.storageAdapter);
        this.hintService = new HintService(this.storageAdapter);
        this.scoreService = new ScoreService();
        this.rewardService = new RewardService();
        this.analyticsService = new AnalyticsService();
        // Inicializar gerenciador de monetização
        this.monetizationManager = new MonetizationManager(new MockRewardedAdProvider(), new MockBannerAdProvider(), new MockInterstitialProvider(), new MockAnalyticsAdapter());
    }
    static getInstance() {
        if (!AppConfig.instance) {
            AppConfig.instance = new AppConfig();
        }
        return AppConfig.instance;
    }
    getStorageService() {
        return this.storageService;
    }
    getHintService() {
        return this.hintService;
    }
    getScoreService() {
        return this.scoreService;
    }
    getRewardService() {
        return this.rewardService;
    }
    getAnalyticsService() {
        return this.analyticsService;
    }
    getMonetizationManager() {
        return this.monetizationManager;
    }
    getStorageAdapter() {
        return this.storageAdapter;
    }
}
export const getAppConfig = () => AppConfig.getInstance();
