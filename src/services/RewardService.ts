import { IRewardedAdProvider } from '@adapters/index'
import { GameEventBus } from './EventBus'
import { HINTS_CONFIG } from '@/core/constants'
import { RewardDeliveryResult, RewardRequestState } from '@/types'

export interface RewardProvider {
  showRewardedAd(): Promise<boolean>
}

export class GoogleAdManagerProvider implements RewardProvider {
  constructor(private readonly provider?: IRewardedAdProvider) {}

  async showRewardedAd(): Promise<boolean> {
    if (this.provider) {
      const isReady = await this.provider.isReady()

      if (!isReady) {
        await this.provider.load()
      }

      await this.provider.show()
      return true
    }

    if (typeof window === 'undefined') {
      return false
    }

    const googletag = (window as Window & {
      googletag?: { cmd: Array<() => void> }
    }).googletag

    if (!googletag) {
      return true
    }

    return await new Promise(resolve => {
      googletag.cmd.push(() => {
        const slotId = 'hint-reward-ad-slot'
        let slot = document.getElementById(slotId)

        if (!slot) {
          slot = document.createElement('div')
          slot.id = slotId
          slot.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;'
          document.body.appendChild(slot)
        }

        window.setTimeout(() => resolve(true), 1200)
      })
    })
  }
}

export class RewardService {
  private rewardInFlight = false
  private cooldownUntil = 0
  private readonly cooldownMs: number
  private readonly eventBus: GameEventBus
  private readonly provider: RewardProvider

  constructor(provider: RewardProvider, eventBus: GameEventBus, cooldownMs = HINTS_CONFIG.AD_COOLDOWN_MS) {
    this.provider = provider
    this.eventBus = eventBus
    this.cooldownMs = cooldownMs
  }

  async requestReward(): Promise<RewardRequestState> {
    if (this.rewardInFlight) {
      return { ok: false, reason: 'in_flight' }
    }

    if (Date.now() < this.cooldownUntil) {
      return { ok: false, reason: 'cooldown', remainingMs: this.cooldownUntil - Date.now() }
    }

    this.rewardInFlight = true
    this.eventBus.publish('RewardRequested')

    try {
      const loaded = await this.provider.showRewardedAd()
      this.eventBus.publish('RewardLoaded')

      if (!loaded) {
        this.rewardInFlight = false
        this.eventBus.publish('RewardFailed', { reason: 'provider' })
        return { ok: false, reason: 'provider' }
      }

      this.eventBus.publish('RewardStarted')
      return { ok: true, reason: 'started' }
    } catch (error) {
      this.rewardInFlight = false
      this.eventBus.publish('RewardFailed', { reason: 'error', error })
      return { ok: false, reason: 'error', error }
    }
  }

  async claimReward(): Promise<RewardDeliveryResult> {
    if (!this.rewardInFlight) {
      return { ok: false, reason: 'not_requested' }
    }

    this.rewardInFlight = false
    this.cooldownUntil = Date.now() + this.cooldownMs
    this.eventBus.publish('RewardCompleted')
    this.eventBus.publish('RewardGranted')
    this.eventBus.publish('RewardCooldownStarted', { remainingMs: this.cooldownMs })

    return {
      ok: true,
      reward: {
        type: 'hint',
        amount: 1,
        grantedAt: Date.now(),
      },
    }
  }

  async failReward(reason: string): Promise<void> {
    this.rewardInFlight = false
    this.eventBus.publish('RewardFailed', { reason })
  }

  getProvider(): RewardProvider {
    return this.provider
  }

  isCooldownActive(): boolean {
    return Date.now() < this.cooldownUntil
  }

  getCooldownRemainingMs(): number {
    return Math.max(0, this.cooldownUntil - Date.now())
  }

  completeCooldown(): void {
    this.cooldownUntil = 0
    this.eventBus.publish('RewardCooldownFinished')
  }
}
