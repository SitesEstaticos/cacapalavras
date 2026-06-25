// Adaptadores para compatibilidade com React Native
// Web Storage Adapter
export class WebStorageAdapter {
    async getItem(key) {
        return localStorage.getItem(key);
    }
    async setItem(key, value) {
        localStorage.setItem(key, value);
    }
    async removeItem(key) {
        localStorage.removeItem(key);
    }
    async getAllKeys() {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key)
                keys.push(key);
        }
        return keys;
    }
    async clear() {
        localStorage.clear();
    }
}
// Mock Ad Providers (para desenvolvimento)
export class MockRewardedAdProvider {
    constructor() {
        Object.defineProperty(this, "adClosed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "adRewarded", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "adFailed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "onAdClosed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (callback) => {
                this.adClosed = callback;
            }
        });
        Object.defineProperty(this, "onAdRewarded", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (callback) => {
                this.adRewarded = callback;
            }
        });
        Object.defineProperty(this, "onAdFailed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (callback) => {
                this.adFailed = callback;
            }
        });
    }
    async isReady() {
        return true;
    }
    async show() {
        // Simular anúncio
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.adRewarded?.();
        this.adClosed?.();
    }
    async load() {
        // Mock
    }
}
export class MockBannerAdProvider {
    async show() {
        // Mock
    }
    async hide() {
        // Mock
    }
    async destroy() {
        // Mock
    }
}
export class MockInterstitialProvider {
    constructor() {
        Object.defineProperty(this, "adClosed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "adFailed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "onAdClosed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (callback) => {
                this.adClosed = callback;
            }
        });
        Object.defineProperty(this, "onAdFailed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (callback) => {
                this.adFailed = callback;
            }
        });
    }
    async isReady() {
        return true;
    }
    async show() {
        await new Promise(resolve => setTimeout(resolve, 1500));
        this.adClosed?.();
    }
    async load() {
        // Mock
    }
}
// Mock Analytics
export class MockAnalyticsAdapter {
    async logEvent(eventName, params) {
        console.log('[Analytics]', eventName, params);
    }
    async setUserProperty(key, value) {
        console.log('[Analytics] Property:', key, value);
    }
    async logError(error, context) {
        console.error('[Analytics] Error:', error, context);
    }
}
