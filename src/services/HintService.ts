// Hint Service - Gerencia dicas diárias e anúncios recompensados

import { HintData } from '@/types'
import { IStorageAdapter } from '@adapters/index'

export class HintService {
  private storage: IStorageAdapter
  private readonly HINTS_PER_DAY = 3
  private readonly STORAGE_KEY = 'game_hints_data'

  constructor(storage: IStorageAdapter) {
    this.storage = storage
  }

  async getDailyHints(): Promise<HintData> {
    const data = await this.storage.getItem(this.STORAGE_KEY)

    if (!data) {
      return this.createNewHintData()
    }

    const hintData = JSON.parse(data) as HintData
    const today = new Date().toDateString()

    // Reset se for um novo dia
    if (hintData.lastResetDate !== today) {
      return this.resetDailyHints()
    }

    return hintData
  }

  async useHint(): Promise<boolean> {
    const hintData = await this.getDailyHints()

    if (hintData.dailyHints > 0) {
      hintData.dailyHints--
      hintData.totalHintsUsed++
      await this.storage.setItem(this.STORAGE_KEY, JSON.stringify(hintData))
      return true
    }

    return false
  }

  async canUseAd(): Promise<boolean> {
    const hintData = await this.getDailyHints()
    // Limitar a 10 anúncios por dia
    return hintData.adsWatched < 10
  }

  async addHintFromAd(): Promise<boolean> {
    const canUse = await this.canUseAd()

    if (canUse) {
      const hintData = await this.getDailyHints()
      hintData.dailyHints++
      hintData.adsWatched++
      await this.storage.setItem(this.STORAGE_KEY, JSON.stringify(hintData))
      return true
    }

    return false
  }

  async resetDailyHints(): Promise<HintData> {
    const newData = this.createNewHintData()
    await this.storage.setItem(this.STORAGE_KEY, JSON.stringify(newData))
    return newData
  }

  private createNewHintData(): HintData {
    return {
      dailyHints: this.HINTS_PER_DAY,
      totalHintsUsed: 0,
      lastResetDate: new Date().toDateString(),
      adsWatched: 0,
    }
  }

  getHintStrategies(wordLength: number): string[] {
    return [
      'first_letter',
      'direction',
      'partial_word',
      'highlight_area',
    ]
  }

  generateHintText(strategy: string, word: string): string {
    switch (strategy) {
      case 'first_letter':
        return `A palavra começa com "${word[0]}"`
      case 'direction':
        return 'A direção foi destacada'
      case 'partial_word':
        return `Palavra: ${word[0]}${'_'.repeat(word.length - 2)}${word[word.length - 1]}`
      case 'highlight_area':
        return 'Área destacada na próxima dica'
      default:
        return 'Dica disponível'
    }
  }
}
