import { IStorageAdapter } from '@adapters/index'
import { GameEventBus } from './EventBus'
import { HINTS_CONFIG } from '@/core/constants'
import { HintState, HintStrategy, HintUsageResult } from '@/types'

export class HintService {
  private readonly storage: IStorageAdapter
  private readonly storageKey: string
  private readonly eventBus: GameEventBus

  constructor(storage: IStorageAdapter, eventBus: GameEventBus, storageKey = 'game_hints_state') {
    this.storage = storage
    this.eventBus = eventBus
    this.storageKey = storageKey
  }

  async getHintState(): Promise<HintState> {
    const raw = await this.storage.getItem(this.storageKey)

    if (!raw) {
      return this.createInitialState()
    }

    try {
      const parsed = JSON.parse(raw) as HintState
      return {
        ...this.createInitialState(),
        ...parsed,
        remainingHints: parsed.remainingHints ?? HINTS_CONFIG.DAILY_FREE_HINTS,
        usedHints: parsed.usedHints ?? 0,
        rewardedHints: parsed.rewardedHints ?? 0,
        rewardedAdsWatched: parsed.rewardedAdsWatched ?? 0,
      }
    } catch {
      return this.createInitialState()
    }
  }

  async useHint(): Promise<HintUsageResult> {
    const state = await this.getHintState()

    if (!this.canUseHint(state)) {
      return { ok: false, reason: 'none_remaining' }
    }

    state.remainingHints -= 1
    state.usedHints += 1
    await this.persist(state)
    this.eventBus.publish('HintUsed', { remainingHints: state.remainingHints })
    return { ok: true, remainingHints: state.remainingHints }
  }

  async addHints(amount: number): Promise<HintState> {
    const state = await this.getHintState()
    state.remainingHints += amount
    state.rewardedHints += amount
    state.rewardedAdsWatched += 1
    await this.persist(state)
    this.eventBus.publish('HintGranted', { remainingHints: state.remainingHints })
    return state
  }

  async resetHints(): Promise<HintState> {
    const state = this.createInitialState()
    await this.persist(state)
    return state
  }

  canUseHint(state: HintState): boolean {
    return state.remainingHints > 0
  }

  getRemainingHints(state: HintState): number {
    return state.remainingHints
  }

  async getHintOptions(wordLength: number): Promise<HintStrategy[]> {
    const base: HintStrategy[] = ['first_letter', 'direction', 'partial_word']
    return wordLength > 4 ? [...base, 'highlight_area'] : base
  }

  generateHintText(strategy: HintStrategy, word: string): string {
    switch (strategy) {
      case 'first_letter':
        return `A palavra começa com "${word[0]}".`
      case 'direction':
        return 'A direção da palavra foi destacada.'
      case 'partial_word':
        return `Palavra: ${word[0]}${'_'.repeat(Math.max(0, word.length - 2))}${word[word.length - 1]}`
      case 'highlight_area':
        return 'Uma área da grade foi destacada para orientar a busca.'
      default:
        return 'Dica disponível.'
    }
  }

  async buildHintForWord(word: string, wordLength: number): Promise<{ text: string; strategy: HintStrategy }> {
    const strategies = await this.getHintOptions(wordLength)
    const strategy = strategies[Math.floor(Math.random() * strategies.length)]
    return {
      text: this.generateHintText(strategy, word),
      strategy,
    }
  }

  private async persist(state: HintState): Promise<void> {
    await this.storage.setItem(this.storageKey, JSON.stringify(state))
  }

  private createInitialState(): HintState {
    return {
      remainingHints: HINTS_CONFIG.DAILY_FREE_HINTS,
      usedHints: 0,
      rewardedHints: 0,
      rewardedAdsWatched: 0,
      gameStart: Date.now(),
      gameFinish: null,
    }
  }
}
