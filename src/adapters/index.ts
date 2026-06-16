// Adaptadores para compatibilidade com React Native

export interface IStorageAdapter {
  getItem(key: string): Promise<string | null>
  setItem(key: string, value: string): Promise<void>
  removeItem(key: string): Promise<void>
  getAllKeys(): Promise<string[]>
  clear(): Promise<void>
}

export interface IRewardedAdProvider {
  isReady(): Promise<boolean>
  show(): Promise<void>
  load(): Promise<void>
  onAdClosed: (callback: () => void) => void
  onAdRewarded: (callback: () => void) => void
  onAdFailed: (callback: (error: Error) => void) => void
}

export interface IBannerAdProvider {
  show(): Promise<void>
  hide(): Promise<void>
  destroy(): Promise<void>
}

export interface IInterstitialProvider {
  isReady(): Promise<boolean>
  show(): Promise<void>
  load(): Promise<void>
  onAdClosed: (callback: () => void) => void
  onAdFailed: (callback: (error: Error) => void) => void
}

export interface IAnalyticsAdapter {
  logEvent(eventName: string, params?: Record<string, string | number>): Promise<void>
  setUserProperty(key: string, value: string | number): Promise<void>
  logError(error: Error, context?: Record<string, unknown>): Promise<void>
}

export interface INavigationAdapter {
  navigate(screen: string, params?: Record<string, unknown>): void
  goBack(): void
  reset(routes: Array<{ name: string; params?: Record<string, unknown> }>): void
}

// Web Storage Adapter
export class WebStorageAdapter implements IStorageAdapter {
  async getItem(key: string): Promise<string | null> {
    return localStorage.getItem(key)
  }

  async setItem(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value)
  }

  async removeItem(key: string): Promise<void> {
    localStorage.removeItem(key)
  }

  async getAllKeys(): Promise<string[]> {
    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) keys.push(key)
    }
    return keys
  }

  async clear(): Promise<void> {
    localStorage.clear()
  }
}

// Mock Ad Providers (para desenvolvimento)
export class MockRewardedAdProvider implements IRewardedAdProvider {
  private adClosed: (() => void) | null = null
  private adRewarded: (() => void) | null = null
  private adFailed: ((error: Error) => void) | null = null

  async isReady(): Promise<boolean> {
    return true
  }

  async show(): Promise<void> {
    // Simular anúncio
    await new Promise(resolve => setTimeout(resolve, 2000))
    this.adRewarded?.()
    this.adClosed?.()
  }

  async load(): Promise<void> {
    // Mock
  }

  onAdClosed = (callback: () => void) => {
    this.adClosed = callback
  }

  onAdRewarded = (callback: () => void) => {
    this.adRewarded = callback
  }

  onAdFailed = (callback: (error: Error) => void) => {
    this.adFailed = callback
  }
}

export class MockBannerAdProvider implements IBannerAdProvider {
  async show(): Promise<void> {
    // Mock
  }

  async hide(): Promise<void> {
    // Mock
  }

  async destroy(): Promise<void> {
    // Mock
  }
}

export class MockInterstitialProvider implements IInterstitialProvider {
  private adClosed: (() => void) | null = null
  private adFailed: ((error: Error) => void) | null = null

  async isReady(): Promise<boolean> {
    return true
  }

  async show(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1500))
    this.adClosed?.()
  }

  async load(): Promise<void> {
    // Mock
  }

  onAdClosed = (callback: () => void) => {
    this.adClosed = callback
  }

  onAdFailed = (callback: (error: Error) => void) => {
    this.adFailed = callback
  }
}

// Mock Analytics
export class MockAnalyticsAdapter implements IAnalyticsAdapter {
  async logEvent(eventName: string, params?: Record<string, string | number>): Promise<void> {
    console.log('[Analytics]', eventName, params)
  }

  async setUserProperty(key: string, value: string | number): Promise<void> {
    console.log('[Analytics] Property:', key, value)
  }

  async logError(error: Error, context?: Record<string, unknown>): Promise<void> {
    console.error('[Analytics] Error:', error, context)
  }
}
